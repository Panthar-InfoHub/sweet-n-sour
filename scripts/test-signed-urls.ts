/**
 * Test script for signed URL functionality
 * Run with: node --loader tsx scripts/test-signed-urls.ts
 */

import {
  getCachedSignedUrl,
  getCachedSignedUrls,
  transformProductWithSignedUrls,
} from "../lib/image-utils";

async function testSignedUrls() {
  console.log("🧪 Testing Signed URL Functionality\n");

  // Test 1: Single URL
  console.log("Test 1: Single URL Generation");
  console.time("Single URL");
  const singleUrl = await getCachedSignedUrl("products/test-image.jpg");
  console.timeEnd("Single URL");
  console.log("Result:", singleUrl.substring(0, 100) + "...\n");

  // Test 2: Cached URL (should be instant)
  console.log("Test 2: Cached URL (should be faster)");
  console.time("Cached URL");
  const cachedUrl = await getCachedSignedUrl("products/test-image.jpg");
  console.timeEnd("Cached URL");
  console.log("Cache hit:", singleUrl === cachedUrl ? "✅ Yes" : "❌ No\n");

  // Test 3: Batch processing
  console.log("\nTest 3: Batch URL Generation");
  const imagePaths = [
    "products/image-1.jpg",
    "products/image-2.jpg",
    "products/image-3.jpg",
    "products/image-4.jpg",
    "products/image-5.jpg",
  ];
  console.time("Batch URLs");
  const batchUrls = await getCachedSignedUrls(imagePaths);
  console.timeEnd("Batch URLs");
  console.log("Generated:", batchUrls.length, "URLs\n");

  // Test 4: Product transformation
  console.log("Test 4: Product Transformation");
  const mockProduct = {
    id: "1",
    name: "Test Product",
    images: ["products/image-1.jpg", "products/image-2.jpg"],
  };
  console.time("Product Transform");
  const transformed = await transformProductWithSignedUrls(mockProduct);
  console.timeEnd("Product Transform");
  console.log("Original images:", mockProduct.images);
  console.log(
    "Transformed images:",
    transformed.images.map((url) => url.substring(0, 50) + "...")
  );

  console.log("\n✅ All tests completed!");
}

// Run tests
testSignedUrls().catch(console.error);
