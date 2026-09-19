import Link from "next/link";
import { translate, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-xl font-bold text-brand-900">
              BTR <span className="italic text-accent-500">Immo Déco</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-stone-500">
              {translate(locale, "heroDescription")}
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <p className="font-medium text-stone-900">{translate(locale, "navigation")}</p>
            <Link href="/" className="text-stone-500 hover:text-brand-700">
              {translate(locale, "home")}
            </Link>
            <Link href="/products" className="text-stone-500 hover:text-brand-700">
              {translate(locale, "products")}
            </Link>
          </nav>
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium text-stone-900">{translate(locale, "contact")}</p>
            <p className="text-stone-500">{translate(locale, "casablancaMorocco")}</p>
            <p className="text-stone-500">{translate(locale, "freeQuoteWhatsApp")}</p>
          </div>
        </div>
        <p className="mt-10 border-t border-stone-200 pt-6 text-xs text-stone-400">
          © {new Date().getFullYear()} BTR Immobilier Déco. Tous droits
          {translate(locale, "allRightsReserved")}
        </p>
      </div>
    </footer>
  );
}
