import { createPublicClient } from "@/lib/supabase/public";
import { DB } from "@/lib/supabase/db";
import type { Category } from "@/types/database";

export async function getActiveCategories(): Promise<Category[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from(DB.categories)
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[categories] fetch failed:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    // Missing env vars or unreachable Supabase — render empty state.
    console.error("[categories] unavailable:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from(DB.categories)
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    return data;
  } catch (err) {
    console.error("[categories] unavailable:", err);
    return null;
  }
}
