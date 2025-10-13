import { ProductDetail } from "@/components/products/product-detail";
import { RelatedProducts } from "@/components/products/related-products";
import { getProductBySlug } from "@/actions/admin/product.actions";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  return (
    <main className=" py-8 bg-[url('/images/productpage-bg.svg')] bg-no-repeat bg-top bg-cover bg-fixed ">
      <ProductDetail product={product} />
      <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
      <div className="h-screen"></div>
    </main>
  );
}
