"use client";

import { useCart } from "@/hooks/use-cart-db";
import { CartItem } from "./cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function CartContent() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-16 w-16" />}
        title="Your cart is empty"
        description="Add some delicious pickles to your cart to get started"
        action={
          <Button asChild className="bg-primary hover:bg-primary-hover">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Cart Summary */}
      <div>
        <CartSummary />
      </div>
    </div>
  );
}
