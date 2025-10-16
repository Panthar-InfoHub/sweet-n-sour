import { ProductCard } from "@/components/store/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProducts } from "@/actions/admin/product.actions";
import { Suspense } from "react";
import { BestSellersSkeleton } from "@/components/ui/loading-skeleton";
import Image from "next/image";

export default async function BestSellersSection() {
  return (
    <section className="relative pt-8 sm:pt-12 overflow-x-hidden">
      <Image
        src="/images/decor/chili.svg"
        alt="Categories"
        width={50}
        height={50}
        className="absolute  top-0  max-md:translate-x-1/2 right-0  w-36 h-36 object-contain"
      />
      <Image
        src="/images/decor/chili.svg"
        alt="Categories"
        width={50}
        height={50}
        className="absolute top-0  rotate-y-180 max-md:-translate-x-1/2  left-0  w-36 h-36 object-contain"
      />
      <div className="custom-container relative ">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-foreground  w-fit mx-auto py-6">
          Best Seller Product
        </h2>

        <Suspense fallback={<BestSellersSkeleton />}>
          <BestSellerProducts />
        </Suspense>
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
      </div>
    </section>
  );
}

export async function BestSellerProducts() {
  const result = await getProducts({ isBestSeller: true });
  const products = result.success && result.data ? result.data.slice(0, 4) : [];

  return (
    <>
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground">No best seller products available</p>
      )}
    </>
  );
}
