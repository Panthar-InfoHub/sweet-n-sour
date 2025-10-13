import { ProductsGrid } from "@/components/store/products/products-grid";
import { ProductFilters } from "@/components/store/products/product-filters";
import { getProducts } from "@/actions/admin/product.actions";
import { Product, ProductVariant } from "@/components/store/products/product-card";

export default async function ProductsPage() {
  const result = await getProducts({});
  const rawProducts = result.success ? result.data || [] : [];

  // Transform products to match the Product type
  const products: Product[] = rawProducts.map((product) => ({
    ...product,
    variants: (product.variants as unknown as ProductVariant[]) || [],
    tags: product.tags || [],
    images: product.images || [],
  }));

  return (
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
            <ProductsGrid products={products} />
          </div>
        </div>
      </div>
    </main>
  );
}
