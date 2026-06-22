import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const orders = await db.order.findMany({
      include: {
        user: { select: { id: true, name: true, srn: true, email: true } },
        items: {
          include: {
            canteen: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = orders.map((o) => ({ ...o, userName: o.user?.name }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("[Admin/Orders]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
