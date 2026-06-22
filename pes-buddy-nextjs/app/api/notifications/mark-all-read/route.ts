import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });

    return NextResponse.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("[Notifications/MarkAllRead]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
