import { Suspense } from "react";
import { CategorySectionWrapper } from "@/components/store/home/category-section-wrapper";
import { BestSellersSectionWrapper } from "@/components/store/home/best-sellers-section-wrapper";
import { MoodSection } from "@/components/store/home/mood-section";
import Banner from "@/components/store/home/banner";
import { CategorySectionSkeleton, BestSellersSkeleton } from "@/components/ui/loading-skeleton";

export default function HomePage() {
  return (
    <>
      <Banner />

      <Suspense fallback={<CategorySectionSkeleton />}>
        <CategorySectionWrapper />
      </Suspense>

      <Suspense fallback={<BestSellersSkeleton />}>
        <BestSellersSectionWrapper />
      </Suspense>

      <MoodSection />
    </>
  );
}
