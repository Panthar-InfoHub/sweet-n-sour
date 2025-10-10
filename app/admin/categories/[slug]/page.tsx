import { CategoryForm } from "@/components/admin/category/category-form";
import { getCategoryBySlug } from "@/actions/category.actions";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getCategoryBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  return <CategoryForm mode="edit" category={result.data} />;
}
