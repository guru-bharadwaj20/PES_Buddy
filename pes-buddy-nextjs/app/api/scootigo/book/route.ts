import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cache } from "@/lib/redis";
import { bookScooterSchema } from "@/lib/validations/scootigo";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = bookScooterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { scooterId, pickup, destination, distance } = parsed.data;

    // Find the scooter
    const scooter = await db.scooter.findUnique({ where: { scooterId } });
    if (!scooter) {
      return NextResponse.json({ message: "Scooter not found" }, { status: 404 });
    }
    if (!scooter.available) {
      return NextResponse.json({ message: "Scooter not available" }, { status: 400 });
    }

    const totalFare = distance * scooter.farePerKm;

    // Mark scooter unavailable and create booking in a transaction
    const [updatedScooter, booking] = await db.$transaction([
      db.scooter.update({
        where: { id: scooter.id },
        data: { available: false },
      }),
      db.booking.create({
        data: {
          userId: session.user.id,
          scooterId: scooter.id,
          driver: scooter.driverName ?? "Unknown",
          vehicleNumber: scooter.vehicleNumber ?? "N/A",
          pickup,
          destination,
          distance,
          farePerKm: scooter.farePerKm,
          totalFare,
          status: "PENDING",
        },
      }),
    ]);

    // Create notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: "BOOKING",
        title: "Scooter Booked",
        message: `Your ride with ${scooter.driverName} has been booked. Total fare: ₹${totalFare.toFixed(2)}`,
        relatedId: booking.id,
        icon: "🛵",
      },
    });

    // Invalidate scooter cache
    await cache.del("scooters:all");

    // Emit Socket.IO event
    const io = (globalThis as Record<string, unknown>).__io as import("socket.io").Server | undefined;
    if (io) {
      io.emit("scooter:booked", {
        scooterId: updatedScooter.scooterId,
        available: false,
        bookedBy: session.user.name,
        timestamp: new Date(),
      });
    }

    return NextResponse.json({ message: "Scooter booked", booking });
  } catch (err) {
    console.error("[Scootigo/Book]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
