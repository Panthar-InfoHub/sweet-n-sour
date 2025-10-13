
import { HeroSection } from "@/components/home/hero-section";
import { CategorySection } from "@/components/home/category-section";
import { BestSellersSection } from "@/components/store/best-sellers-section";
import { MoodSection } from "@/components/home/mood-section";
import Banner from "@/components/store/banner";

export default function HomePage() {
  return (
    <>
      <Banner />
      {/* <HeroSection /> */}
      <CategorySection />
      <BestSellersSection />
      <MoodSection />
    </>
  );
}
