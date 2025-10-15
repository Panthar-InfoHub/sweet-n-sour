import { Suspense } from "react";
import { CategorySectionWrapper } from "@/components/store/home/category-section-wrapper";
import { BestSellersSectionWrapper } from "@/components/store/home/best-sellers-section-wrapper";
import { MoodSection } from "@/components/store/home/mood-section";
import Banner from "@/components/store/home/banner";
import { CategorySectionSkeleton, BestSellersSkeleton } from "@/components/ui/loading-skeleton";
import { siteConfig } from "@/site.config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${siteConfig.title} - Premium Handcrafted Pickles & Authentic Flavors`,
  description: siteConfig.description,
  keywords: [
    "pickles",
    "handcrafted pickles",
    "authentic pickles",
    "traditional pickles",
    "homemade pickles",
    "artisan pickles",
    "indian pickles",
    "pickle store",
    "organic pickles",
    "gourmet pickles",
  ],
  openGraph: {
    title: `${siteConfig.title} - Premium Handcrafted Pickles`,
    description: siteConfig.description,
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.title} - Premium Handcrafted Pickles`,
    description: siteConfig.description,
  },
  alternates: {
    canonical: "/",
  },
};

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
