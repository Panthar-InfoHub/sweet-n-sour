"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useEffect } from "react";
import Link from "next/link";

interface OrderSuccessProps {
  onClose: () => void;
}

export function OrderSuccess({ onClose }: OrderSuccessProps) {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

  return (
    <div className="text-center py-8">
      <div className="mb-6 flex justify-center">
        <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
      <p className="text-foreground-muted mb-6">
        Thank you for your order. Your order number is{" "}
        <span className="font-semibold text-foreground">{orderNumber}</span>
      </p>

      <div className="bg-surface rounded-lg p-6 mb-6 text-left">
        <h3 className="font-semibold mb-2">What's Next?</h3>
        <ul className="space-y-2 text-sm text-foreground-muted">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>You will receive an order confirmation email shortly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Track your order status in your account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Estimated delivery: 3-5 business days</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Button asChild className="bg-primary hover:bg-primary-hover">
          <Link href="/account/orders">View Order Details</Link>
        </Button>
        <Button variant="outline" onClick={onClose}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
