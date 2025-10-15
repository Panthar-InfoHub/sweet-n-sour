"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CartDrawer } from "@/components/store/cart/cart-drawer";
import { useCart } from "@/hooks/use-cart-db";

export function HeaderCartButton({ isMobile = false }: { isMobile?: boolean }) {
  const [cartOpen, setCartOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.length;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={
          isMobile
            ? "lg:hidden relative text-white hover:bg-white/10"
            : "relative text-white hover:bg-white/10"
        }
        onClick={() => setCartOpen(true)}
      >
        <ShoppingCart className="h-5 w-5 text-white" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-brand-primary text-xs flex items-center justify-center font-semibold">
            {cartCount}
          </span>
        )}
      </Button>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
