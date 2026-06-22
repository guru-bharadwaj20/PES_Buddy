import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Cascade delete: orders, bookings, expenses, notifications all have onDelete: Cascade
    await db.user.delete({ where: { id: session.user.id } });
    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("[Auth/DeleteAccount]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
