"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/utils/format";
import Image from "next/image";
import { MapPin, CreditCard } from "lucide-react";

interface OrderReviewProps {
  shippingData: any;
  paymentData: any;
  onConfirm: () => void;
  onBack: () => void;
}

export function OrderReview({ shippingData, paymentData, onConfirm, onBack }: OrderReviewProps) {
  const { items, getSubtotal, getTax, getShipping, getTotal } = useCart();

  return (
    <div className="space-y-6">
      {/* Shipping Address */}
      <div className="bg-surface rounded-lg p-4">
        <div className="flex items-start gap-3 mb-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-sm text-foreground-muted">
              {shippingData.fullName}
              <br />
              {shippingData.addressLine1}
              {shippingData.addressLine2 && (
                <>
                  <br />
                  {shippingData.addressLine2}
                </>
              )}
              <br />
              {shippingData.city}, {shippingData.state} {shippingData.zipCode}
              <br />
              {shippingData.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-surface rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <p className="text-sm text-foreground-muted capitalize">
              {paymentData.paymentMethod.replace("-", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="font-semibold mb-3">Order Items</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 bg-surface rounded-lg p-3">
              <div className="relative w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                <p className="text-xs text-foreground-muted">
                  {item.weight} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground-muted">Subtotal</span>
          <span className="font-medium">{formatPrice(getSubtotal())}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground-muted">Tax</span>
          <span className="font-medium">{formatPrice(getTax())}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground-muted">Shipping</span>
          <span className="font-medium">
            {getShipping() === 0 ? "FREE" : formatPrice(getShipping())}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-xl text-primary">{formatPrice(getTotal())}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          Back
        </Button>
        <Button onClick={onConfirm} className="flex-1 bg-primary hover:bg-primary-hover">
          Confirm Order
        </Button>
      </div>
    </div>
  );
}
