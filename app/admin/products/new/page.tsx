import { ProductEditor } from "@/components/admin/ProductEditor";
import { getActiveCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getActiveCategories();
  return <ProductEditor mode="create" categories={categories} />;
}
