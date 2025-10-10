"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/utils/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { CheckoutDrawer } from "@/components/checkout/checkout-drawer";
import { useState } from "react";
import { Truck } from "lucide-react";

export function CartSummary() {
  const { getSubtotal, getTax, getShipping, getTotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();
  const freeShippingProgress = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;

  return (
    <>
      <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {/* Free Shipping Progress */}
        {shipping > 0 && (
          <div className="mb-6 p-4 bg-surface rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">
                {subtotal < FREE_SHIPPING_THRESHOLD
                  ? `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for FREE shipping!`
                  : "You qualify for FREE shipping!"}
              </p>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(freeShippingProgress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted">Tax (8%)</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted">Shipping</span>
            <span className="font-medium">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl text-primary">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          className="w-full bg-primary hover:bg-primary-hover"
          size="lg"
          onClick={() => setIsCheckoutOpen(true)}
        >
          Proceed to Checkout
        </Button>

        {/* Continue Shopping */}
        <Button variant="outline" className="w-full mt-3 bg-transparent" asChild>
          <a href="/products">Continue Shopping</a>
        </Button>
      </div>

      {/* Checkout Drawer */}
      <CheckoutDrawer open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </>
  );
}
