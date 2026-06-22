import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const notification = await db.notification.updateMany({
      where: { id, userId: session.user.id },
      data: { read: true },
    });

    if (notification.count === 0) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Marked as read" });
  } catch (err) {
    console.error("[Notifications/MarkRead]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await db.notification.deleteMany({
      where: { id, userId: session.user.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("[Notifications/Delete]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
