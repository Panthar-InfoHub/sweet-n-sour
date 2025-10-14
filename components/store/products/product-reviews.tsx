"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ReviewDialog } from "./review-dialog";

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
        <div>
          <h3 className="text-xl font-semibold mb-6">Reviews ({totalReviews})</h3>

          {reviews.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-muted/30">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-xl p-6 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={review.user.image || undefined} />
                        <AvatarFallback>{review.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{review.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Comment */}
                  {review.comment && (
                    <p className="text-foreground-muted leading-relaxed mb-4">{review.comment}</p>
                  )}

                  {/* Helpful Button */}
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Helpful
                  </Button>
                </div>
              ))}
            </div>
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
