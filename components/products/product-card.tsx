"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/utils/format";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useState } from "react";

interface Variant {
  weight: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    variants: Variant[];
    isBestSeller: boolean;
    isOnSale: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Safety check for variants
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  const variant = product.variants[selectedVariant];
  const discount = variant.compareAtPrice
    ? calculateDiscount(variant.price, variant.compareAtPrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!variant.inStock) {
      toast.error("This product is out of stock");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: variant.price,
      image: product.images[0] || "/placeholder.svg",
      weight: variant.weight,
      quantity: 1,
    });

    toast.success(`${product.name} (${variant.weight}) added to cart!`);
  };

  return (
    <div className="group relative bg-white rounded-lg border border-border hover:shadow-lg transition-shadow">
      {/* Sale Badge */}
      {product.isOnSale && discount > 0 && (
        <Badge variant="destructive" className="absolute top-3 left-3 z-10">
          {discount}% OFF
        </Badge>
      )}

      {/* Wishlist Button */}
      <button
        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
        aria-label="Add to wishlist"
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-surface">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Variant Selector */}
        {product.variants.length > 0 && (
          <div className="flex gap-2 mb-2">
            {product.variants.map((v, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(index)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  selectedVariant === index
                    ? "border-primary bg-primary text-white"
                    : "border-border hover:border-primary"
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">{formatPrice(variant.price)}</span>
          {variant.compareAtPrice && (
            <span className="text-sm text-foreground-muted line-through">
              {formatPrice(variant.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-primary hover:bg-primary-hover"
          size="sm"
          onClick={handleAddToCart}
          disabled={!variant.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {variant.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}
