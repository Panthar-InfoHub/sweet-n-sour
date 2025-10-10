"use client";

import { Suspense } from "react";
import { CategoriesTable } from "@/components/admin/category/categories-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <CategoriesTable />
      </Suspense>
    </div>
  );
}
