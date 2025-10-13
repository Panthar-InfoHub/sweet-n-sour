"use server";

import { getSignedViewUrl } from "./cloud-storage";

// Server-side cache for signed URLs with expiration
const urlCache = new Map<string, { url: string; expires: number }>();

/**
 * Get signed URL with caching to improve performance
 * Cache expires 50 minutes (URLs are valid for 60 minutes)
 */
export async function getCachedSignedUrl(path: string): Promise<string> {
  if (!path) return "/placeholder.svg";

  // Check if it's already a public URL or placeholder
  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  const now = Date.now();
  const cached = urlCache.get(path);

  // Return cached URL if still valid (with 10 min buffer)
  if (cached && cached.expires > now) {
    return cached.url;
  }

  // Generate new signed URL
  const signedUrl = await getSignedViewUrl(path);

  // Cache for 50 minutes (URLs expire in 60 minutes)
  urlCache.set(path, {
    url: signedUrl,
    expires: now + 50 * 60 * 1000,
  });

  // Clean up expired entries periodically
  if (urlCache.size > 1000) {
    for (const [key, value] of urlCache.entries()) {
      if (value.expires <= now) {
        urlCache.delete(key);
      }
    }
  }

  return signedUrl;
}

/**
 * Batch process multiple image URLs
 * More efficient for products with multiple images
 */
export async function getCachedSignedUrls(paths: string[]): Promise<string[]> {
  if (!paths || paths.length === 0) return [];

  // Process all URLs in parallel for better performance
  return Promise.all(paths.map((path) => getCachedSignedUrl(path)));
}

/**
 * Transform product data with signed URLs
 * Use this in server components or actions
 */
export async function transformProductWithSignedUrls<T extends { images: string[] }>(
  product: T
): Promise<T> {
  const signedImages = await getCachedSignedUrls(product.images);
  return {
    ...product,
    images: signedImages,
  };
}

/**
 * Transform multiple products with signed URLs
 * Optimized for bulk operations
 */
export async function transformProductsWithSignedUrls<T extends { images: string[] }>(
  products: T[]
): Promise<T[]> {
  // Collect all unique image paths
  const allImages = Array.from(new Set(products.flatMap((p) => p.images)));

  // Generate signed URLs for all images in parallel
  const signedUrlsArray = await getCachedSignedUrls(allImages);

  // Create a map for quick lookup
  const urlMap = new Map<string, string>();
  allImages.forEach((img, idx) => {
    urlMap.set(img, signedUrlsArray[idx]);
  });

  // Transform products with signed URLs
  return products.map((product) => ({
    ...product,
    images: product.images.map((img) => urlMap.get(img) || img),
  }));
}
