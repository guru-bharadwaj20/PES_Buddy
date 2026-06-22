"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { items, canteenName, total, removeItem, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        menuItem: item.menuItemId,
        qty: item.quantity,
      }));

      const res = await fetch("/api/doormato/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canteenName, items: orderItems }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message ?? "Failed to place order");
        return;
      }

      clearCart();
      toast.success("Order placed successfully! 🎉");
      router.push("/doormato/my-orders");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some delicious items from our canteens!</p>
        <Link
          href="/doormato"
          className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
        >
          Browse Canteens
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">🛒 Your Cart</h1>
        <button
          onClick={() => { clearCart(); toast.success("Cart cleared"); }}
          className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Canteen info */}
      <div className="glass rounded-xl p-4 mb-6 border border-blue-500/30">
        <p className="text-gray-400 text-sm">Ordering from</p>
        <p className="text-white font-bold text-lg">{canteenName}</p>
      </div>

      {/* Cart items */}
      <div className="glass rounded-2xl overflow-hidden mb-6">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.menuItemId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-4 p-5 ${i < items.length - 1 ? "border-b border-white/10" : ""}`}
            >
              <div className="flex-1">
                <h3 className="text-white font-semibold">{item.name}</h3>
                <p className="text-blue-400 text-sm">{formatCurrency(item.price)} each</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center font-bold transition-all"
                >
                  −
                </button>
                <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center font-bold transition-all"
                >
                  +
                </button>
              </div>

              <div className="w-20 text-right">
                <p className="text-white font-bold">{formatCurrency(item.price * item.quantity)}</p>
              </div>

              <button
                onClick={() => { removeItem(item.menuItemId); toast.success("Item removed"); }}
                className="text-red-400 hover:text-red-300 p-1 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="text-white font-bold text-lg mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.menuItemId} className="flex justify-between text-sm">
              <span className="text-gray-400">{item.name} × {item.quantity}</span>
              <span className="text-white">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between">
          <span className="text-white font-bold text-lg">Total</span>
          <span className="text-blue-400 font-bold text-2xl">{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full py-5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl rounded-2xl
                   transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-blue-500/30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Placing Order...
          </span>
        ) : (
          `Place Order — ${formatCurrency(total)}`
        )}
      </button>
    </div>
  );
}
