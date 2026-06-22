"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime, formatCurrency } from "@/lib/utils";

interface Props {
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

export function AdminDashboardClient({ recentOrders, recentBookings }: Props) {
  const [tab, setTab] = useState<"orders" | "bookings">("orders");

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setTab("orders")}
          className={`flex-1 py-4 text-sm font-bold transition-all ${
            tab === "orders" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
          }`}
        >
          🍕 Recent Orders
        </button>
        <button
          onClick={() => setTab("bookings")}
          className={`flex-1 py-4 text-sm font-bold transition-all ${
            tab === "bookings" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
          }`}
        >
          🛵 Recent Bookings
        </button>
      </div>

      <div className="p-6">
        {tab === "orders" && (
          <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {recentOrders.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-white/10">
                      <th className="text-left py-3 px-2">Order ID</th>
                      <th className="text-left py-3 px-2">Student</th>
                      <th className="text-left py-3 px-2">Items</th>
                      <th className="text-left py-3 px-2">Total</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2 font-mono text-blue-400 text-xs">
                          #{order.id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-3 px-2">
                          <p className="text-white font-medium">{order.user.name}</p>
                          <p className="text-gray-500 text-xs">{order.user.srn}</p>
                        </td>
                        <td className="py-3 px-2 text-gray-300 max-w-xs">
                          {order.items.slice(0, 2).map((i) => `${i.quantity}× ${i.menuItem.name}`).join(", ")}
                          {order.items.length > 2 && ` +${order.items.length - 2} more`}
                        </td>
                        <td className="py-3 px-2 text-white font-bold">{formatCurrency(order.total)}</td>
                        <td className="py-3 px-2"><StatusBadge status={order.status} /></td>
                        <td className="py-3 px-2 text-gray-400 text-xs">{formatDateTime(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {tab === "bookings" && (
          <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {recentBookings.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No bookings yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-white/10">
                      <th className="text-left py-3 px-2">Student</th>
                      <th className="text-left py-3 px-2">Route</th>
                      <th className="text-left py-3 px-2">Driver</th>
                      <th className="text-left py-3 px-2">Fare</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2">
                          <p className="text-white font-medium">{booking.user.name}</p>
                          <p className="text-gray-500 text-xs">{booking.user.srn}</p>
                        </td>
                        <td className="py-3 px-2 text-gray-300 text-xs">
                          {booking.pickup} → {booking.destination}
                        </td>
                        <td className="py-3 px-2 text-gray-300">
                          <p>{booking.scooter.driverName}</p>
                          <p className="text-gray-500 text-xs">{booking.scooter.vehicleNumber}</p>
                        </td>
                        <td className="py-3 px-2 text-white font-bold">{formatCurrency(booking.totalFare)}</td>
                        <td className="py-3 px-2"><StatusBadge status={booking.status} /></td>
                        <td className="py-3 px-2 text-gray-400 text-xs">{formatDateTime(booking.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
