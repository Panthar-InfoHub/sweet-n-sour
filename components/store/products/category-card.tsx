import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
  isActive: boolean;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative overflow-hidden rounded-lg sm:rounded-xl border border-border bg-white shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Category Image */}
      <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-muted">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-primary/20">
              {category.name[0]}
            </span>
          </div>
        )}

        {/* Product Count Badge */}
        <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm text-foreground border-none text-xs">
          {category.productCount}
        </Badge>
      </div>

      {/* Category Details */}
      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3 hidden sm:block">
            {category.description}
          </p>
        )}

        <div className="flex items-center text-primary font-medium text-xs sm:text-sm group-hover:translate-x-1 transition-transform">
          <span className="hidden sm:inline">Browse Products</span>
          <span className="sm:hidden">Browse</span>
          <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </div>
    </Link>
  );
}
