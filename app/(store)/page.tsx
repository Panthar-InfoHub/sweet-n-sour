import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { CategorySection } from "@/components/home/category-section";
import { BestSellersSection } from "@/components/home/best-sellers-section";
import { MoodSection } from "@/components/home/mood-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <BestSellersSection />
      <MoodSection />
    </>
  );
}
