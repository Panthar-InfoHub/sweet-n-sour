"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/utils/format";
import { Package, MapPin, CreditCard } from "lucide-react";

interface OrderDetailsDialogProps {
  order?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{formatDate(order.date)}</p>
            </div>
            <Badge variant="secondary" className="capitalize">
              {order.status}
            </Badge>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4" />
              <h3 className="font-semibold">Order Items</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Mango Pickle</p>
                  <p className="text-sm text-muted-foreground">500g × 2</p>
                </div>
                <p className="font-medium">{formatCurrency(998)}</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Red Chilli Pickle</p>
                  <p className="text-sm text-muted-foreground">250g × 1</p>
                </div>
                <p className="font-medium">{formatCurrency(499)}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" />
              <h3 className="font-semibold">Shipping Address</h3>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-sm text-muted-foreground mt-1">123 Main Street</p>
              <p className="text-sm text-muted-foreground">New York, NY 10001</p>
              <p className="text-sm text-muted-foreground">United States</p>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4" />
              <h3 className="font-semibold">Payment Information</h3>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium">Credit Card ending in 4242</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.total - 50)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(50)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
