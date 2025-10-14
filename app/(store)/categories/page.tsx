import { getCategories } from "@/actions/admin/category.actions";
import { CategoryCard } from "@/components/store/products/category-card";
import { Empty } from "@/components/ui/empty";

export default async function CategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? result.data || [] : [];
  const activeCategories = categories.filter((cat) => cat.isActive);

  return (
    <main className="min-h-screen bg-[url('/images/checkout-bg.svg')] bg-repeat bg-center">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-16 border-b border-border">
        <div className="custom-container">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Shop by Category</h1>
          <p className="text-center text-muted-foreground text-lg">
            Explore our diverse range of handcrafted products
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="custom-container py-12">
        {activeCategories.length === 0 ? (
          <Empty className="py-20">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground">Check back later for new categories</p>
            </div>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
