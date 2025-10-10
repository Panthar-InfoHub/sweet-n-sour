"use server";

import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@/prisma/generated/prisma";

// Get all orders with filtering
export async function getOrders(filters?: {
  status?: OrderStatus;
  userId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: "insensitive" } },
        { user: { name: { contains: filters.search, mode: "insensitive" } } },
        { user: { email: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

// Get single order
export async function getOrder(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return { success: true, data: order };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, error: "Failed to fetch order" };
  }
}

// Update order status
export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, data: order, message: "Order status updated successfully" };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

// Delete order (admin only - use with caution)
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: { id },
    });

    revalidatePath("/admin/orders");
    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

// Get order statistics
export async function getOrderStats(startDate?: Date, endDate?: Date) {
  try {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [totalOrders, totalRevenue, ordersByStatus] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where,
        _sum: { total: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        where,
        _count: true,
      }),
    ]);

    return {
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        ordersByStatus: ordersByStatus.map((item) => ({
          status: item.status,
          count: item._count,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return { success: false, error: "Failed to fetch order statistics" };
  }
}

// Get recent orders
export async function getRecentOrders(limit: number = 10) {
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return { success: false, error: "Failed to fetch recent orders" };
  }
}

// Update order notes
export async function updateOrderNotes(id: string, notes: string) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { notes },
    });

    revalidatePath("/admin/orders");
    return { success: true, data: order };
  } catch (error) {
    console.error("Error updating order notes:", error);
    return { success: false, error: "Failed to update order notes" };
  }
}
