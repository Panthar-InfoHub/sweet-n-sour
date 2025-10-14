import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      customerName: order.user.name || "Guest",
      total: order.total,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: formattedOrders });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
