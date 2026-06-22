"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface Props {
  canteen: { id: string; name: string };
  grouped: Record<string, MenuItem[]>;
}

export function MenuPageClient({ canteen, grouped }: Props) {
  const { addItem, items: cartItems } = useCart();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Object.keys(grouped);
  const filteredGrouped = Object.entries(grouped).reduce<Record<string, MenuItem[]>>(
    (acc, [cat, items]) => {
      const filtered = items.filter(
        (item) =>
          (!activeCategory || cat === activeCategory) &&
          item.name.toLowerCase().includes(search.toLowerCase())
      );
      if (filtered.length > 0) acc[cat] = filtered;
      return acc;
    },
    {}
  );

  const getCartQty = (id: string) =>
    cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;

  const handleAdd = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      canteenId: canteen.id,
      canteenName: canteen.name,
    });
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            className="input-base pl-12"
          />
        </div>
        <Link
          href="/doormato/cart"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all flex items-center gap-2"
        >
          🛒 View Cart
          {cartItems.length > 0 && (
            <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </Link>
      </div>

      {/* Category filter */}
      {categories.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              !activeCategory ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === cat ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Menu items */}
      {Object.entries(filteredGrouped).length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-xl text-gray-400">No items found</p>
        </div>
      ) : (
        Object.entries(filteredGrouped).map(([category, items]) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-500 rounded"></span>
              {category}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, i) => {
                const cartQty = getCartQty(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass rounded-2xl overflow-hidden ${!item.available ? "opacity-50" : "card-hover"}`}
                  >
                    {item.imageUrl && (
                      <div className="relative h-36">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        {!item.available && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-bold text-sm bg-red-500 px-3 py-1 rounded-lg">
                              Unavailable
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-bold">{item.name}</h3>
                        <span className="text-blue-400 font-bold text-lg">{formatCurrency(item.price)}</span>
                      </div>
                      {item.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                      )}
                      {item.available && (
                        <div className="flex items-center gap-2">
                          {cartQty > 0 ? (
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-blue-400 text-sm font-semibold">
                                {cartQty} in cart
                              </span>
                              <button
                                onClick={() => handleAdd(item)}
                                className="ml-auto px-3 py-1.5 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-500/30 transition-all"
                              >
                                + Add
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAdd(item)}
                              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
