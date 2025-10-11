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
    <main className="min-h-screen py-8">
      <ProductDetail product={product} />
      <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
    </main>
  );
}
