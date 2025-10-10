import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MoodSection() {
  return (
    <section className="py-16 bg-surface">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-balance">What's your mood for the day?</h2>
        <p className="text-center text-foreground-muted mb-12 max-w-2xl mx-auto text-pretty">
          How are you feeling today? Hope you're doing well and take a moment to brighten your mood with our specially
          curated pickles for every occasion.
        </p>

        <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
          <Image src="/traditional-indian-spices-and-ingredients-on-woode.jpg" alt="Mood banner" fill className="object-cover" />
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-primary-hover" asChild>
            <Link href="/products">Explore Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
