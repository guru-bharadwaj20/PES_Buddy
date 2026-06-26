"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/components/providers/SocketProvider";
import type { Notification } from "@/types";

export function useNotifications() {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/notifications/unread-count");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count ?? 0);
      }
    } catch {}
  }, [session]);

  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNew = () => {
      setUnreadCount((prev) => prev + 1);
      fetchNotifications();
    };

    socket.on("notification:new", handleNew);
    socket.on("notification:receive", handleNew);

    return () => {
      socket.off("notification:new", handleNew);
      socket.off("notification:receive", handleNew);
    };
  }, [socket, fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await fetch("/api/notifications/mark-all-read", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    setNotifications((prev) => {
      const deleted = prev.find((n) => n.id === id);
      if (deleted && !deleted.read) setUnreadCount((c) => Math.max(0, c - 1));
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
