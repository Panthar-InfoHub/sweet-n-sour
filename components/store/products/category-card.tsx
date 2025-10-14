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
      className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Category Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-6xl font-bold text-primary/20">{category.name[0]}</span>
          </div>
        )}

        {/* Product Count Badge */}
        <Badge className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-foreground border-none">
          {category.productCount} Products
        </Badge>
      </div>

      {/* Category Details */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{category.description}</p>
        )}

        <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
          Browse Products
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
