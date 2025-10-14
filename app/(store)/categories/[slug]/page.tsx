import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/actions/admin/category.actions";
import { getFilteredProducts } from "@/actions/store/product.actions";
import { ProductsGrid } from "@/components/store/products/products-grid";
import { ProductFilters } from "@/components/store/products/product-filters-server";
import { ProductGridSkeleton } from "@/components/store/products/product-grid-skeleton";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    search?: string;
    minRating?: string;
    availability?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const filters = await searchParams;

  // Fetch category
  const categoryResult = await getCategoryBySlug(slug);

  if (!categoryResult.success || !categoryResult.data) {
    notFound();
  }

  const category = categoryResult.data;

  // Parse filters
  const productFilters = {
    categorySlug: slug,
    search: filters.search,
    minRating: filters.minRating ? parseInt(filters.minRating) : undefined,
    availability: (filters.availability as "all" | "in-stock" | "out-of-stock") || "all",
    sortBy: (filters.sortBy as any) || "featured",
    page: filters.page ? parseInt(filters.page) : 1,
    limit: 12,
  };

  return (
    <main className="min-h-screen">
      {/* Category Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent border-b border-border">
        <div className="custom-container py-12">
          <div className="flex items-center gap-6">
            {category.image && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md hidden md:block">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground text-lg">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="custom-container py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block">
            <ProductFilters categorySlug={slug} />
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <div className="p-6 overflow-y-auto h-full">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  <ProductFilters categorySlug={slug} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductsGridWrapper filters={productFilters} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

async function ProductsGridWrapper({ filters }: { filters: any }) {
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

  return <ProductsGrid products={products} pagination={pagination} />;
}

// Generate metadata
export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryResult = await getCategoryBySlug(slug);

  if (!categoryResult.success || !categoryResult.data) {
    return {
      title: "Category Not Found",
    };
  }

  const category = categoryResult.data;

  return {
    title: `${category.name} - Shop by Category`,
    description: category.description || `Browse our ${category.name} products`,
  };
}
