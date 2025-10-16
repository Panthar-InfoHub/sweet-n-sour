import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Generic Section Skeleton
export function SectionSkeleton() {
  return (
    <section className="py-8 sm:py-12 ">
      <div className="custom-container">
        <Skeleton className="h-8 sm:h-10 w-64 mx-auto bg-brand-primary/20 mb-8 sm:mb-12 " />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full bg-brand-primary/20" />
          <Skeleton className="h-4 w-3/4 bg-brand-primary/20" />
          <Skeleton className="h-4 w-5/6 bg-brand-primary/20" />
        </div>
      </div>
    </section>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="w-full aspect-square  bg-brand-primary/20" />
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <Skeleton className="h-4 sm:h-5 w-3/4 bg-brand-primary/20" />
          <Skeleton className="h-3 sm:h-4 w-1/2 bg-brand-primary/20" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 bg-brand-primary/20" />
            <Skeleton className="h-8 sm:h-9 w-8 sm:w-9 rounded-md bg-brand-primary/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <Skeleton className="h-4 w-32 hidden sm:block  bg-brand-primary/20" />
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          <Skeleton className="h-10 w-10 lg:hidden bg-brand-primary/20" />
          <Skeleton className="h-10 w-[140px] sm:w-[180px] bg-brand-primary/20" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
  return (
    <div className="group flex flex-col">
      <Skeleton className="w-full aspect-square sm:aspect-[4/3] rounded-xl mb-3  bg-brand-primary/20" />
      <Skeleton className="h-5 sm:h-6 w-3/4 mx-auto mb-2 bg-brand-primary/20" />
      <Skeleton className="h-3 sm:h-4 w-full hidden sm:block bg-brand-primary/20" />
      <Skeleton className="h-3 sm:h-4 w-2/3 hidden sm:block mx-auto bg-brand-primary/20" />
    </div>
  );
}

// Category Section Skeleton (Carousel)
export function CategorySectionSkeleton() {
  return (
    <section className="">
      <div className="custom-container">
        {/* Carousel Skeleton */}
        <div className="relative">
          <div className="flex gap-2 sm:gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] xl:w-[calc(16.666%-13px)]"
              >
                <Skeleton className="w-full aspect-square rounded-full mb-2 sm:mb-3 bg-brand-primary/20" />
                <Skeleton className="h-4 sm:h-5 w-3/4 mx-auto bg-brand-primary/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Best Sellers Section Skeleton
export function BestSellersSkeleton() {
  return (
    <section className="">
      <div className="custom-container">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-4 pb-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-5 flex-1  bg-brand-primary/20 " />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 items-center">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-12 flex-1  bg-brand-primary/20 " />
          ))}
        </div>
      ))}
    </div>
  );
}

// Page Header Skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-transparent py-8 sm:py-12 md:py-16 border-b border-border">
      <div className="custom-container">
        <Skeleton className="h-8 sm:h-10 md:h-12 w-64 sm:w-80 mx-auto mb-2 sm:mb-4  bg-brand-primary/20 " />
        <Skeleton className="h-4 sm:h-5 w-48 sm:w-64 mx-auto  bg-brand-primary/20 " />
      </div>
    </div>
  );
}

// Categories Grid Skeleton
export function CategoriesGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="custom-container py-6 sm:py-8 md:py-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Full Page Skeleton (for loading.tsx)
export function PageSkeleton() {
  return (
    <main className="min-h-screen">
      <PageHeaderSkeleton />
      <div className="custom-container py-8">
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-xl  bg-brand-primary/20 " />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl  bg-brand-primary/20 " />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// Card List Skeleton
export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0 bg-brand-primary/20 " />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 bg-brand-primary/20 " />
                <Skeleton className="h-4 w-full bg-brand-primary/20 " />
                <Skeleton className="h-4 w-2/3 bg-brand-primary/20 " />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Form Skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24  bg-brand-primary/20 " />
          <Skeleton className="h-10 w-full  bg-brand-primary/20 " />
        </div>
      ))}
      <Skeleton className="h-10 w-32  bg-brand-primary/20 " />
    </div>
  );
}

// Admin Dashboard Skeleton
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* Two Column Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Admin Table Skeleton
export function AdminTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      {/* Header with Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg border">
            {/* Table Header */}
            <div className="flex gap-4 p-4 border-b bg-muted/50">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Table Rows */}
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border-b items-center">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
