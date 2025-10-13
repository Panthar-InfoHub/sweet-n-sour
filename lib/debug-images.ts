/**
 * Debugging utilities for signed URL implementation
 * Import and use these functions to troubleshoot image loading issues
 */

export function debugImageUrl(url: string, context: string = "") {
  console.group(`🖼️ Image Debug${context ? `: ${context}` : ""}`);

  const isPublic = url.startsWith("http://") || url.startsWith("https://");
  const isRelative = url.startsWith("/");
  const isGCS = url.includes("storage.googleapis.com");
  const hasSignature = url.includes("X-Goog-Signature");

  console.log("URL:", url.substring(0, 100) + (url.length > 100 ? "..." : ""));
  console.log("Type:", isPublic ? "Public URL" : isRelative ? "Relative Path" : "Storage Path");
  console.log("Is GCS:", isGCS);
  console.log("Is Signed:", hasSignature);

  if (hasSignature) {
    const urlObj = new URL(url);
    const expires = urlObj.searchParams.get("X-Goog-Expires");
    const expiresIn = expires ? parseInt(expires) / 60 : 0;
    console.log("Expires in:", `${expiresIn} minutes`);
  }

  console.groupEnd();
}

export function debugProductImages(product: any) {
  console.group("📦 Product Images Debug");
  console.log("Product:", product.name);
  console.log("Images count:", product.images?.length || 0);

  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: string, idx: number) => {
      debugImageUrl(img, `Image ${idx + 1}`);
    });
  }

  console.groupEnd();
}

export async function testSignedUrlGeneration(path: string) {
  console.group("🧪 Testing Signed URL Generation");
  console.log("Path:", path);

  const startTime = performance.now();

  try {
    const response = await fetch("/api/images/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    const data = await response.json();
    const endTime = performance.now();

    console.log("Status:", response.status);
    console.log("Time:", `${(endTime - startTime).toFixed(2)}ms`);
    console.log("Success:", !!data.url);

    if (data.url) {
      debugImageUrl(data.url);
    } else {
      console.error("Error:", data.error);
    }
  } catch (error) {
    console.error("Failed:", error);
  }

  console.groupEnd();
}

export async function testBatchSignedUrls(paths: string[]) {
  console.group("🧪 Testing Batch Signed URL Generation");
  console.log("Paths count:", paths.length);

  const startTime = performance.now();

  try {
    const response = await fetch("/api/images/signed-urls-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });

    const data = await response.json();
    const endTime = performance.now();

    console.log("Status:", response.status);
    console.log("Time:", `${(endTime - startTime).toFixed(2)}ms`);
    console.log("Avg per URL:", `${((endTime - startTime) / paths.length).toFixed(2)}ms`);
    console.log("Success:", !!data.urls);

    if (data.urls) {
      console.log("Generated:", data.urls.length, "URLs");
      data.urls.forEach((url: string, idx: number) => {
        console.log(`URL ${idx + 1}:`, url.substring(0, 80) + "...");
      });
    } else {
      console.error("Error:", data.error);
    }
  } catch (error) {
    console.error("Failed:", error);
  }

  console.groupEnd();
}

export function measureImageLoadTime(imgElement: HTMLImageElement) {
  const startTime = performance.now();

  imgElement.addEventListener("load", () => {
    const loadTime = performance.now() - startTime;
    console.log(`✅ Image loaded in ${loadTime.toFixed(2)}ms:`, imgElement.src.substring(0, 80));
  });

  imgElement.addEventListener("error", () => {
    const loadTime = performance.now() - startTime;
    console.error(
      `❌ Image failed to load after ${loadTime.toFixed(2)}ms:`,
      imgElement.src.substring(0, 80)
    );
  });
}

// Usage in browser console or component:
// import { debugImageUrl, debugProductImages, testSignedUrlGeneration } from './lib/debug-images';
//
// // Debug a single URL
// debugImageUrl(imageUrl);
//
// // Debug all images in a product
// debugProductImages(product);
//
// // Test URL generation
// await testSignedUrlGeneration('products/test-image.jpg');
//
// // Test batch generation
// await testBatchSignedUrls(['products/img1.jpg', 'products/img2.jpg']);
