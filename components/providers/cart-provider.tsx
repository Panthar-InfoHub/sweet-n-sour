"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart-db";
import { CartSync } from "./cart-sync";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const fetchCart = useCart((state) => state.fetchCart);
  const isInitialized = useCart((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      fetchCart();
    }
  }, [fetchCart, isInitialized]);

  return (
    <>
      <CartSync />
      {children}
    </>
  );
}
