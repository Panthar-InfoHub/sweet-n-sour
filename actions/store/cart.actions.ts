"use server";

import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { transformProductsWithSignedUrls } from "@/lib/image-utils";
import { auth } from "@/lib/auth";

// Get or create cart ID for current user/session
async function getCartId() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user?.id) {
    // Logged-in user
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    return cart.id;
  } else {
    // Guest user - use session ID from cookies
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("cart-session")?.value;

    if (!sessionId) {
      sessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      cookieStore.set("cart-session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    let cart = await prisma.cart.findUnique({
      where: { sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
      });
    }

    return cart.id;
  }
}

// Get cart with full product details and signed URLs
export async function getCart() {
  try {
    const cartId = await getCartId();

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            cart: false,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: true, data: { items: [] } };
    }

    // Fetch product details for all cart items
    const productIds = cart.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });

    // Transform products with signed URLs
    const productsWithSignedUrls = await transformProductsWithSignedUrls(products);

    // Map cart items with full product details
    const enrichedItems = cart.items
      .map((item) => {
        const product = productsWithSignedUrls.find((p) => p.id === item.productId);
        if (!product) return null;

        // Find the specific variant
        const variant = (product.variants as any[]).find((v) => v.weight === item.weight);
        if (!variant) return null;

        return {
          id: item.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] || "/placeholder.svg",
          price: variant.price,
          weight: item.weight,
          quantity: item.quantity,
          inStock: variant.inStock,
          stockQuantity: variant.stockQuantity,
        };
      })
      .filter(Boolean);

    return { success: true, data: { items: enrichedItems } };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { success: false, error: "Failed to fetch cart" };
  }
}

// Add item to cart
export async function addToCart(productId: string, weight: string, quantity: number = 1) {
  try {
    const cartId = await getCartId();

    // Check if item already exists
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_weight: {
          cartId,
          productId,
          weight,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          weight,
          quantity,
        },
      });
    }

    revalidatePath("/");
    return { success: true, message: "Item added to cart" };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    revalidatePath("/");
    return { success: true, message: "Cart updated" };
  } catch (error) {
    console.error("Error updating cart:", error);
    return { success: false, error: "Failed to update cart" };
  }
}

// Remove item from cart
export async function removeFromCart(itemId: string) {
  try {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    revalidatePath("/");
    return { success: true, message: "Item removed from cart" };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove item from cart" };
  }
}

// Clear entire cart
export async function clearCart() {
  try {
    const cartId = await getCartId();

    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    revalidatePath("/");
    return { success: true, message: "Cart cleared" };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}

// Merge guest cart with user cart on login
export async function mergeGuestCart(userId: string) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart-session")?.value;

    if (!sessionId) return { success: true };

    const guestCart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return { success: true };
    }

    // Get or create user cart
    let userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Merge items
    for (const item of guestCart.items) {
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId_weight: {
            cartId: userCart.id,
            productId: item.productId,
            weight: item.weight,
          },
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            weight: item.weight,
            quantity: item.quantity,
          },
        });
      }
    }

    // Delete guest cart
    await prisma.cart.delete({
      where: { id: guestCart.id },
    });

    // Clear guest session cookie
    cookieStore.delete("cart-session");

    revalidatePath("/");
    return { success: true, message: "Cart merged successfully" };
  } catch (error) {
    console.error("Error merging cart:", error);
    return { success: false, error: "Failed to merge cart" };
  }
}
