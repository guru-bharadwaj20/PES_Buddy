"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSocket } from "@/components/providers/SocketProvider";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import type { Order } from "@/types";

type FilterStatus = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED";

export default function AdminDoormato() {
  const { socket } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("PENDING");
  const [updating, setUpdating] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<{ orderId: string; reason: string } | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time: new orders appear immediately
  useEffect(() => {
    if (!socket) return;
    const handleNew = (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      toast(`New order from ${order.userName ?? "a student"}!`, { icon: "🍕" });
    };
    socket.on("order:new", handleNew);
    return () => socket.off("order:new", handleNew);
  }, [socket]);

  const updateStatus = async (orderId: string, status: string, rejectionReason?: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/doormato/order/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...(rejectionReason ? { rejectionReason } : {}) }),
      });
      if (!res.ok) { toast.error("Failed to update order"); return; }
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: status as Order["status"], rejectionReason } : o));
      toast.success(`Order ${status.toLowerCase()}`);
      setRejectReason(null);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          🍕 Doormato Orders
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-2.5 py-0.5 rounded-full">{pendingCount} pending</span>
          )}
        </h1>
        <p className="text-gray-400 mt-1">Manage food orders. New orders appear in real-time.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(["ALL", "PENDING", "ACCEPTED", "REJECTED", "DELIVERED"] as FilterStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === s ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {s === "ALL" ? "All" : s}
            {s === "PENDING" && pendingCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-skeleton">
              <div className="h-5 bg-gray-700 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-400">No {filter !== "ALL" ? filter.toLowerCase() : ""} orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass rounded-2xl p-6 border-2 transition-all ${
                order.status === "PENDING" ? "border-yellow-500/30" : "border-transparent"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-blue-400 font-mono text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-white font-bold text-lg">{order.userName ?? "Student"}</p>
                  <p className="text-gray-400 text-sm">{order.canteenName} • {formatDateTime(order.createdAt)}</p>

                  {/* Items */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {order.items?.map((item) => (
                      <span key={item.id} className="bg-gray-800/60 text-gray-300 text-xs px-2.5 py-1 rounded-lg">
                        {item.quantity}× {item.name}
                      </span>
                    ))}
                  </div>

                  {order.rejectionReason && (
                    <p className="text-red-400 text-xs mt-2">Rejection reason: {order.rejectionReason}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="text-white font-bold text-2xl">{formatCurrency(order.total)}</p>

                  {order.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(order.id, "ACCEPTED")}
                        disabled={updating === order.id}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => setRejectReason({ orderId: order.id, reason: "" })}
                        disabled={updating === order.id}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-xl text-sm border border-red-500/50 transition-all disabled:opacity-50"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}

                  {order.status === "ACCEPTED" && (
                    <button
                      onClick={() => updateStatus(order.id, "DELIVERED")}
                      disabled={updating === order.id}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                    >
                      📦 Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject dialog */}
      {rejectReason && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">Reject Order</h3>
            <p className="text-gray-400 text-sm mb-4">Provide a reason so the student knows why their order was rejected.</p>
            <textarea
              value={rejectReason.reason}
              onChange={(e) => setRejectReason({ ...rejectReason, reason: e.target.value })}
              placeholder="e.g. Item out of stock, Canteen closed..."
              className="input-base resize-none h-24 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejectReason(null)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus(rejectReason.orderId, "REJECTED", rejectReason.reason)}
                disabled={!rejectReason.reason.trim() || updating === rejectReason.orderId}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
