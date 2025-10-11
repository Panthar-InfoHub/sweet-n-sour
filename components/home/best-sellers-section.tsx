import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProducts } from "@/actions/admin/product.actions";

export async function BestSellersSection() {
  const result = await getProducts({ isBestSeller: true });
  const products = result.success && result.data ? result.data.slice(0, 4) : [];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
          Best Seller Product
        </h2>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground">No products available</p>
        )}
      </div>
    </section>
  );
}
