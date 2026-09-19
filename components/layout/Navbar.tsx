"use client";

import Link from "next/link";
import { useState } from "react";
import { LocaleToggle } from "@/components/layout/LocaleToggle";
import { translate, type Locale } from "@/lib/i18n";

export function Navbar({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: translate(locale, "home") },
    { href: "/#categories", label: translate(locale, "categories") },
    { href: "/products", label: translate(locale, "products") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-brand-900"
        >
          BTR <span className="italic text-accent-500">Immo Déco</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
          <LocaleToggle locale={locale} />
          <Link
            href="/products"
            className="rounded-full bg-brand-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            {translate(locale, "discover")}
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-stone-700 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-stone-200 bg-white px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-base font-medium text-stone-700 hover:bg-stone-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="px-3 py-2.5"><LocaleToggle locale={locale} /></div>
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-brand-800 px-5 py-2.5 text-center text-sm font-medium text-white"
          >
            {translate(locale, "discover")}
          </Link>
        </nav>
      )}
    </header>
  );
}
