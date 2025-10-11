"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Truck, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import { OrderDetailsDialog } from "./order-details-dialog";
import { OrderStatusDialog } from "./order-status-dialog";
import { OrderStatus } from "@/prisma/generated/prisma";
import { deleteOrder } from "@/actions/admin/order.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Order {
  id: string;
  orderNumber: string;
  createdAt: Date;
  total: number;
  status: OrderStatus;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
  }>;
}

interface OrdersTableProps {
  orders: Order[];
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    case "PROCESSING":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    case "SHIPPED":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
    case "DELIVERED":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    case "CANCELLED":
      return "bg-red-500/10 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  }
};

export function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const router = useRouter();

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsStatusOpen(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      const result = await deleteOrder(orderId);
      if (result.success) {
        toast.success("Order cancelled successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to cancel order");
      }
    }
  };

  const totalItems = (items: Array<{ quantity: number }>) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user.name}</div>
                      <div className="text-sm text-muted-foreground">{order.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{totalItems(order.items)}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {order.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id)}>
                          <Truck className="h-4 w-4 mr-2" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OrderDetailsDialog
        orderId={selectedOrderId}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <OrderStatusDialog
        orderId={selectedOrderId}
        open={isStatusOpen}
        onOpenChange={setIsStatusOpen}
      />
    </>
  );
}
