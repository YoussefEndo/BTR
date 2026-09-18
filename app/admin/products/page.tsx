import Link from "next/link";

import { ProductsManager } from "@/components/admin/ProductsManager";
import { createClient } from "@/lib/supabase/server";
import { DB } from "@/lib/supabase/db";
import type { ProductWithCategory } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from(DB.products)
    .select("*, categories(id, name, slug)")
    .order("created_at", { ascending: false });

  const products = (data ?? []) as ProductWithCategory[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">Produits</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Ajouter un produit
        </Link>
      </div>
      <ProductsManager initialProducts={products} />
    </div>
  );
}
