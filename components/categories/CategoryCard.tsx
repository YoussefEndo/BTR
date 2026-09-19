import Image from "next/image";
import Link from "next/link";

import type { Category } from "@/types/database";
import { translate, type Locale } from "@/lib/i18n";

export function CategoryCard({ category, locale }: { category: Category; locale: Locale }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-brand-900 shadow-sm outline-none transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-accent-400 sm:aspect-[4/5]"
    >
      {category.image_url ? (
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
      ) : null}
      {/* Readability gradient + accent reveal on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent-400 transition-transform duration-300 group-hover:scale-x-100" />

      <div className="relative p-6">
        <h3 className="font-display text-2xl font-semibold text-white">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 line-clamp-1 text-sm text-white/70">
            {category.description}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-300">
          {translate(locale, "discoverCategory")}
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
