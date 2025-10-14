"use client";

import { ProductCard } from "@/components/store/products/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Empty } from "@/components/ui/empty";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductFilters } from "@/components/store/products/product-filters-server";

interface ProductsGridProps {
  products: any[];
  pagination?: {
    page: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
  };
  categories?: any[];
  categorySlug?: string;
}

export function ProductsGrid({
  products,
  pagination,
  categories,
  categorySlug,
}: ProductsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sortBy") || "featured";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", value);
    params.delete("page"); // Reset to page 1 when sorting
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: true });
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border gap-2">
        <p className="text-sm text-muted-foreground hidden sm:block">
          Showing{" "}
          <span className="font-medium text-foreground">
            {pagination
              ? `${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalProducts
                )}`
              : products.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {pagination?.totalProducts || products.length}
          </span>{" "}
          products
        </p>

        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          {/* Mobile Filter Button */}
          {categories && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden h-10 w-10">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] p-4 bg-brand-background overflow-y-auto"
              >
                <ProductFilters categories={categories} categorySlug={categorySlug} />
              </SheetContent>
            </Sheet>
          )}

          {/* Sort */}
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px] sm:w-[180px] h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Empty className="py-20">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
          </div>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {[...Array(pagination.totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show first, last, current, and pages around current
              if (
                pageNumber === 1 ||
                pageNumber === pagination.totalPages ||
                (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="min-w-[36px]"
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (pageNumber === pagination.page - 2 || pageNumber === pagination.page + 2) {
                return (
                  <span key={pageNumber} className="px-2 flex items-center">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
