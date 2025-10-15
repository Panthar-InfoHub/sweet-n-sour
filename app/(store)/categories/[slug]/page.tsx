import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/actions/admin/category.actions";
import { getFilteredProducts } from "@/actions/store/product.actions";
import { ProductsGrid } from "@/components/store/products/products-grid";
import { ProductFilters } from "@/components/store/products/product-filters-server";
import { ProductGridSkeleton } from "@/components/store/products/product-grid-skeleton";
import { siteConfig } from "@/site.config";

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
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-8 sm:py-12 md:py-16 border-b border-border bg-[url('/images/checkout-bg.svg')] bg-repeat bg-center">
        <div className="custom-container">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-4">
            {category.name}
          </h1>
          <p className="text-center text-muted-foreground text-sm sm:text-base md:text-lg">
            {category.description}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="custom-container py-4 sm:py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block">
            <ProductFilters categorySlug={slug} />
          </aside>

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

  // Pass empty categories array to trigger filter button, along with categorySlug
  return (
    <ProductsGrid
      products={products}
      pagination={pagination}
      categorySlug={filters.categorySlug}
      categories={[]}
    />
  );
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
  const description =
    category.description ||
    `Browse our collection of ${category.name}. Discover authentic, handcrafted products made with traditional recipes.`;

  return {
    title: `${category.name} - Shop by Category | ${siteConfig.title}`,
    description: description,
    keywords: [
      category.name,
      `${category.name} products`,
      `buy ${category.name}`,
      "authentic",
      "handcrafted",
      "traditional",
      "premium quality",
    ],
    openGraph: {
      title: `${category.name} - Shop by Category`,
      description: description,
      type: "website",
      images: category.image ? [{ url: category.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} - Shop by Category`,
      description: description,
      images: category.image ? [category.image] : [],
    },
    alternates: {
      canonical: `/categories/${slug}`,
    },
  };
}
