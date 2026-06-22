import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateOrderStatusSchema } from "@/lib/validations/doormato";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;

  try {
    const body = await req.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid status", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { status, rejectionReason } = parsed.data;

    const order = await db.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(status === "REJECTED" && rejectionReason ? { rejectionReason } : {}),
      },
      include: {
        user: { select: { id: true, name: true, srn: true } },
        items: true,
      },
    });

    // Build notification
    const notifMap: Record<string, { title: string; message: string; icon: string }> = {
      ACCEPTED: { title: "Order Accepted", message: "Great news! Your order has been accepted and is being prepared.", icon: "✅" },
      REJECTED: { title: "Order Rejected", message: `Sorry, your order was rejected. Reason: ${order.rejectionReason ?? "Not specified"}`, icon: "❌" },
      PREPARING: { title: "Order Being Prepared", message: "Your order is now being prepared.", icon: "👨‍🍳" },
      COMPLETED: { title: "Order Ready!", message: "Your order is ready for pickup!", icon: "✓" },
    };

    const notif = notifMap[status];
    if (notif) {
      await db.notification.create({
        data: {
          userId: order.user.id,
          type: "ORDER",
          title: notif.title,
          message: notif.message,
          relatedId: order.id,
          icon: notif.icon,
        },
      });
    }

    // Emit Socket.IO events
    const io = (globalThis as Record<string, unknown>).__io as import("socket.io").Server | undefined;
    if (io) {
      io.emit("order:status", {
        orderId: order.id,
        userId: order.user.id,
        status: order.status,
        rejectionReason: order.rejectionReason,
        timestamp: new Date(),
      });
      if (notif) {
        io.to(`user:${order.user.id}`).emit("notification:new", notif);
      }
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error("[Doormato/UpdateStatus]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
