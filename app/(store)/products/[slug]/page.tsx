import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductDetail } from "@/components/products/product-detail";
import { RelatedProducts } from "@/components/products/related-products";
import { MOCK_PRODUCTS } from "@/lib/constants";
import { notFound } from "next/navigation";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen py-8">
      <ProductDetail product={product} />
      <RelatedProducts currentProductId={product.id} />
    </main>
  );
}
