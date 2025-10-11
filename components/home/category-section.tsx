import Image from "next/image";
import Link from "next/link";
import { MOCK_CATEGORIES } from "@/utils/constants";
import { LeafDecoration } from "@/components/decorative/leaf-decoration";

export function CategorySection() {
  return (
    <section className="py-16 relative">
      <LeafDecoration position="top-left" />
      <LeafDecoration position="bottom-right" />

      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
          Choose Your Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {MOCK_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center"
            >
              <div className="relative w-32 h-32 mb-3 rounded-full overflow-hidden bg-white shadow-lg group-hover:shadow-xl transition-shadow">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-center group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
