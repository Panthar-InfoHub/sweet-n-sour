import { CategorySection } from "@/components/store/home/category-section";
import { BestSellersSection } from "@/components/store/home/best-sellers-section";
import { MoodSection } from "@/components/store/home/mood-section";
import Banner from "@/components/store/home/banner";

export default function HomePage() {
  return (
    <>
      <Banner />
      <CategorySection />
      <BestSellersSection />
      <MoodSection />
    </>
  );
}
