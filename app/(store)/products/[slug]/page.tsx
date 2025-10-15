import { Suspense } from "react";
import { ProductDetail } from "@/components/store/products/product-detail";
import { RelatedProducts } from "@/components/store/products/related-products";
import { ProductReviews } from "@/components/store/products/product-reviews";
import { getProductWithReviews } from "@/actions/store/product.actions";
import { hasUserReviewedProduct } from "@/actions/store/review.actions";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/site.config";
import { Metadata } from "next";

// Related Products Skeleton
function RelatedProductsSkeleton() {
  return (
    <div className="mt-12">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="w-full aspect-square" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProductWithReviews(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  // Check if user has reviewed
  const userReviewResult = await hasUserReviewedProduct(product.id);
  const userReview =
    userReviewResult.success && userReviewResult.review
      ? {
          id: userReviewResult.review.id,
          rating: userReviewResult.review.rating,
          comment: userReviewResult.review.comment,
          createdAt: userReviewResult.review.createdAt,
          user: {
            id: userReviewResult.review.userId,
            name: "", // We don't need user name for user's own review
            image: null,
          },
        }
      : null;

  return (
    <main className="bg-[url('/images/checkout-bg.svg')] bg-repeat bg-center bg-contain bg-fixed py-10">
      <div className="custom-container">
        <ProductDetail product={product} />

        {/* Reviews Section */}
        <ProductReviews
          productId={product.id}
          averageRating={product.averageRating || 0}
          totalReviews={product.totalReviews || 0}
          ratingDistribution={product.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
          reviews={product.reviews || []}
          userReview={userReview}
        />

        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
        </Suspense>
      </div>
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductWithReviews(slug);

  if (!result.success || !result.data) {
    return {
      title: "Product Not Found",
    };
  }

  const product = result.data;
  const variants = product.variants as any[];
  const firstVariant = variants && variants.length > 0 ? variants[0] : null;
  const price = firstVariant?.price || 0;
  const compareAtPrice = firstVariant?.compareAtPrice;

  // Calculate discount if applicable
  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const priceText =
    discount > 0 ? `₹${price} (${discount}% OFF from ₹${compareAtPrice})` : `₹${price}`;

  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 160)}...`
      : product.description;

  return {
    title: `${product.name} - ${priceText} | ${siteConfig.title}`,
    description: description,
    keywords: [
      product.name,
      ...product.tags,
      product.category.name,
      "buy online",
      "premium quality",
      "authentic",
      "handcrafted",
    ],
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 200),
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}
