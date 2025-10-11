"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Heart, Share2, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatPrice, calculateDiscount } from "@/utils/format";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants[selectedVariantIndex];
  const discount = selectedVariant.compareAtPrice
    ? calculateDiscount(selectedVariant.price, selectedVariant.compareAtPrice)
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant.inStock) {
      toast.error("This product is out of stock");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: selectedVariant.price,
      image: product.images[0] || "/placeholder.svg",
      weight: selectedVariant.weight,
      quantity: quantity,
    });

    toast.success(`${product.name} (${selectedVariant.weight}) × ${quantity} added to cart!`);
  };

  return (
    <div className="container-custom">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square bg-surface rounded-lg mb-4 overflow-hidden">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
            {product.isOnSale && discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square bg-surface rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? "border-primary"
                    : "border-transparent hover:border-border"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-contain p-2"
                />
              </button>
            ))}
            {/* Gift Pack Option */}
            <button className="relative aspect-square bg-surface rounded-lg overflow-hidden border-2 border-transparent hover:border-border flex items-center justify-center">
              <div className="text-center p-2">
                <div className="text-2xl mb-1">🎁</div>
                <span className="text-xs font-medium">Want to pack as a gift?</span>
              </div>
            </button>
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
              disabled={!selectedVariant.inStock}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {selectedVariant.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
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
