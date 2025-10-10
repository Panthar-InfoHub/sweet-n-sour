import { OrdersTable } from "@/components/admin/orders/orders-table";
import { getOrders } from "@/actions/order.actions";

export default async function AdminOrdersPage() {
  const result = await getOrders();
  const orders = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage customer orders and fulfillment</p>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  );
}
