"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createOrUpdateReview } from "@/actions/store/review.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface ReviewDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingReview?: {
    rating: number;
    comment: string | null;
  } | null;
}

export function ReviewDialog({ productId, open, onOpenChange, existingReview }: ReviewDialogProps) {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!session?.user) {
      setShowLoginDialog(true);
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    const result = await createOrUpdateReview({
      productId,
      rating,
      comment: comment.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success(
        existingReview ? "Review updated successfully" : "Review submitted successfully"
      );
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to submit review");
    }
  };

  const handleClose = () => {
    if (!existingReview) {
      setRating(0);
      setComment("");
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{existingReview ? "Update Your Review" : "Write a Review"}</DialogTitle>
            <DialogDescription>
              Share your experience with this product to help others make informed decisions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rating Stars */}
            <div>
              <Label className="text-base mb-3 block">Rating *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  You rated this product {rating} out of 5 stars
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment" className="text-base mb-3 block">
                Your Review (Optional)
              </Label>
              <Textarea
                id="comment"
                placeholder="Tell us more about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {comment.length} / 500 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
              {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Required Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to write a review. Please login or create an account to
              continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancel
            </Button>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
