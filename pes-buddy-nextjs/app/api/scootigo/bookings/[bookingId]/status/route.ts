import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateBookingStatusSchema } from "@/lib/validations/scootigo";

type Params = { params: Promise<{ bookingId: string }> };

export async function PATCH(req: Request, { params }: Params) {
  await requireAdmin();
  const { bookingId } = await params;

  try {
    const body = await req.json();
    const { status } = updateBookingStatusSchema.parse(body);

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        user: { select: { name: true } },
        scooter: true,
      },
    });

    // If completing, free the scooter
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
