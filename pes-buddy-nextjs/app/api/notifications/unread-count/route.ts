import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await db.notification.count({
      where: { userId: session.user.id, read: false },
    });

    return NextResponse.json({ count });
  } catch (err) {
    console.error("[Notifications/UnreadCount]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
