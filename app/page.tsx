import Image from "next/image";
import Link from "next/link";

import { CategoryCard } from "@/components/categories/CategoryCard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/products/ProductCard";
import { getActiveCategories } from "@/lib/queries/categories";
import { getActiveProducts } from "@/lib/queries/products";

// ISR: catalog data is public and cache-safe; admin edits appear within 60s.
export const revalidate = 60;

const VALUE_PROPS = [
  {
    title: "100% sur mesure",
    text: "Chaque pièce est conçue selon vos dimensions exactes.",
  },
  {
    title: "Devis gratuit",
    text: "Décrivez votre projet, réponse rapide par WhatsApp.",
  },
  {
    title: "Matériaux au choix",
    text: "Couleurs, finitions et configurations personnalisées.",
  },
  {
    title: "Suivi direct",
    text: "Un interlocuteur unique du devis à la livraison.",
  },
] as const;

const STEPS = [
  {
    number: "01",
    title: "Choisissez & configurez",
    text: "Parcourez le catalogue et réglez dimensions, couleurs et finitions.",
  },
  {
    number: "02",
    title: "Envoyez votre demande",
    text: "Un clic, votre configuration part directement sur WhatsApp.",
  },
  {
    number: "03",
    title: "Recevez votre devis",
    text: "Notre équipe vous répond rapidement avec un prix personnalisé.",
  },
] as const;

export default async function Home() {
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    getActiveProducts(),
  ]);
  const featured = products.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative flex min-h-[92svh] items-center overflow-hidden bg-brand-950">
          <Image
            src="/hero-furniture.jpg"
            alt="Salon avec mobilier sur mesure"
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover opacity-45"
          />
          {/* Cinematic gradient: readable text over any photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-brand-950/20" />

          <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              Mobilier sur mesure · Casablanca
            </p>

            <h1 className="font-display mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Votre intérieur, conçu selon{" "}
              <span className="italic text-accent-300">vos dimensions.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Tables, placards, meubles TV, bureaux et cuisines fabriqués sur
              mesure. Configurez en ligne, recevez votre devis sur WhatsApp.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-brand-900 shadow-lg transition-all hover:bg-brand-100 hover:shadow-xl"
              >
                Découvrir nos produits
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/15"
              >
                Devis sur WhatsApp
              </a>
            </div>

            {/* Value props pinned to the hero base */}
            <dl className="mt-16 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-3">
              {VALUE_PROPS.slice(0, 3).map((item) => (
                <div key={item.title}>
                  <dt className="font-display text-xl font-semibold text-accent-300">
                    {item.title}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-white/65">
                    {item.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------- Categories --------------------------- */}
        <section id="categories" className="bg-brand-950 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-400">
                  Nos univers
                </p>
                <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Explorez nos catégories
                </h2>
                <p className="mt-2 max-w-lg text-white/60">
                  Chaque pièce est fabriquée sur mesure selon vos besoins — du
                  salon à la cuisine.
                </p>
              </div>
              <Link
                href="/products"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-400"
              >
                Tout le catalogue
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------ Featured products ------------------------ */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-500">
                  Sélection
                </p>
                <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                  Produits populaires
                </h2>
              </div>
              <Link
                href="/products"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-900"
              >
                Tout voir
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- How it works --------------------------- */}
        <section className="border-y border-stone-200 bg-stone-50 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-500">
                Simple & rapide
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Comment ça marche ?
              </h2>
            </div>
            <ol className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <li
                  key={step.number}
                  className={
                    i > 0
                      ? "sm:border-l sm:border-stone-200 sm:pl-10"
                      : undefined
                  }
                >
                  <span className="font-display text-4xl font-semibold text-brand-300">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-stone-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------- Why choose us -------------------------- */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-500">
                La différence BTR
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Pourquoi nous choisir ?
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VALUE_PROPS.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
                >
                  <div className="h-1 w-8 rounded-full bg-brand-300 transition-colors group-hover:bg-accent-400" />
                  <h3 className="mt-4 font-semibold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ Final CTA ------------------------------ */}
        <section className="relative overflow-hidden bg-brand-900 py-20 sm:py-24">
          {/* Radial glow behind the CTA */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/15 blur-[120px]"
          />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Vous avez un projet ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-white/70">
              Parlez-nous de votre idée — nous vous répondons rapidement avec
              un devis gratuit.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-400 px-8 py-3.5 text-sm font-semibold text-brand-950 shadow-lg transition-all hover:bg-accent-300 hover:shadow-xl"
            >
              Nous contacter sur WhatsApp
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
