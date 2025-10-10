import { Suspense } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { CategoriesTable } from "@/components/admin/categories-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AdminCategoriesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground mt-1">Manage product categories</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <CategoriesTable />
        </Suspense>
      </div>
    </AdminLayout>
  )
}
