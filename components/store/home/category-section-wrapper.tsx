import { getCategories } from "@/actions/admin/category.actions";
import { CategorySection } from "./category-section";

export async function CategorySectionWrapper() {
  const categoriesResult = await getCategories();
  const categories = categoriesResult.success
    ? (categoriesResult.data || []).filter((cat) => cat.isActive)
    : [];

  return <CategorySection categories={categories} />;
}
