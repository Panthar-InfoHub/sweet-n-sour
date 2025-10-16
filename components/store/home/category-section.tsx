import { getCategories } from "@/actions/admin/category.actions";
import { CategoryCarousel } from "./category-carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { CategorySectionSkeleton } from "@/components/ui/loading-skeleton";
import Image from "next/image";

async function CarouselWrapper() {
  const categoriesResult = await getCategories();
  const categories = categoriesResult.success
    ? (categoriesResult.data || []).filter((cat) => cat.isActive)
    : [];

  return <CategoryCarousel categories={categories} />;
}

export default async function CategorySection() {
  return (
    <section className="py-8 sm:py-12 relative">
      <div className="custom-container overflow-hidden">
        <h2 className="text-2xl relative sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-balance w-fit mx-auto py-10 px-4">
          Choose Your Categories
          <Image
            src="/images/decor/leaves.svg"
            alt="Categories"
            width={50}
            height={50}
            className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-full w-32 h-32 object-contain"
          />
          <Image
            src="/images/decor/leaves.svg"
            alt="Categories"
            width={50}
            height={50}
            className="absolute top-1/2 rotate-y-180 -translate-y-1/2 left-0 -translate-x-full w-32 h-32 object-contain"
          />
        </h2>

        <Suspense fallback={<CategorySectionSkeleton />}>
          <CarouselWrapper />
        </Suspense>
        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-white bg-brand-background
                 transition-colors"
            asChild
          >
            <Link href="/categories">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
