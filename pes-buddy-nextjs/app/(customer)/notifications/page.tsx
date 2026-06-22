"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { formatRelativeTime } from "@/lib/utils";
import type { Notification } from "@/types";

const TYPE_ICONS: Record<string, string> = {
  ORDER: "🍕",
  SCOOTER: "🛵",
  EXPENSE: "💰",
  GENERAL: "🔔",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=50");
      if (res.ok) setNotifications(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/mark-all-read", { method: "PATCH" });
      if (!res.ok) { toast.error("Failed to mark all as read"); return; }
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch {
      // silent fail for individual mark-read
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (!res.ok) { toast.error("Failed to delete notification"); return; }
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error("Something went wrong");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            🔔 Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-400 mt-1">Stay updated with your activities</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 animate-skeleton">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-7xl mb-4">🔔</div>
          <h3 className="text-2xl font-bold text-white mb-2">No notifications yet</h3>
          <p className="text-gray-400">Order food or book a scooter to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !n.read && markRead(n.id)}
                className={`glass rounded-xl p-5 flex items-start gap-4 cursor-pointer transition-all border-2 ${
                  !n.read
                    ? "border-blue-500/30 bg-blue-500/5"
                    : "border-transparent"
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                  {TYPE_ICONS[n.type] ?? "🔔"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${!n.read ? "text-white" : "text-gray-300"}`}>
                    {n.title}
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">{n.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!n.read && (
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                    title="Delete notification"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
