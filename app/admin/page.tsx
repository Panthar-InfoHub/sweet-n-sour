import {
  getDashboardStats,
  getRevenueData,
  getCategoryDistribution,
  getTopProducts,
} from "@/actions/admin/dashboard.actions";
import { DashboardClient } from "@/components/admin/dashboard/dashboard-client";

export default async function AdminDashboardPage() {
  // Fetch all data server-side
  const [statsResult, revenueResult, categoryResult, topProductsResult] = await Promise.all([
    getDashboardStats(),
    getRevenueData(),
    getCategoryDistribution(),
    getTopProducts(5),
  ]);

  const stats = statsResult.success && statsResult.data ? statsResult.data : null;
  const revenueData = revenueResult.success && revenueResult.data ? revenueResult.data : [];
  const categoryData = categoryResult.success && categoryResult.data ? categoryResult.data : [];
  const topProducts =
    topProductsResult.success && topProductsResult.data ? topProductsResult.data : [];

  return (
    <DashboardClient
      initialStats={stats}
      initialRevenue={revenueData}
      initialCategories={categoryData}
      initialTopProducts={topProducts}
    />
  );
}
