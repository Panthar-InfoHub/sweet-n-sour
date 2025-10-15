import { ProductGridSkeleton } from "@/components/ui/loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPageLoading() {
  return (
    <main className="min-h-screen">
      {/* Category Header Skeleton */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent border-b border-border">
        <div className="custom-container py-6 sm:py-12">
          <div className="flex items-center gap-4 sm:gap-6">
            <Skeleton className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl hidden sm:block" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 sm:h-10 md:h-12 w-64" />
              <Skeleton className="h-4 sm:h-5 w-96 max-w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="custom-container py-4 sm:py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar Skeleton */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-xl border border-border p-4 sticky top-24 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>

              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3 pb-4 border-b">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </main>
  );
}
