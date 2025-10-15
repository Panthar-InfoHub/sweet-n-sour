import { PageHeaderSkeleton, CategoriesGridSkeleton } from "@/components/ui/loading-skeleton";

export default function CategoriesLoading() {
  return (
    <main className="min-h-screen">
      <PageHeaderSkeleton />
      <CategoriesGridSkeleton count={10} />
    </main>
  );
}
