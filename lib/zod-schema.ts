import { z } from "zod";

// Product variant schema
export const productVariantSchema = z.object({
  weight: z.string().min(1, "Weight is required"),
  price: z.number().positive("Price must be positive"),
  compareAtPrice: z.number().optional().nullable(),
  stockQuantity: z.number().int().min(0, "Stock cannot be negative"),
  // inStock is auto-calculated from stockQuantity, not stored in schema
});

export type ProductVariant = z.infer<typeof productVariantSchema>;

export type ProductFormData = z.infer<typeof productSchema>;

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  categoryId: z.string().min(1, "Category is required"),
  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type CMSPageFormData = z.infer<typeof cmsPageSchema>;
export const cmsPageSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional(),
  address: z.string().min(5, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().min(5, "Valid PIN code is required"),
  country: z.string().default("India"),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantWeight: z.string().min(1, "Variant weight is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export const orderDetailsSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  couponCode: z.string().optional(),
});

export type OrderDetails = z.infer<typeof orderDetailsSchema>;

// Checkout form schema (client-side)
export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters").max(200),
  apartment: z.string().max(100).optional(),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required").max(50),
  city: z.string().min(2, "City is required").max(50),
  pinCode: z.string().regex(/^\d{5,6}$/, "PIN code must be 5-6 digits"),
  coupon: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Coupon schema
export const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Coupon code must be at least 3 characters")
      .max(20, "Coupon code must be at most 20 characters")
      .regex(
        /^[A-Z0-9_-]+$/,
        "Coupon code must contain only uppercase letters, numbers, hyphens, and underscores"
      ),
    type: z.enum(["PERCENTAGE", "FLAT"], { required_error: "Coupon type is required" }),
    value: z.number().positive("Value must be greater than 0"),
    minOrderValue: z.number().min(0).optional().nullable(),
    maxDiscount: z.number().min(0).optional().nullable(),
    isActive: z.boolean().default(true),
    expiresAt: z.date().optional().nullable(),
    globalUsageLimit: z.number().int().min(1).optional().nullable(),
    perUserLimit: z.number().int().min(1).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === "PERCENTAGE" && data.value > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["value"],
    }
  );

export type CouponFormData = z.infer<typeof couponSchema>;
