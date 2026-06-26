"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSocket } from "@/components/providers/SocketProvider";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import type { Order } from "@/types";

export default function MyOrdersPage() {
  const { socket } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/doormato/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Live order status updates
  useEffect(() => {
    if (!socket) return;

    const handleStatus = (data: { orderId: string; status: string }) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === data.orderId ? { ...o, status: data.status as Order["status"] } : o))
      );
    };

    socket.on("order:status", handleStatus);
    return () => { socket.off("order:status", handleStatus); };
  }, [socket]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">📦 My Orders</h1>
          <p className="text-gray-400 mt-1">Track your food order history</p>
        </div>
        <Link
          href="/doormato"
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
        >
          Order More
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-skeleton">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-7xl mb-4">📭</div>
          <h3 className="text-2xl font-bold text-white mb-2">No orders yet</h3>
          <p className="text-gray-400 mb-6">Start ordering from campus canteens!</p>
          <Link
            href="/doormato"
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
          >
            Browse Canteens
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover:border-blue-500/30 border border-transparent transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-blue-400 font-mono text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-white font-bold text-lg">{order.canteenName}</p>
                  <p className="text-gray-400 text-sm">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status} />
                  <span className="text-2xl font-bold text-white">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Items */}
              <div className="flex flex-wrap gap-2">
                {order.items?.map((item) => (
                  <span
                    key={item.id}
                    className="bg-gray-800/50 text-gray-300 text-sm px-3 py-1 rounded-lg"
                  >
                    {item.quantity}× {item.name}
                  </span>
                ))}
              </div>

              {/* Rejection reason */}
              {order.status === "REJECTED" && order.rejectionReason && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">
                    <span className="font-bold">Reason:</span> {order.rejectionReason}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
