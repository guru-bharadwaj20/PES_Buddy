import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateBookingStatusSchema } from "@/lib/validations/scootigo";

type Params = { params: Promise<{ bookingId: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { bookingId } = await params;

  try {
    const body = await req.json();
    const parsed = updateBookingStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid status", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { status } = parsed.data;

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        user: { select: { name: true } },
        scooter: true,
      },
    });

    // If completing or cancelling, free the scooter
    if (status === "COMPLETED" || status === "CANCELLED") {
      await db.scooter.update({
        where: { id: booking.scooterId },
        data: { available: true },
      });
    }

    return NextResponse.json(booking);
  } catch (err) {
    console.error("[Booking/Status]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
