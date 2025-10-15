import { getCategories } from "@/actions/admin/category.actions";
import { CategoryCard } from "@/components/store/products/category-card";
import { Empty } from "@/components/ui/empty";

export default async function CategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? result.data || [] : [];
  const activeCategories = categories.filter((cat) => cat.isActive);

  return (
    <main className="min-h-screen ">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-8 sm:py-12 md:py-16 border-b border-border bg-[url('/images/checkout-bg.svg')] bg-repeat bg-center">
        <div className="custom-container">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-4">
            Shop by Category
          </h1>
          <p className="text-center text-muted-foreground text-sm sm:text-base md:text-lg">
            Explore our diverse range of handcrafted products
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="custom-container py-6 sm:py-8 md:py-12">
        {activeCategories.length === 0 ? (
          <Empty className="py-12 sm:py-20">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Check back later for new categories
              </p>
            </div>
          </Empty>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {activeCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
