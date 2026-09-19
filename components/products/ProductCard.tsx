import Image from "next/image";
import Link from "next/link";

import type { ProductWithCategory } from "@/types/database";
import { translate, type Locale } from "@/lib/i18n";

export function ProductCard({ product, locale }: { product: ProductWithCategory; locale: Locale }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-accent-400"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {product.main_image_url ? (
          <Image
            src={product.main_image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            {translate(locale, "noImage")}
          </div>
        )}
        {product.categories && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-800 backdrop-blur-sm">
            {product.categories.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-stone-900">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500">
          {product.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
          {translate(locale, "seeDetails")}
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
