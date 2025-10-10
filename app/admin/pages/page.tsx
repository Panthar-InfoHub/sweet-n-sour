import { Suspense } from "react"

import { PagesTable } from "@/components/admin/pages-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AdminPagesPage() {
  return (

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pages</h1>
            <p className="text-muted-foreground mt-1">Manage website content pages</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Page
          </Button>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <PagesTable />
        </Suspense>
      </div>

  )
}
