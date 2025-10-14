import { ProductCard } from "@/components/store/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProducts } from "@/actions/admin/product.actions";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
}

export async function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  // Fetch related products from the same category
  const result = await getProducts({
    categoryId: categoryId,
  });

  // Filter out current product and show 4 related products
  const allProducts = result.success && result.data ? result.data : [];
  const relatedProducts = allProducts.filter((p: any) => p.id !== currentProductId).slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="  py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Explore Related Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {relatedProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </section>
  );
}
