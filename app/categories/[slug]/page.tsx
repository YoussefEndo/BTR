import type { Metadata } from "next";
import Image from "next/image";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getActiveCategories } from "@/lib/queries/categories";
import { getActiveProducts } from "@/lib/queries/products";
import { ProductCard } from "@/components/products/ProductCard";
import { catalogCategory, catalogCategoryDescription, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

// ISR: catalog data is public and cache-safe; admin edits appear within 60s.
export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.charAt(0).toUpperCase() + slug.slice(1).replaceAll("-", " "),
  };
}

export default async function CategoryPage({ params }: Props) {
  const locale = await getLocale();
  const { slug } = await params;

  const categories = await getActiveCategories();
  const category = categories.find((c) => c.slug === slug) ?? null;

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar locale={locale} />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-stone-900">
            {translate(locale, "categoryNotFound")}
          </h1>
          <p className="mt-2 text-stone-500">
            {translate(locale, "categoryUnavailable")}
          </p>
        </main>
        <Footer locale={locale} />
      </div>
    );
  }

  const products = await getActiveProducts(category.id);
  const categoryName = catalogCategory(locale, category.slug, category.name);
  const categoryDescription = catalogCategoryDescription(locale, category.slug, category.description);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />

      <main className="flex-1">
        {/* Hero banner with the category photo */}
        <section className="relative flex min-h-[38svh] items-end overflow-hidden bg-brand-950">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={categoryName}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-brand-950/10" />
          <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">
              {translate(locale, "category")}
            </p>
            <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {categoryName}
            </h1>
            {categoryDescription && (
              <p className="mt-3 max-w-2xl text-white/70">
                {categoryDescription}
              </p>
            )}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
              <p className="font-medium text-stone-900">
                {translate(locale, "noProducts")}
              </p>
              <p className="mt-1 text-sm text-stone-500">
                {translate(locale, "comingSoon")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
