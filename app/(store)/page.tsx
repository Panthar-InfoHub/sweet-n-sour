import { CategorySection } from "@/components/store/home/category-section";
import { BestSellersSection } from "@/components/store/home/best-sellers-section";
import { MoodSection } from "@/components/store/home/mood-section";
import Banner from "@/components/store/home/banner";
import { getCategories } from "@/actions/admin/category.actions";

export default async function HomePage() {
  // Fetch active categories
  const categoriesResult = await getCategories();
  const categories = categoriesResult.success
    ? (categoriesResult.data || []).filter((cat) => cat.isActive)
    : [];

  return (
    <>
      <Banner />
      <CategorySection categories={categories} />
      <BestSellersSection />
      <MoodSection />
    </>
  );
}
