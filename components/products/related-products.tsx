import { MOCK_PRODUCTS } from "@/lib/constants"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RelatedProductsProps {
  currentProductId: string
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  // Filter out current product and show 4 related products
  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.id !== currentProductId).slice(0, 4)

  return (
    <section className="container-custom py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Explore Related Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </section>
  )
}
