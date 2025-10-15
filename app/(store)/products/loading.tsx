import { PageHeaderSkeleton, ProductGridSkeleton } from "@/components/ui/loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <main className="min-h-screen">
      <PageHeaderSkeleton />

      <div className="custom-container py-4 sm:py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar Skeleton */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-xl border border-border p-4 sticky top-24 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>

              {/* Filter sections */}
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
