import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LeafDecoration } from "@/components/decorative/leaf-decoration"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-surface to-white py-16 md:py-24 overflow-hidden">
      <LeafDecoration position="top-left" />
      <LeafDecoration position="top-right" />

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Authentic Handcrafted Pickles
            </h1>
            <p className="text-lg text-foreground-muted mb-8 text-pretty max-w-xl mx-auto lg:mx-0">
              Experience the rich flavors of traditional Indian pickles, made with love and the finest ingredients. Each
              jar tells a story of heritage and taste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary-hover" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Hero Images */}
          <div className="relative h-[400px] md:h-[500px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 bg-white rounded-full shadow-2xl flex items-center justify-center z-10">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <Image src="/mango-pickle-jar.png" alt="Mango Pickle" fill className="object-contain" priority />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 md:w-56 md:h-56 bg-white rounded-full shadow-xl flex items-center justify-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image src="/mango-pickle-jar.png" alt="Chilli Pickle" fill className="object-contain" />
              </div>
              <div className="absolute -top-2 -right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                NEW
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
