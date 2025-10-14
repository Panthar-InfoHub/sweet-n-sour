"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 768) {
        setItemsPerView(3);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4);
      } else {
        setItemsPerView(6);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, categories.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative">
      <div className="custom-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
          Choose Your Categories
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Button */}
          {currentIndex > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-white hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Categories */}
          <div className="overflow-hidden px-2">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group flex flex-col items-center flex-shrink-0"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${
                      (24 * (itemsPerView - 1)) / itemsPerView
                    }px)`,
                  }}
                >
                  <div className="relative w-full aspect-square mb-3 rounded-full overflow-hidden">
                    <Image
                      src={category.image || "/images/dummy.png"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 ease-in-out transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Button */}
          {currentIndex < maxIndex && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-white hover:bg-gray-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
