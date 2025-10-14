import { ProductDetail } from "@/components/store/products/product-detail";
import { RelatedProducts } from "@/components/store/products/related-products";
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
    <main className=" bg-[url('/images/checkout-bg.svg')] bg-repeat bg-center bg-contain bg-fixed py-10">
      <div className="custom-container">
        <ProductDetail product={product} />
        <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
      </div>
    </main>
  );
}
