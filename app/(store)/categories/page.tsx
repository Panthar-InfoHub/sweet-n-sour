import { Suspense } from "react";
import { CategoriesGridWrapper } from "@/components/store/products/categories-grid-wrapper";
import { CategoriesGridSkeleton } from "@/components/ui/loading-skeleton";
import { siteConfig } from "@/site.config";
import { Metadata } from "next";
import PageHeader from "@/components/store/common/page-header";

export const metadata: Metadata = {
  title: `Shop by Category - ${siteConfig.title}`,
  description: `Explore our diverse range of handcrafted products organized by categories. Find authentic pickles, chutneys, and preserves made with traditional recipes.`,
  keywords: [
    "product categories",
    "shop by category",
    "pickle categories",
    "browse products",
    "product types",
    "authentic pickles",
    "traditional products",
  ],
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Shop by Category"
        description="Explore our diverse range of handcrafted products"
      />

      {/* Categories Grid */}
      <div className="custom-container py-6 sm:py-8 md:py-12">
        <Suspense fallback={<CategoriesGridSkeleton count={10} />}>
          <CategoriesGridWrapper />
        </Suspense>
      </div>
    </main>
  );
}
