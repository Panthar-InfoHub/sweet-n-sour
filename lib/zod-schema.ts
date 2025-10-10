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
