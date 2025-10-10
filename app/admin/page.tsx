
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { RevenueAreaChart } from "@/components/admin/dashboard/revenue-area-chart"
import { OrdersBarChart } from "@/components/admin/dashboard/orders-bar-chart"
import { CategoryPieChart } from "@/components/admin/dashboard/category-pie-chart"
import { RecentOrders } from "@/components/admin/dashboard/recent-orders"
import { TopProducts } from "@/components/admin/dashboard/top-products"

export default function AdminDashboardPage() {
  return (
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
  )
}
