import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const bookings = await db.booking.findMany({
      include: {
        user: { select: { id: true, name: true, srn: true, email: true } },
        scooter: { select: { id: true, scooterId: true, driverName: true, vehicleNumber: true, route: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = bookings.map((b) => ({
      ...b,
      userName: b.user?.name,
      driverName: b.scooter?.driverName,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("[Admin/Bookings]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
