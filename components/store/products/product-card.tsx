"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart-db";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const { addItem, removeItem, items } = useCart();
  const { toggleItem, isInWishlistLocal } = useWishlist();
  const selectedVariant = product.variants[selectedVariantIndex];
  const isInWishlist = isInWishlistLocal(product.id);

  // Check if this specific variant is in cart
  const cartItem = items.find(
    (i) => i.productId === product.id && i.weight === selectedVariant.weight
  );
  const isInCart = !!cartItem;

  // Calculate discount percentage
  const discountPercentage = selectedVariant.compareAtPrice
    ? Math.round(
        ((selectedVariant.compareAtPrice - selectedVariant.price) /
          selectedVariant.compareAtPrice) *
          100
      )
    : 0;

  const handleCartAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart && cartItem) {
      // Remove from cart
      await removeItem(cartItem.id);
    } else {
      // Add to cart
      await addItem(product.id, selectedVariant.weight, product.name, 1);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsTogglingWishlist(true);
    const result = await toggleItem(product.id);
    setIsTogglingWishlist(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error || "Failed to update wishlist");
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && product.isOnSale && (
        <div className="absolute left-0 top-0 h-24 w-24 z-10">
          <div className="absolute shadow-md transform -rotate-45 bg-brand-primary-2 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
            {discountPercentage}% OFF
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <Button
        onClick={handleToggleWishlist}
        size={"icon-sm"}
        variant="ghost"
        disabled={isTogglingWishlist}
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-110 hover:shadow-lg "
        aria-label="Add to wishlist"
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
          )}
        />
      </Button>

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden  p-8">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-contain"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Details */}
      <div className="  p-3">
        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm  capitalize text-muted-foreground">{product.category.name}</span>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.5</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold capitalize">{product.name}</h3>

        {/* Variant Selector */}
        {product.variants.length > 1 && (
          <p className="text-sm font-semibold text-muted-foreground">
            {product.variants[selectedVariantIndex].weight}
          </p>
          // <div className="flex flex-wrap gap-2 ">
          //   {product.variants.map((variant, index) => (
          //     // <Button

          //       key={index}
          //       size={"sm"}
          //       variant={"outline"}
          //       onClick={() => setSelectedVariantIndex(index)}
          //       className={""}
          //     >
          //       {variant.weight}
          //     </Button>
          //   ))}
          // </div>
        )}

        {/* Single Variant Display */}
        {product.variants.length === 1 && (
          <p className="text-sm font-semibold text-muted-foreground">{selectedVariant.weight}</p>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">₹{selectedVariant.price}</span>
            {selectedVariant.compareAtPrice && (
              <span className="text-lg text-gray-400 line-through">
                ₹{selectedVariant.compareAtPrice}
              </span>
            )}
          </div>

          <Button
            onClick={handleCartAction}
            disabled={!selectedVariant.inStock}
            variant={isInCart ? "outline" : "default"}
            className="rounded-full"
          >
            <ShoppingBag className="h-5 w-5" />
            {isInCart ? "Remove" : "Add"}
          </Button>
        </div>

        {/* Stock Status */}
        {!selectedVariant.inStock && (
          <p className="text-sm font-medium text-red-500">Out of Stock</p>
        )}
      </div>
    </Link>
  );
}

export interface ProductVariant {
  price: number;
  weight: string;
  inStock: boolean;
  stockQuantity: number;
  compareAtPrice?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  categoryId: string;
  variants: ProductVariant[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: Category;
}
