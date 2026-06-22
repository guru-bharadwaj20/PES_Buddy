import { Suspense } from "react";
import { db } from "@/lib/db";
import { cache } from "@/lib/redis";
import { formatCurrency } from "@/lib/utils";
import { AdminDashboardClient } from "@/features/admin/AdminDashboardClient";

async function getStats() {
  const cached = await cache.get("admin:stats");
  if (cached) return cached as AdminStats;

  const [
    totalUsers, totalOrders, totalBookings,
    pendingOrders, activeBookings,
    revenueResult, recentOrders, recentBookings,
  ] = await Promise.all([
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.count(),
    db.booking.count(),
    db.order.count({ where: { status: "PENDING" } }),
    db.booking.count({ where: { status: "ACTIVE" } }),
    db.order.aggregate({ _sum: { total: true }, where: { status: { not: "REJECTED" } } }),
    db.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, srn: true } }, items: { include: { menuItem: true } } },
    }),
    db.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, srn: true } }, scooter: true },
    }),
  ]);

  const stats: AdminStats = {
    totalUsers, totalOrders, totalBookings, pendingOrders, activeBookings,
    totalRevenue: revenueResult._sum.total ?? 0,
    recentOrders: recentOrders as unknown as AdminStats["recentOrders"],
    recentBookings: recentBookings as unknown as AdminStats["recentBookings"],
  };

  await cache.set("admin:stats", stats, 60);
  return stats;
}

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalBookings: number;
  pendingOrders: number;
  activeBookings: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string; status: string; total: number; createdAt: string;
    user: { name: string; srn: string };
    items: Array<{ menuItem: { name: string }; quantity: number }>;
  }>;
  recentBookings: Array<{
    id: string; status: string; totalFare: number; pickup: string; destination: string; createdAt: string;
    user: { name: string; srn: string };
    scooter: { driverName: string; vehicleNumber: string };
  }>;
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Students", value: stats.totalUsers, icon: "👥", color: "blue" },
    { label: "Total Orders", value: stats.totalOrders, icon: "📦", color: "green" },
    { label: "Total Bookings", value: stats.totalBookings, icon: "🛵", color: "purple" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: "⏳", color: "yellow" },
    { label: "Active Rides", value: stats.activeBookings, icon: "🏃", color: "red" },
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: "💰", color: "green" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Real-time overview of PES Buddy operations</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map((card, i) => (
          <div key={card.label} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{card.icon}</span>
            </div>
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="text-white font-bold text-2xl mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <AdminDashboardClient
        recentOrders={stats.recentOrders}
        recentBookings={stats.recentBookings}
      />
    </div>
  );
}
