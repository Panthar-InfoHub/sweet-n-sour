"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/product.actions";
import { getCategories } from "@/actions/category.actions";
import { ArrowLeft, Plus, X, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { productSchema, type ProductFormData, type ProductVariant } from "@/lib/zod-schema";
import { MediaSection } from "./media-section";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: any;
  mode: "create" | "edit";
}

// Loading skeleton component
function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Transform product data for edit mode
  const getDefaultValues = (): ProductFormData => {
    if (product) {
      return {
        name: product.name,
        slug: product.slug,
        description: product.description,
        images: product.images || [],
        categoryId: product.categoryId,
        variants: Array.isArray(product.variants) ? product.variants : [],
        isFeatured: product.isFeatured || false,
        isBestSeller: product.isBestSeller || false,
        isOnSale: product.isOnSale || false,
        tags: product.tags || [],
      };
    }

    return {
      name: "",
      slug: "",
      description: "",
      images: [],
      categoryId: "",
      variants: [
        {
          weight: "",
          price: 0,
          compareAtPrice: null,
          stockQuantity: 0,
        },
      ],
      isFeatured: false,
      isBestSeller: false,
      isOnSale: false,
      tags: [],
    };
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(),
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: control as any,
    name: "tags",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        if (result.success && result.data) {
          setCategories(result.data as any);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsInitializing(false);
      }
    };
    fetchCategories();
  }, []);

  // Auto-generate slug from name (in both create and edit modes)
  const name = watch("name");
  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [name, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      const result =
        mode === "create" ? await createProduct(data) : await updateProduct(product.id, data);

      if (result.success) {
        toast.success(`Product ${mode === "create" ? "created" : "updated"} successfully`);
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error || `Failed to ${mode} product`);
      }
    } catch (error) {
      console.error(`Error ${mode}ing product:`, error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return <FormSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "create" ? "Add Product" : "Edit Product"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === "create" ? "Create a new product" : "Update product information"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>{mode === "create" ? "Create Product" : "Update Product"}</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Images - Moved to Top */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload or manage product images</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <MediaSection
                    media={field.value || []}
                    onChange={(newMedia) => field.onChange(newMedia)}
                    maxFiles={10}
                    maxSizeMB={5}
                  />
                )}
              />
              {errors.images && (
                <p className="text-sm text-destructive mt-2">{errors.images.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" {...register("name")} placeholder="Enter product name" />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" {...register("slug")} placeholder="product-slug" />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter product description"
                  rows={5}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Variants - Weight, Price, Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Variants
              </CardTitle>
              <CardDescription>
                Each variant has its own weight, price, and stock information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {variantFields.map((field, index) => (
                <Card key={field.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Variant #{index + 1}</CardTitle>
                      {variantFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`variants.${index}.weight`}>Weight/Size *</Label>
                        <Input
                          id={`variants.${index}.weight`}
                          {...register(`variants.${index}.weight`)}
                          placeholder="e.g., 250g, 500g, 1kg"
                          disabled={isLoading}
                        />
                        {errors.variants?.[index]?.weight && (
                          <p className="text-sm text-destructive">
                            {errors.variants[index]?.weight?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`variants.${index}.stockQuantity`}>Stock Quantity *</Label>
                        <Input
                          id={`variants.${index}.stockQuantity`}
                          type="number"
                          {...register(`variants.${index}.stockQuantity`, {
                            valueAsNumber: true,
                          })}
                          placeholder="0"
                          disabled={isLoading}
                        />
                        {errors.variants?.[index]?.stockQuantity && (
                          <p className="text-sm text-destructive">
                            {errors.variants[index]?.stockQuantity?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`variants.${index}.price`}>Price *</Label>
                        <Input
                          id={`variants.${index}.price`}
                          type="number"
                          step="0.01"
                          {...register(`variants.${index}.price`, { valueAsNumber: true })}
                          placeholder="0.00"
                          disabled={isLoading}
                        />
                        {errors.variants?.[index]?.price && (
                          <p className="text-sm text-destructive">
                            {errors.variants[index]?.price?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`variants.${index}.compareAtPrice`}>Compare At Price</Label>
                        <Input
                          id={`variants.${index}.compareAtPrice`}
                          type="number"
                          step="0.01"
                          {...register(`variants.${index}.compareAtPrice`, {
                            valueAsNumber: true,
                          })}
                          placeholder="0.00"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendVariant({
                    weight: "",
                    price: 0,
                    compareAtPrice: null,
                    stockQuantity: 0,
                  })
                }
                className="w-full"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
              {errors.variants && typeof errors.variants.message === "string" && (
                <p className="text-sm text-destructive">{errors.variants.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add product tags for better organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tagFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input {...register(`tags.${index}`)} placeholder="Enter tag" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeTag(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendTag("")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
              <CardDescription>Product category</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-sm text-destructive mt-2">{errors.categoryId.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>Special product flags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured Product</Label>
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isFeatured"
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isBestSeller">Best Seller</Label>
                <Controller
                  name="isBestSeller"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isBestSeller"
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isOnSale">On Sale</Label>
                <Controller
                  name="isOnSale"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="isOnSale" />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
