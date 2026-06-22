import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cache } from "@/lib/redis";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const cacheKey = "admin:stats:dashboard";
    const cached = await cache.get(cacheKey);
    if (cached) return NextResponse.json(cached);

    const [
      totalOrders,
      totalBookings,
      totalUsers,
      orderRevResult,
      bookingRevResult,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      db.order.count(),
      db.booking.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.order.aggregate({ _sum: { total: true } }),
      db.booking.aggregate({ _sum: { totalFare: true } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, srn: true } } },
      }),
      db.order.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    const orderRevenue = orderRevResult._sum.total ?? 0;
    const bookingRevenue = bookingRevResult._sum.totalFare ?? 0;
    const totalRevenue = orderRevenue + bookingRevenue;

    const stats = {
      totalOrders,
      totalBookings,
      totalUsers,
      totalRevenue,
      orderRevenue,
      bookingRevenue,
      recentOrders,
      ordersByStatus,
    };

    await cache.set(cacheKey, stats, 60); // 1 minute cache
    return NextResponse.json(stats);
  } catch (err) {
    console.error("[Admin/Stats]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
