import { Suspense } from "react";
import { CategoriesGridWrapper } from "@/components/store/products/categories-grid-wrapper";
import { CategoriesGridSkeleton } from "@/components/ui/loading-skeleton";

export default function CategoriesPage() {
  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-8 sm:py-12 md:py-16 border-b border-border bg-[url('/images/checkout-bg.svg')] bg-repeat bg-center">
        <div className="custom-container">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-4">
            Shop by Category
          </h1>
          <p className="text-center text-muted-foreground text-sm sm:text-base md:text-lg">
            Explore our diverse range of handcrafted products
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="custom-container py-6 sm:py-8 md:py-12">
        <Suspense fallback={<CategoriesGridSkeleton count={10} />}>
          <CategoriesGridWrapper />
        </Suspense>
      </div>
    </main>
  );
}
