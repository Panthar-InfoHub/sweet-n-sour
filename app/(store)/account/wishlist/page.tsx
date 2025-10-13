"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { items, fetchWishlist, clearWishlistItems, isLoading, isInitialized } = useWishlist();
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/login?redirect=/account/wishlist");
      } else if (!isInitialized) {
        fetchWishlist();
      }
    }
  }, [session, isPending, isInitialized, fetchWishlist, router]);

  const handleClearWishlist = async () => {
    if (!confirm("Are you sure you want to clear your entire wishlist?")) {
      return;
    }

    setIsClearing(true);
    await clearWishlistItems();
    setIsClearing(false);
  };

  if (isPending || isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-2">
            {items.length} {items.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>

        {items.length > 0 && (
          <Button variant="outline" onClick={handleClearWishlist} disabled={isClearing}>
            {isClearing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Wishlist
              </>
            )}
          </Button>
        )}
      </div>

      {/* Wishlist Items */}
      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-16 w-16" />}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist and shop them later"
          action={
            <Link href="/products">
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {items.length > 0 && (
        <div className="mt-12 p-6 bg-surface rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/account/orders">
              <Button variant="outline">View Orders</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
