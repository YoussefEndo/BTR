import { createPublicClient } from "@/lib/supabase/public";
import { DB } from "@/lib/supabase/db";
import type { OptionValue, Product, ProductImage, ProductOption, ProductWithCategory } from "@/types/database";

export async function getActiveProducts(categoryId?: string): Promise<ProductWithCategory[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from(DB.products)
      .select("*, categories(id, name, slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[products] fetch failed:", error.message);
      return [];
    }
    return (data ?? []) as ProductWithCategory[];
  } catch (err) {
    // Missing env vars or unreachable Supabase — render empty state.
    console.error("[products] unavailable:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from(DB.products)
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    return data;
  } catch (err) {
    console.error("[products] unavailable:", err);
    return null;
  }
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from(DB.productImages)
      .select("*")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

    return data ?? [];
  } catch (err) {
    console.error("[products] images unavailable:", err);
    return [];
  }
}

export interface ProductWithOptions {
  product: Product;
  images: ProductImage[];
  options: (ProductOption & { values: OptionValue[] })[];
}

export async function getProductWithOptions(
  slug: string
): Promise<ProductWithOptions | null> {
  try {
    const product = await getProductBySlug(slug);
    if (!product) return null;

    const supabase = createPublicClient();

    const [imagesResult, optionsResult] = await Promise.all([
      getProductImages(product.id),
      supabase
        .from(DB.productOptions)
        .select("*, values:option_values(*)")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
    ]);

    const options = ((optionsResult.data ?? []) as (ProductOption & {
      values: OptionValue[];
    })[]).map((o) => ({
      ...o,
      values: (o.values ?? []).sort((a, b) => a.sort_order - b.sort_order),
    }));

    return { product, images: imagesResult, options };
  } catch (err) {
    console.error("[products] unavailable:", err);
    return null;
  }
}
