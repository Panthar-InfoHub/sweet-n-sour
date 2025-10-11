"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { OrderStatus, PaymentStatus } from "@/prisma/generated/prisma";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/admin/order.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderStatusDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderStatusDialog({ orderId, open, onOpenChange }: OrderStatusDialogProps) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [paymentStatusValue, setPaymentStatusValue] = useState<PaymentStatus>(
    PaymentStatus.PENDING
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setOrderStatus(OrderStatus.PENDING);
      setPaymentStatusValue(PaymentStatus.PENDING);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      // Update order status
      const orderResult = await updateOrderStatus(orderId, orderStatus);
      if (!orderResult.success) {
        toast.error(orderResult.error || "Failed to update order status");
        setLoading(false);
        return;
      }

      // Update payment status
      const paymentResult = await updatePaymentStatus(orderId, paymentStatusValue);
      if (!paymentResult.success) {
        toast.error(paymentResult.error || "Failed to update payment status");
        setLoading(false);
        return;
      }

      toast.success("Order and payment status updated successfully");
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast.error("An error occurred while updating order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="orderStatus">Order Status</Label>
            <Select
              value={orderStatus}
              onValueChange={(value) => setOrderStatus(value as OrderStatus)}
            >
              <SelectTrigger id="orderStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <Select
              value={paymentStatusValue}
              onValueChange={(value) => setPaymentStatusValue(value as PaymentStatus)}
            >
              <SelectTrigger id="paymentStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={PaymentStatus.SUCCESS}>Success</SelectItem>
                <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
                <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
