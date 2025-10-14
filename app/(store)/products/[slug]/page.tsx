import { ProductDetail } from "@/components/store/products/product-detail";
import { RelatedProducts } from "@/components/store/products/related-products";
import { ProductReviews } from "@/components/store/products/product-reviews";
import { getProductWithReviews } from "@/actions/store/product.actions";
import { hasUserReviewedProduct } from "@/actions/store/review.actions";
import { notFound } from "next/navigation";

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

        <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
      </div>
    </main>
  );
}
