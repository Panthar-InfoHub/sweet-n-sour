import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductsGrid } from "@/components/products/products-grid"
import { ProductFilters } from "@/components/products/product-filters"

export default function ProductsPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen">
        {/* Page Header */}
        <div className="bg-surface py-12 border-b border-border">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Pickles</h1>
            <p className="text-center text-foreground-muted">Discover our handcrafted selection</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="container-custom py-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block">
              <ProductFilters />
            </aside>

            {/* Products Grid */}
            <div>
              <ProductsGrid />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
