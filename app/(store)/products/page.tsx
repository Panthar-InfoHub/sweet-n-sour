import { Suspense } from "react";
import { ProductsGrid } from "@/components/store/products/products-grid";
import { ProductFilters } from "@/components/store/products/product-filters-server";
import { getFilteredProducts } from "@/actions/store/product.actions";
import { getCategories } from "@/actions/admin/category.actions";
import { ProductGridSkeleton } from "@/components/store/products/product-grid-skeleton";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    minRating?: string;
    availability?: string;
    categories?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const filters = await searchParams;

  // Fetch categories for filter
  const categoriesResult = await getCategories();
  const categories = categoriesResult.success
    ? (categoriesResult.data || []).filter((cat) => cat.isActive)
    : [];

  // Parse filters
  const productFilters = {
    search: filters.search,
    minRating: filters.minRating ? parseInt(filters.minRating) : undefined,
    availability: (filters.availability as "all" | "in-stock" | "out-of-stock") || "all",
    categorySlugs: filters.categories?.split(",").filter(Boolean),
    sortBy: (filters.sortBy as any) || "featured",
    page: filters.page ? parseInt(filters.page) : 1,
    limit: 12,
  };

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-8 sm:py-16 border-b border-border">
        <div className="custom-container">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2">
            All Products
          </h1>
          <p className="text-center text-muted-foreground text-sm sm:text-base">
            Discover our handcrafted selection
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="custom-container py-4 sm:py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block">
            <ProductFilters categories={categories} />
          </aside>

          {/* Products Grid */}
          <div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductsGridWrapper filters={productFilters} categories={categories} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

async function ProductsGridWrapper({ filters, categories }: { filters: any; categories: any[] }) {
  const result = await getFilteredProducts(filters);

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{result.error}</p>
      </div>
    );
  }

  const products = result.data || [];
  const pagination = result.pagination;

  return <ProductsGrid products={products} pagination={pagination} categories={categories} />;
}
