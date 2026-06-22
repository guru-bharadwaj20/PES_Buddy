import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createOrderSchema } from "@/lib/validations/doormato";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { canteenName, items } = parsed.data;

    // Build order items and compute total
    const orderItems: Array<{
      menuItemId: string;
      canteenId: string;
      name: string;
      price: number;
      quantity: number;
    }> = [];

    let total = 0;

    for (const item of items) {
      const menuItem = await db.menuItem.findUnique({
        where: { id: item.menuItem },
        include: { canteen: true },
      });
      if (!menuItem) continue;

      const qty = item.qty > 0 ? item.qty : 1;
      orderItems.push({
        menuItemId: menuItem.id,
        canteenId: menuItem.canteenId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: qty,
      });
      total += menuItem.price * qty;
    }

    if (orderItems.length === 0) {
      return NextResponse.json({ message: "No valid items found" }, { status: 400 });
    }

    const order = await db.order.create({
      data: {
        userId: session.user.id,
        canteenName: canteenName ?? "",
        total,
        totalAmount: total,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: "ORDER",
        title: "Order Placed",
        message: `Your order from ${canteenName} for ₹${total.toFixed(2)} has been placed. Waiting for confirmation.`,
        relatedId: order.id,
        icon: "🍔",
      },
    });

    // Emit Socket.IO event
    const io = (globalThis as Record<string, unknown>).__io as import("socket.io").Server | undefined;
    if (io) {
      io.emit("order:new", {
        orderId: order.id,
        userId: session.user.id,
        userName: session.user.name,
        canteenName,
        total,
        itemCount: orderItems.length,
        timestamp: new Date(),
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("[Doormato/CreateOrder]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
