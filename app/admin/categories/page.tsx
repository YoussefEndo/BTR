import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { getActiveCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getActiveCategories();
  return <CategoriesManager initialCategories={categories} />;
}
