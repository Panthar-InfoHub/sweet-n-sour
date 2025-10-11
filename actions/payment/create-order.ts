"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/prisma/db";
import { z } from "zod";
import { SHIPPING_COST, TAX_RATE, FREE_SHIPPING_THRESHOLD } from "@/utils/constants";
import { OrderDetails, orderDetailsSchema } from "@/lib/zod-schema";

interface ProductVariant {
  weight: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  inStock: boolean;
}

/**
 * Generate sequential order number in format: ORD-YYYYMMDD-XXX
 * Where XXX is the incremental order number for that day
 */
async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD

  // Get today's order count
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todayOrderCount = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const orderSequence = (todayOrderCount + 1).toString().padStart(3, "0");
  return `ORD-${dateStr}-${orderSequence}`;
}

export default async function createOrder(orderDetails: OrderDetails) {
  try {
    // 1. Authentication check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // 2. Validate input data
    const validatedData = orderDetailsSchema.parse(orderDetails);

    // 3. Fetch all products and validate availability
    const productIds = validatedData.items.map((item) => item.productId);
    const uniqueProductIds = [...new Set(productIds)];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: uniqueProductIds,
        },
      },
      include: {
        category: true,
      },
    });

    // Check if all unique products exist
    if (products.length !== uniqueProductIds.length) {
      const foundIds = products.map((p) => p.id);
      const missingIds = uniqueProductIds.filter((id) => !foundIds.includes(id));
      throw new Error(`Products not found: ${missingIds.join(", ")}`);
    }

    // 4. Validate stock and calculate prices
    const orderItems: Array<{
      productId: string;
      name: string;
      variantDetails: { weight: string; price: number };
      quantity: number;
      price: number;
      image: string | null;
    }> = [];

    let subtotal = 0;

    for (const item of validatedData.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Find the matching variant
      const variants = (product.variants || []) as unknown as ProductVariant[];
      const variant = variants.find((v) => v.weight === item.variantWeight);

      if (!variant) {
        throw new Error(
          `Variant with weight ${item.variantWeight} not found for product ${product.name}`
        );
      }

      // Check stock availability
      if (!variant.inStock || variant.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name} (${variant.weight}).`);
      }

      // Validate price to prevent manipulation
      const itemPrice = variant.price;
      const itemTotal = itemPrice * item.quantity;

      orderItems.push({
        productId: product.id,
        name: product.name,
        variantDetails: {
          weight: variant.weight,
          price: variant.price,
        },
        quantity: item.quantity,
        price: itemPrice,
        image: product.images[0] || null,
      });

      subtotal += itemTotal;
    }

    // 5. Calculate discount (if coupon code provided)
    let discount = 0;
    let appliedCoupon = null;

    if (validatedData.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: {
          code: validatedData.couponCode,
          isActive: true,
        },
      });

      if (coupon) {
        // Check expiry
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          throw new Error("Coupon has expired");
        }

        // Check minimum order value
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          throw new Error(
            `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
          );
        }

        // Check global usage limit
        if (coupon.globalUsageLimit && coupon.totalUsed >= coupon.globalUsageLimit) {
          throw new Error("Coupon usage limit reached");
        }

        // Calculate discount
        if (coupon.type === "PERCENTAGE") {
          discount = (subtotal * coupon.value) / 100;
          // Apply max discount cap if exists
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          // FLAT discount
          discount = coupon.value;
        }

        // Ensure discount doesn't exceed subtotal
        if (discount > subtotal) {
          discount = subtotal;
        }

        appliedCoupon = coupon;
      } else {
        throw new Error("Invalid or inactive coupon code");
      }
    }

    // 6. Calculate shipping (no tax)
    const discountedSubtotal = subtotal - discount;
    const taxAmount = 0; // Tax removed as per requirement
    const shippingFee = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = Math.round((discountedSubtotal + shippingFee) * 100) / 100;

    // Validate total amount
    if (total <= 0) {
      throw new Error("Invalid order total");
    }

    // 7. Generate sequential order number
    const orderNumber = await generateOrderNumber();

    // 8. Use billing address same as shipping if not provided
    const billingAddress = validatedData.billingAddress || validatedData.shippingAddress;

    // 9. Create order in database with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: "PENDING",
          subtotal,
          discount,
          taxAmount,
          shippingFee,
          total,
          shippingAddress: validatedData.shippingAddress,
          billingAddress,
          paymentStatus: "PENDING",
          couponCode: validatedData.couponCode || null,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              name: item.name,
              variantDetails: item.variantDetails,
              quantity: item.quantity,
              image: item.image,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 10. Update product stock quantities
      for (const item of validatedData.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;

        const variants = product.variants as unknown as ProductVariant[];
        const variantIndex = variants.findIndex((v) => v.weight === item.variantWeight);

        if (variantIndex !== -1) {
          const updatedVariants = [...variants];
          const newStockQuantity = updatedVariants[variantIndex].stockQuantity - item.quantity;

          updatedVariants[variantIndex] = {
            ...updatedVariants[variantIndex],
            stockQuantity: newStockQuantity,
            inStock: newStockQuantity > 0,
          };

          await tx.product.update({
            where: { id: item.productId },
            data: {
              variants: updatedVariants as any,
            },
          });
        }
      }

      // 11. Update coupon usage count if coupon was applied
      if (appliedCoupon) {
        // Update global usage count
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: {
            totalUsed: {
              increment: 1,
            },
          },
        });

        // Track per-user usage
        const existingUsage = await tx.couponUsage.findUnique({
          where: {
            couponId_userId: {
              couponId: appliedCoupon.id,
              userId: userId,
            },
          },
        });

        if (existingUsage) {
          await tx.couponUsage.update({
            where: { id: existingUsage.id },
            data: {
              usedCount: {
                increment: 1,
              },
            },
          });
        } else {
          await tx.couponUsage.create({
            data: {
              couponId: appliedCoupon.id,
              userId: userId,
              usedCount: 1,
            },
          });
        }
      }

      return newOrder;
    });

    // 12. Return success response
    return {
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentStatus: order.paymentStatus,
      },
      message: "Order created successfully",
    };
  } catch (error) {
    console.error("Error creating order:", error);

    // Handle specific error types
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: `Validation error: ${firstError.message}`,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create order. Please try again.",
    };
  }
}
