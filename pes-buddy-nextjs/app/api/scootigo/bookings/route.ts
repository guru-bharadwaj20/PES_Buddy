import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await db.booking.findMany({
      where: { userId: session.user.id },
      include: { scooter: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (err) {
    console.error("[Scootigo/Bookings]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
