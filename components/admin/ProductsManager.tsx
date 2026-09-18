"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { ProductWithCategory } from "@/types/database";

interface Props {
  initialProducts: ProductWithCategory[];
}

export function ProductsManager({ initialProducts }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    initialProducts.forEach((p) => {
      if (p.categories) map.set(p.categories.id, p.categories.name);
    });
    return [...map.entries()];
  }, [initialProducts]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchesSearch = p.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || p.category_id === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [products, search, categoryFilter]
  );

  async function toggleActive(product: ProductWithCategory) {
    const { createBrowserClient } = await import("@supabase/ssr");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_active: !p.is_active } : p
        )
      );
      router.refresh();
    }
  }

  async function remove(product: ProductWithCategory) {
    if (!confirm(`Supprimer "${product.name}" ? Action irréversible.`)) return;
    const { createBrowserClient } = await import("@supabase/ssr");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.from("products").delete().eq("id", product.id);

    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      router.refresh();
    } else {
      alert("Suppression impossible (commandes rattachées ?). Désactivez-le plutôt.");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Rechercher un produit…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3 font-medium text-stone-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {product.categories?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {product.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="mr-3 text-xs font-medium text-brand-700 hover:underline"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleActive(product)}
                    className="mr-3 text-xs font-medium text-stone-600 hover:underline"
                  >
                    {product.is_active ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(product)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-stone-400">
                  Aucun produit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
