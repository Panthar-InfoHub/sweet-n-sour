"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatPrice, calculateDiscount } from "@/utils/format";
import { useCart } from "@/hooks/use-cart-db";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";

// Utility function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowerUrl.includes(ext)) || lowerUrl.includes("video");
};

interface Variant {
  weight: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  inStock: boolean;
}

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    variants: Variant[] | any; // Accept JsonValue from Prisma
    category: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
      order: number;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    isBestSeller: boolean;
    isOnSale: boolean;
    tags: string[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlistLocal } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const selectedVariant = product.variants[selectedVariantIndex];
  const isInWishlist = isInWishlistLocal(product.id);
  const discount = selectedVariant.compareAtPrice
    ? calculateDiscount(selectedVariant.price, selectedVariant.compareAtPrice)
    : 0;

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedImage((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) => Math.min(product.images.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product.images.length]);

  const handleAddToCart = async () => {
    if (!selectedVariant.inStock) {
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(product.id, selectedVariant.weight, product.name, quantity);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
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
    <div className=" ">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          {/* Main Image/Video */}
          <div className="relative aspect-square bg-white/50 backdrop-blur-lg rounded-lg border mb-4 overflow-hidden">
            {isVideoUrl(product.images[selectedImage]) ? (
              <video
                src={product.images[selectedImage]}
                className="w-full h-full object-contain p-8"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority={selectedImage === 0}
                loading={selectedImage === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            {product.isOnSale && discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
              disabled={selectedImage === 0}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedImage + 1} / {product.images.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))
              }
              disabled={selectedImage === product.images.length - 1}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? "border-primary"
                    : "border-transparent hover:border-border"
                }`}
              >
                {isVideoUrl(image) ? (
                  <video src={image} className="w-full h-full object-cover p-1" muted />
                ) : (
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-1"
                    loading="lazy"
                    sizes="80px"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <Badge className="mb-2">{product.category.name}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.compareAtPrice && (
                <span className="text-xl text-foreground-muted line-through">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-foreground-muted mb-6 text-pretty leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Weight Selection */}
          <div className="mb-6">
            <Label className="text-base font-semibold mb-3 block">Weight</Label>
            <RadioGroup
              value={String(selectedVariantIndex)}
              onValueChange={(value) => setSelectedVariantIndex(Number(value))}
              className="flex gap-3"
            >
              {product.variants.map((variant: Variant, index: number) => (
                <div key={index}>
                  <RadioGroupItem
                    value={String(index)}
                    id={`variant-${index}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`variant-${index}`}
                    className="flex items-center justify-center px-6 py-2 rounded-lg border-2 border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50 transition-colors"
                  >
                    {variant.weight}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <Label className="text-base font-semibold mb-3 block">Quantity</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= selectedVariant.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-foreground-muted">
                {selectedVariant.stockQuantity} items available
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary-hover"
              onClick={handleAddToCart}
              disabled={!selectedVariant.inStock || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {selectedVariant.inStock ? "Add to Cart" : "Out of Stock"}
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleToggleWishlist}
              disabled={isTogglingWishlist}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isInWishlist ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="border-t border-border pt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">SKU:</span>
              <span className="text-foreground-muted">{product.id}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Category:</span>
              <span className="text-foreground-muted">{product.category.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Tags:</span>
              <span className="text-foreground-muted">{product.tags.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
