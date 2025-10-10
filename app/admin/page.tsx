import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RevenueAreaChart } from "@/components/admin/revenue-area-chart"
import { OrdersBarChart } from "@/components/admin/orders-bar-chart"
import { CategoryPieChart } from "@/components/admin/category-pie-chart"
import { RecentOrders } from "@/components/admin/recent-orders"
import { TopProducts } from "@/components/admin/top-products"

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>

        <DashboardStats />

        <RevenueAreaChart />

        <div className="grid lg:grid-cols-2 gap-6">
          <OrdersBarChart />
          <CategoryPieChart />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <TopProducts />
          <RecentOrders />
        </div>
      </div>
    </AdminLayout>
  )
}
