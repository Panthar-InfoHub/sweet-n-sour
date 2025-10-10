import { ProductForm } from "@/components/admin/products/product-form";
import { getProductBySlug } from "@/actions/product.actions";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  return <ProductForm mode="edit" product={result.data} />;
}
