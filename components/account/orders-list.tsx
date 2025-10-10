"use client";

import { useState } from "react";
import { Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/utils/format";
import type { Order, OrderStatus } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-12345678",
    userId: "1",
    items: [
      {
        id: "1",
        productId: "1",
        name: "Mango Pickle",
        price: 449,
        image: "/mango-pickle-jar.png",
        weight: "400g",
        quantity: 2,
      },
    ],
    subtotal: 898,
    tax: 72,
    shipping: 0,
    total: 970,
    status: "delivered",
    shippingAddress: {
      id: "1",
      userId: "1",
      fullName: "John Doe",
      phone: "9876543210",
      addressLine1: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India",
      isDefault: true,
    },
    billingAddress: {
      id: "1",
      userId: "1",
      fullName: "John Doe",
      phone: "9876543210",
      addressLine1: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India",
      isDefault: true,
    },
    paymentMethod: "card",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-18",
  },
];

const statusColors: Record<OrderStatus, "default" | "success" | "warning" | "error"> = {
  pending: "warning",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "error",
};

export function OrdersList() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>

        {mockOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-foreground-muted mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-foreground-muted mb-6">Start shopping to see your orders here</p>
            <Button asChild className="bg-primary hover:bg-primary-hover">
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">Order #{order.orderNumber}</p>
                    <p className="text-sm text-foreground-muted">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={statusColors[order.status]} className="capitalize">
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-surface rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-foreground-muted">
                          {item.weight} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-foreground-muted">Total Amount</p>
                    <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-6">
                          <div>
                            <p className="font-semibold mb-1">Order #{selectedOrder.orderNumber}</p>
                            <p className="text-sm text-foreground-muted">
                              Placed on {formatDate(selectedOrder.createdAt)}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Items</h4>
                            <div className="space-y-3">
                              {selectedOrder.items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 bg-surface rounded-lg">
                                  <div className="relative w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      fill
                                      className="object-contain p-2"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-foreground-muted">
                                      {item.weight} × {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-semibold">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Shipping Address</h4>
                            <div className="p-4 bg-surface rounded-lg text-sm">
                              <p className="font-medium">
                                {selectedOrder.shippingAddress.fullName}
                              </p>
                              <p className="text-foreground-muted mt-1">
                                {selectedOrder.shippingAddress.addressLine1}
                                <br />
                                {selectedOrder.shippingAddress.city},{" "}
                                {selectedOrder.shippingAddress.state}{" "}
                                {selectedOrder.shippingAddress.zipCode}
                                <br />
                                Phone: {selectedOrder.shippingAddress.phone}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Order Summary</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-foreground-muted">Subtotal</span>
                                <span>{formatPrice(selectedOrder.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground-muted">Tax</span>
                                <span>{formatPrice(selectedOrder.tax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground-muted">Shipping</span>
                                <span>
                                  {selectedOrder.shipping === 0
                                    ? "FREE"
                                    : formatPrice(selectedOrder.shipping)}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-border font-semibold text-base">
                                <span>Total</span>
                                <span className="text-primary">
                                  {formatPrice(selectedOrder.total)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
