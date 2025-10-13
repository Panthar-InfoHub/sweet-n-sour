"use client";

import { useState, useEffect } from "react";
import { Package, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/utils/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { getUserOrders } from "@/actions/store/order.actions";
import { OrderStatus } from "@/prisma/generated/prisma";

// Custom color classes for order status badges
const getStatusColorClass = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400";
    case "PROCESSING":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400";
    case "SHIPPED":
      return "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "DELIVERED":
      return "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400";
    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400";
    case "FAILED":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
};

export function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const result = await getUserOrders();
        if (result.success && result.data) {
          setOrders(result.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Button asChild className="bg-primary hover:bg-primary-hover">
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">Order #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge className={getStatusColorClass(order.status as OrderStatus)}>
                    {statusLabels[order.status as OrderStatus]}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item: any) => {
                    const itemImage = item.product?.images?.[0] || "/placeholder.svg";
                    const itemName = item.productName || item.product?.name || "Product";
                    const variantWeight = item.variantDetails?.weight || "N/A";
                    const variantPrice = item.variantDetails?.price || 0;

                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 bg-surface rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={itemImage}
                            alt={itemName}
                            fill
                            className="object-contain p-2"
                            loading="lazy"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{itemName}</p>
                          <p className="text-sm text-muted-foreground">
                            {variantWeight} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">{formatPrice(variantPrice * item.quantity)}</p>
                      </div>
                    );
                  })}
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
                            <p className="text-sm text-muted-foreground">
                              Placed on {formatDate(selectedOrder.createdAt)}
                            </p>
                            <Badge
                              className={`mt-2 ${getStatusColorClass(
                                selectedOrder.status as OrderStatus
                              )}`}
                            >
                              {statusLabels[selectedOrder.status as OrderStatus]}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Items</h4>
                            <div className="space-y-3">
                              {selectedOrder.items.map((item: any) => {
                                const itemImage = item.product?.images?.[0] || "/placeholder.svg";
                                const itemName =
                                  item.productName || item.product?.name || "Product";
                                const variantWeight = item.variantDetails?.weight || "N/A";
                                const variantPrice = item.variantDetails?.price || 0;

                                return (
                                  <div
                                    key={item.id}
                                    className="flex gap-4 p-3 bg-surface rounded-lg"
                                  >
                                    <div className="relative w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                                      <Image
                                        src={itemImage}
                                        alt={itemName}
                                        fill
                                        className="object-contain p-2"
                                        loading="lazy"
                                        sizes="64px"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">{itemName}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {variantWeight} × {item.quantity}
                                      </p>
                                    </div>
                                    <p className="font-semibold">
                                      {formatPrice(variantPrice * item.quantity)}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Shipping Address</h4>
                            <div className="p-4 bg-surface rounded-lg text-sm">
                              <p className="font-medium">
                                {selectedOrder.shippingAddress?.firstName}{" "}
                                {selectedOrder.shippingAddress?.lastName}
                              </p>
                              <p className="text-muted-foreground mt-1">
                                {selectedOrder.shippingAddress?.address}
                                {selectedOrder.shippingAddress?.apartment && (
                                  <>, {selectedOrder.shippingAddress.apartment}</>
                                )}
                                <br />
                                {selectedOrder.shippingAddress?.city},{" "}
                                {selectedOrder.shippingAddress?.state}{" "}
                                {selectedOrder.shippingAddress?.pinCode}
                                <br />
                                {selectedOrder.shippingAddress?.country}
                                <br />
                                Phone: {selectedOrder.shippingAddress?.phone}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Order Summary</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(selectedOrder.subtotal)}</span>
                              </div>
                              {selectedOrder.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                  <span>Discount</span>
                                  <span>-{formatPrice(selectedOrder.discount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>
                                  {selectedOrder.shippingFee === 0
                                    ? "FREE"
                                    : formatPrice(selectedOrder.shippingFee)}
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
