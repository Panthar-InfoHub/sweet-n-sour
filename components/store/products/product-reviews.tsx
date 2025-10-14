"use client";

import { useState, useMemo } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ReviewDialog } from "./review-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  reviews: Review[];
  userReview?: Review | null;
}

export function ProductReviews({
  productId,
  averageRating,
  totalReviews,
  ratingDistribution,
  reviews,
  userReview,
}: ProductReviewsProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  // Paginate reviews
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to reviews section
    document.getElementById("reviews-list")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mt-12 border-t pt-12">
      <div className="grid lg:grid-cols-[350px_1fr] gap-8">
        {/* Ratings Summary */}
        <div className="bg-white rounded-xl border p-6 h-fit sticky top-24">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Overall Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-1">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">{totalReviews} reviews</div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2 mb-6">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3 text-sm">
                  <span className="w-8">{rating}★</span>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="w-8 text-right text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Write Review Button */}
          <Button onClick={() => setIsReviewDialogOpen(true)} className="w-full" size="lg">
            {userReview ? "Update Your Review" : "Write a Review"}
          </Button>
        </div>

        {/* Reviews List */}
        <div id="reviews-list">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Reviews ({totalReviews})</h3>

            {reviews.length > 0 && (
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                  <SelectItem value="lowest">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-muted/30">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {paginatedReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user.image || undefined} />
                          <AvatarFallback className="text-xs">
                            {review.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{review.user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Comment */}
                    {review.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Review Dialog */}
      <ReviewDialog
        productId={productId}
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        existingReview={userReview}
      />
    </div>
  );
}
