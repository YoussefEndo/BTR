import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/products/ProductCard";
import { getActiveCategories } from "@/lib/queries/categories";
import { getActiveProducts } from "@/lib/queries/products";

// ISR: catalog data is public and cache-safe; admin edits appear within 60s.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Produits",
  description:
    "Découvrez notre mobilier sur mesure : tables, placards, meubles TV, bureaux, cuisines et plus.",
};

interface Props {
  searchParams: Promise<{ categorie?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { categorie } = await searchParams;

  const categories = await getActiveCategories();
  const selected = categories.find((c) => c.slug === categorie) ?? null;
  const products = await getActiveProducts(selected?.id);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Nos produits
        </h1>
        <p className="mt-2 text-stone-500">
          Tout est fabriqué sur mesure. Sélectionnez un produit pour configurer
          vos dimensions et demander un devis.
        </p>

        {/* Category filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              !selected
                ? "border-brand-800 bg-brand-800 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-brand-300"
            }`}
          >
            Tous
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?categorie=${category.slug}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selected?.id === category.id
                  ? "border-brand-800 bg-brand-800 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-brand-300"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-stone-300 p-12 text-center">
            <p className="font-medium text-stone-900">Aucun produit trouvé.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
