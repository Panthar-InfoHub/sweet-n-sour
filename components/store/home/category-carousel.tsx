"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Category } from "@/prisma/generated/prisma";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return (
      <div className="py-8 sm:py-12">
        <div className="custom-container">
          <p className="text-center text-gray-500">No categories available.</p>
        </div>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 sm:-ml-4">
        {categories.map((category) => (
          <CarouselItem
            key={category.id}
            className="pl-2 sm:pl-4 py-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <Link
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center "
            >
              <div className="relative w-full aspect-square mb-2 sm:mb-3  ">
                <Image
                  src={category.image || "/images/dummy.png"}
                  alt={category.name}
                  loading="lazy"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                />
              </div>
              <h3 className="font-semibold capitalize text-center text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2">
                {category.name}
              </h3>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation Buttons - Hidden on mobile, visible on larger screens */}
      <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
      <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
    </Carousel>
  );
}
