"use server";

import { prisma } from "@/prisma/db";

// Get dashboard statistics
export async function getDashboardStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month stats
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      lastMonthRevenue,
      lastMonthOrders,
      lastMonthCustomers,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          status: { notIn: ["CANCELLED"] },
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.user.count({
        where: { role: "USER", createdAt: { gte: startOfMonth } },
      }),
      prisma.product.count(),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          status: { notIn: ["CANCELLED"] },
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      prisma.user.count({
        where: {
          role: "USER",
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
    ]);

    // Calculate percentage changes
    const revenueChange = calculatePercentageChange(
      lastMonthRevenue._sum.total || 0,
      totalRevenue._sum.total || 0
    );
    const ordersChange = calculatePercentageChange(lastMonthOrders, totalOrders);
    const customersChange = calculatePercentageChange(lastMonthCustomers, totalCustomers);

    return {
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueChange,
        ordersChange,
        customersChange,
        productsChange: 0, // Products don't have a monthly change metric
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard statistics" };
  }
}

// Get revenue data for charts (last 12 months)
export async function getRevenueData() {
  try {
    const now = new Date();
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const [revenue, orders] = await Promise.all([
        prisma.order.aggregate({
          where: {
            createdAt: { gte: date, lt: nextDate },
            status: { notIn: ["CANCELLED"] },
          },
          _sum: { total: true },
        }),
        prisma.order.count({
          where: {
            createdAt: { gte: date, lt: nextDate },
          },
        }),
      ]);

      months.push({
        month: date.toLocaleString("default", { month: "short" }),
        revenue: revenue._sum.total || 0,
        orders,
      });
    }

    return { success: true, data: months };
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return { success: false, error: "Failed to fetch revenue data" };
  }
}

// Get category distribution for pie chart
export async function getCategoryDistribution() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const data = categories.map((cat) => ({
      name: cat.name,
      value: cat._count.products,
      color: generateColorForCategory(cat.name),
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    return { success: false, error: "Failed to fetch category distribution" };
  }
}

// Get top selling products
export async function getTopProducts(limit: number = 5) {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    const productIds = topProducts.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: true,
      },
    });

    const data = topProducts.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        name: product?.name || "Unknown",
        sales: item._sum.quantity || 0,
        orders: item._count.productId,
        image: product?.images[0] || "/placeholder.svg",
        category: product?.category.name || "Unknown",
      };
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching top products:", error);
    return { success: false, error: "Failed to fetch top products" };
  }
}

// Helper function to calculate percentage change
function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return Math.round(((newValue - oldValue) / oldValue) * 100);
}

// Helper function to generate consistent colors for categories
function generateColorForCategory(name: string): string {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}
