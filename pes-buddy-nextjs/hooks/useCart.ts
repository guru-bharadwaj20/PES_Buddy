"use client";

import { useContext } from "react";
import { CartContext } from "@/components/providers/CartProvider";

export function useCart() {
  return useContext(CartContext);
}
