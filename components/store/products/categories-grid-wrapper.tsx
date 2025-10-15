import { getCategories } from "@/actions/admin/category.actions";
import { CategoryCard } from "@/components/store/products/category-card";
import { Empty } from "@/components/ui/empty";

export async function CategoriesGridWrapper() {
  const result = await getCategories();
  const categories = result.success ? result.data || [] : [];
  const activeCategories = categories.filter((cat) => cat.isActive);

  if (activeCategories.length === 0) {
    return (
      <Empty className="py-12 sm:py-20">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-semibold mb-2">No categories found</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Check back later for new categories
          </p>
        </div>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {activeCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
