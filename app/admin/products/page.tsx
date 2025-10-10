import { Suspense } from "react"

import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AdminProductsPage() {
  return (

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product inventory</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <ProductsTable />
        </Suspense>
      </div>

  )
}
