"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ProductFiltersProps {
  categorySlug?: string;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    productCount?: number;
  }>;
}

export function ProductFilters({ categorySlug, categories = [] }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const minRating = searchParams.get("minRating") || "";
  const availability = searchParams.get("availability") || "all";
  const selectedCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset to page 1 when filters change
    params.delete("page");

    const basePath = categorySlug ? `/categories/${categorySlug}` : "/products";
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    updateFilter("search", searchInput || null);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const updateCategoryFilter = (categorySlug: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    let categories = params.get("categories")?.split(",").filter(Boolean) || [];

    if (checked) {
      if (!categories.includes(categorySlug)) {
        categories.push(categorySlug);
      }
    } else {
      categories = categories.filter((c) => c !== categorySlug);
    }

    if (categories.length > 0) {
      params.set("categories", categories.join(","));
    } else {
      params.delete("categories");
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const basePath = categorySlug ? `/categories/${categorySlug}` : "/products";
    setSearchInput("");
    router.push(basePath);
  };

  const hasActiveFilters =
    minRating || availability !== "all" || selectedCategories.length > 0 || searchQuery;

  return (
    <div className="bg-white rounded-xl border border-border p-6 sticky top-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Search Products</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name, description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSearch} size="icon" variant="default">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories - Only show on /products page */}
      {!categorySlug && categories.length > 0 && (
        <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Categories</h3>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.slug}`}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={(checked) => {
                      updateCategoryFilter(category.slug, !!checked);
                    }}
                  />
                  <Label
                    htmlFor={`category-${category.slug}`}
                    className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                  >
                    <span className="capitalize">{category.name}</span>
                    {category.productCount !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        ({category.productCount})
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Rating */}
      <div>
        <h3 className="font-medium mb-3 text-sm">Rating</h3>
        <RadioGroup
          value={minRating}
          onValueChange={(value) => {
            // If clicking the same rating, deselect it
            if (value === minRating) {
              updateFilter("minRating", null);
            } else {
              updateFilter("minRating", value);
            }
          }}
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className="flex items-center space-x-2"
              onClick={() => {
                // Allow deselecting by clicking the same rating
                if (minRating === rating.toString()) {
                  updateFilter("minRating", null);
                }
              }}
            >
              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 cursor-pointer text-sm"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">& Up</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-medium mb-3 text-sm">Availability</h3>
        <RadioGroup
          value={availability}
          onValueChange={(value) => {
            if (value === "all") {
              updateFilter("availability", null);
            } else {
              updateFilter("availability", value);
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="availability-all" />
            <Label htmlFor="availability-all" className="text-sm cursor-pointer">
              All Products
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-stock" id="availability-in-stock" />
            <Label htmlFor="availability-in-stock" className="text-sm cursor-pointer">
              In Stock Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="out-of-stock" id="availability-out-of-stock" />
            <Label htmlFor="availability-out-of-stock" className="text-sm cursor-pointer">
              Out of Stock
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
