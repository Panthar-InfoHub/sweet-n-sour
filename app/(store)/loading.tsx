import { CategorySectionSkeleton, BestSellersSkeleton } from "@/components/ui/loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Banner Skeleton */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <Skeleton className="w-full h-full" />
      </div>

      <CategorySectionSkeleton />
      <BestSellersSkeleton />

      {/* Mood Section Skeleton */}
      <section className="py-12">
        <div className="custom-container">
          <Skeleton className="h-8 md:h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 max-w-full mx-auto mb-8" />
          <Skeleton className="h-[300px] md:h-[500px] w-full rounded-2xl" />
        </div>
      </section>
    </>
  );
}
