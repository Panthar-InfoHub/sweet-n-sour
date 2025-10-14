import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div>
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-16" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
