import CategorySection from "@/components/store/home/category-section";
import BestSellersSection from "@/components/store/home/best-sellers-section";
import { MoodSection } from "@/components/store/home/mood-section";
import Banner from "@/components/store/home/banner";

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
      <CategorySection />
      <BestSellersSection />
      <MoodSection />
    </>
  );
}
