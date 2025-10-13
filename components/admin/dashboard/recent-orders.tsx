import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDateTime } from "@/utils/format";
import { Eye, ArrowRight } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import Link from "next/link";

const statusColors: Record<OrderStatus, "default" | "success" | "warning" | "error"> = {
  pending: "warning",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "error",
};

const mockRecentOrders = [
  {
    id: "1",
    orderNumber: "ORD-12345678",
    customer: "John Doe",
    total: 970,
    status: "delivered" as OrderStatus,
    createdAt: "2025-01-15T10:30:00",
  },
  {
    id: "2",
    orderNumber: "ORD-12345679",
    customer: "Jane Smith",
    total: 1450,
    status: "processing" as OrderStatus,
    createdAt: "2025-01-16T14:20:00",
  },
  {
    id: "3",
    orderNumber: "ORD-12345680",
    customer: "Bob Johnson",
    total: 680,
    status: "shipped" as OrderStatus,
    createdAt: "2025-01-16T16:45:00",
  },
];

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/orders">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">#{order.orderNumber}</span>
                  <Badge variant={"default"} className="capitalize">
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{order.customer}</span>
                  <span>•</span>
                  <span>{formatDateTime(order.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">{formatPrice(order.total)}</span>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
