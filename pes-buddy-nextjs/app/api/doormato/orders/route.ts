import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { canteen: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("[Doormato/Orders]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
