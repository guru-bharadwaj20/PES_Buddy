"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSocket } from "@/components/providers/SocketProvider";
import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { formatCurrency } from "@/lib/utils";

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  icon: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { connected, connectedUsers, socket } = useSocket();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({ orders: 0, bookings: 0, expenses: 0 });

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data: { userName: string; canteenName: string; total: number; timestamp: string }) => {
      setRecentActivity((prev) => [
        {
          type: "order",
          message: `${data.userName} placed an order at ${data.canteenName}`,
          time: new Date(data.timestamp).toLocaleTimeString(),
          icon: "🍔",
        },
        ...prev,
      ].slice(0, 5));
    };

    const handleScooterBooked = (data: { bookedBy: string; scooterId: string; timestamp: string }) => {
      setRecentActivity((prev) => [
        {
          type: "scooter",
          message: `${data.bookedBy} booked scooter ${data.scooterId}`,
          time: new Date(data.timestamp).toLocaleTimeString(),
          icon: "🛵",
        },
        ...prev,
      ].slice(0, 5));
    };

    socket.on("order:new", handleNewOrder);
    socket.on("scooter:booked", handleScooterBooked);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("scooter:booked", handleScooterBooked);
    };
  }, [socket]);

  const quickLinks = [
    { href: "/doormato", icon: "🍔", title: "Doormato", desc: "Order campus food", color: "from-orange-500/20 to-red-500/10" },
    { href: "/scootigo", icon: "🛵", title: "Scootigo", desc: "Book a ride", color: "from-blue-500/20 to-cyan-500/10" },
    { href: "/expense-tracker", icon: "💰", title: "Expenses", desc: "Track spending", color: "from-green-500/20 to-emerald-500/10" },
    { href: "/notifications", icon: "🔔", title: "Notifications", desc: "Check updates", color: "from-purple-500/20 to-pink-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome */}
      <AnimatedSection>
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="gradient-text">{session?.user?.name?.split(" ")[0]}</span>! 👋
          </h1>
          <p className="text-xl text-gray-300">
            SRN: <span className="text-blue-400 font-mono">{session?.user?.srn}</span>
          </p>
        </div>
      </AnimatedSection>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link, i) => (
          <AnimatedSection key={link.href} delay={i * 0.1}>
            <Link
              href={link.href}
              className={`glass rounded-2xl p-6 card-hover bg-gradient-to-br ${link.color} block`}
            >
              <div className="text-4xl mb-3">{link.icon}</div>
              <h3 className="text-white font-bold text-lg">{link.title}</h3>
              <p className="text-gray-400 text-sm">{link.desc}</p>
            </Link>
          </AnimatedSection>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Connection Status */}
        <AnimatedSection delay={0.2}>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Connection Status</h3>
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={connected ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-4 h-4 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-white font-semibold">
                {connected ? "✅ Real-time Connected" : "❌ Disconnected"}
              </span>
            </div>
            {connectedUsers > 0 && (
              <p className="text-gray-400">
                👥 {connectedUsers} user{connectedUsers !== 1 ? "s" : ""} online right now
              </p>
            )}
          </div>
        </AnimatedSection>

        {/* Recent Activity */}
        <AnimatedSection delay={0.3}>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Live Activity</h3>
            {recentActivity.length === 0 ? (
              <p className="text-gray-400">Waiting for live updates...</p>
            ) : (
              <ul className="space-y-2">
                {recentActivity.map((item, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span>{item.icon}</span>
                    <span>
                      <span className="text-blue-400">[{item.time}]</span>{" "}
                      <span className="text-gray-300">{item.message}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
