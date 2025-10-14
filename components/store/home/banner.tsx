"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
const slides = [
  { id: 1, src: "/images/slide-1.svg", alt: "Fresh Dairy Products" },
  { id: 2, src: "/images/slide-2.svg", alt: "Organic Goodness Delivered" },
  { id: 3, src: "/images/slide-3.svg", alt: "From Farm to Your Doorstep" },
];

export default function Banner() {
  return (
    <div className="w-full px-4 py-4 custom-container">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative aspect-[16/6] w-full overflow-hidden rounded-lg md:aspect-[21/6]">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                  sizes="100vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
