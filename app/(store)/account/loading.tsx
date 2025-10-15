import { CardListSkeleton } from "@/components/ui/loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-border p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <CardListSkeleton count={3} />
      </div>
    </div>
  );
}
