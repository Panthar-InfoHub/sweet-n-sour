import { ProductCard } from "@/components/store/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProducts } from "@/actions/admin/product.actions";

export async function BestSellersSectionWrapper() {
  const result = await getProducts({ isBestSeller: true });
  const products = result.success && result.data ? result.data.slice(0, 4) : [];

  return (
    <section className="relative pt-8 sm:pt-12 overflow-hidden">
      <div className="custom-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-foreground">
          Best Seller Product
        </h2>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-white bg-brand-background
                 transition-colors"
                asChild
              >
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground">No best seller products available</p>
        )}
      </div>
    </section>
  );
}
