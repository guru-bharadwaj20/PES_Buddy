"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import type { Booking } from "@/types";

type FilterStatus = "ALL" | "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export default function AdminScootigo() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) setBookings(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId: string, status: string) => {
    setUpdating(bookingId);
    try {
      const res = await fetch(`/api/scootigo/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { toast.error("Failed to update booking"); return; }
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: status as Booking["status"] } : b));
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const activeCount = bookings.filter((b) => b.status === "ACTIVE").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          🛵 Scootigo Bookings
          {pendingCount > 0 && (
            <span className="bg-yellow-500 text-white text-sm px-2.5 py-0.5 rounded-full">{pendingCount} pending</span>
          )}
          {activeCount > 0 && (
            <span className="bg-green-500 text-white text-sm px-2.5 py-0.5 rounded-full">{activeCount} active</span>
          )}
        </h1>
        <p className="text-gray-400 mt-1">Monitor and manage all scooter bookings</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {(["ALL", "PENDING", "ACTIVE", "COMPLETED", "CANCELLED"] as FilterStatus[]).map((status) => {
          const count = status === "ALL" ? bookings.length : bookings.filter((b) => b.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`glass rounded-xl p-4 text-center transition-all border-2 ${
                filter === status ? "border-blue-500" : "border-transparent"
              }`}
            >
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-gray-400 text-sm">{status === "ALL" ? "Total" : status}</p>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-skeleton">
              <div className="h-5 bg-gray-700 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🛵</div>
          <p className="text-xl text-gray-400">No {filter !== "ALL" ? filter.toLowerCase() : ""} bookings</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-blue-400 font-mono text-sm">#{booking.id.slice(-8).toUpperCase()}</p>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-white font-bold text-lg">{booking.userName ?? "Student"}</p>
                  <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                    <span>{booking.pickup}</span>
                    <span>→</span>
                    <span>{booking.destination}</span>
                  </div>
                  {booking.driverName && (
                    <p className="text-gray-500 text-sm mt-1">
                      Driver: {booking.driverName} • {booking.vehicleNumber}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formatDateTime(booking.createdAt)}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="text-white font-bold text-2xl">{formatCurrency(booking.totalFare)}</p>
                  {booking.distance && (
                    <p className="text-gray-400 text-sm">{booking.distance} km</p>
                  )}

                  {booking.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(booking.id, "ACTIVE")}
                        disabled={updating === booking.id}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                      >
                        🛵 Start Ride
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, "CANCELLED")}
                        disabled={updating === booking.id}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-xl text-sm border border-red-500/50 transition-all disabled:opacity-50"
                      >
                        ✗ Cancel
                      </button>
                    </div>
                  )}

                  {booking.status === "ACTIVE" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(booking.id, "COMPLETED")}
                        disabled={updating === booking.id}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                      >
                        ✓ Complete
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, "CANCELLED")}
                        disabled={updating === booking.id}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-xl text-sm border border-red-500/50 transition-all disabled:opacity-50"
                      >
                        ✗ Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
