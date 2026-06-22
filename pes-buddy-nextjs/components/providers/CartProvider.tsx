"use client";

import { createContext, useCallback, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { CartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  canteenName: string;
  canteenId: string;
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, qty: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue>({
  items: [],
  canteenName: "",
  canteenId: "",
  itemCount: 0,
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const storageKey = userId ? `pesbuddy_cart_${userId}` : null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [canteenName, setCanteenName] = useState("");
  const [canteenId, setCanteenId] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { items: savedItems, canteenName: cn, canteenId: cid } = JSON.parse(saved);
        setItems(savedItems ?? []);
        setCanteenName(cn ?? "");
        setCanteenId(cid ?? "");
      }
    } catch {}
  }, [storageKey]);

  // Persist to localStorage on change
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ items, canteenName, canteenId }));
  }, [items, canteenName, canteenId, storageKey]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      // Block mixing canteens
      if (prev.length > 0 && newItem.canteenId !== canteenId) {
        if (!confirm("Adding from a different canteen will clear your current cart. Continue?")) {
          return prev;
        }
        setCanteenName(newItem.canteenName);
        setCanteenId(newItem.canteenId);
        return [{ ...newItem, quantity: 1 }];
      }

      if (prev.length === 0) {
        setCanteenName(newItem.canteenName);
        setCanteenId(newItem.canteenId);
      }

      const existing = prev.find((i) => i.menuItemId === newItem.menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === newItem.menuItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, [canteenId]);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.menuItemId !== menuItemId);
      if (updated.length === 0) {
        setCanteenName("");
        setCanteenId("");
      }
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: qty } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCanteenName("");
    setCanteenId("");
    if (storageKey) localStorage.removeItem(storageKey);
  }, [storageKey]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, canteenName, canteenId, itemCount, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
