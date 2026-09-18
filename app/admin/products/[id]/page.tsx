import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductEditor } from "@/components/admin/ProductEditor";
import { getActiveCategories } from "@/lib/queries/categories";
import { createClient } from "@/lib/supabase/server";
import { DB } from "@/lib/supabase/db";
import type { OptionValue, Product, ProductImage, ProductOption } from "@/types/database";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const [productResult, imagesResult, optionsResult, categories] =
    await Promise.all([
      supabase.from(DB.products).select("*").eq("id", id).maybeSingle(),
      supabase
        .from(DB.productImages)
        .select("*")
        .eq("product_id", id)
        .order("sort_order"),
      supabase
        .from(DB.productOptions)
        .select("*, values:option_values(*)")
        .eq("product_id", id)
        .order("sort_order"),
      getActiveCategories(),
    ]);

  // Surface query failures instead of silently rendering a 404.
  if (productResult.error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-800">Erreur de chargement</h1>
        <p className="mt-2 text-sm text-red-700">
          Impossible de charger le produit : {productResult.error.message}
        </p>
        <Link
          href="/admin/products"
          className="mt-4 inline-block text-sm font-medium text-red-800 underline"
        >
          ← Retour aux produits
        </Link>
      </div>
    );
  }

  const product = productResult.data;
  if (!product) notFound();

  const images = (imagesResult.data ?? []) as ProductImage[];
  // Normalize missing nested values to [] so the editor never sees null.
  const options = ((optionsResult.data ?? []) as (ProductOption & {
    values: OptionValue[] | null;
  })[]).map((o) => ({ ...o, values: o.values ?? [] }));

  return (
    <ProductEditor
      mode="edit"
      categories={categories}
      product={product as Product}
      images={images}
      options={options}
    />
  );
}
