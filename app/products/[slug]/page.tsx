import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { OrderForm } from "@/components/order/OrderForm";
import { getProductWithOptions } from "@/lib/queries/products";
import { catalogProductName, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

// ISR: catalog data is public and cache-safe; admin edits appear within 60s.
export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductWithOptions(slug);
  if (!result) return { title: "Produit introuvable" };
  return {
    title: result.product.name,
    description: result.product.description.slice(0, 155),
    openGraph: {
      title: result.product.name,
      description: result.product.description.slice(0, 155),
      images: result.product.main_image_url
        ? [result.product.main_image_url]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const locale = await getLocale();
  const { slug } = await params;
  const data = await getProductWithOptions(slug);
  if (!data) notFound();

  const { product, images, options } = data;
  const productName = catalogProductName(locale, product.name);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-stone-400">
          <Link href="/" className="hover:text-brand-700">{translate(locale, "home")}</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-brand-700">{translate(locale, "products")}</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-600">{productName}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left column: gallery + description live inside the form column on mobile; duplicate heading here for desktop clarity */}
          <div className="order-2 space-y-8 lg:order-1">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
                {productName}
              </h1>
              <p className="mt-2 text-sm text-stone-400">
                {translate(locale, "customManufacturing")}
              </p>
            </div>
            <OrderForm
              product={product}
              images={images}
              options={options}
              locale={locale}
            />
          </div>

          {/* Sticky summary on desktop */}
          <aside className="order-1 lg:order-2">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 lg:sticky lg:top-24">
              <h2 className="font-semibold text-stone-900">
                {translate(locale, "orderThisFurniture")}
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                {translate(locale, "orderDescription")}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-stone-600">
                <li>✓ {translate(locale, "dimensionsOnRequest")}</li>
                <li>✓ {translate(locale, "colorFinishChoice")}</li>
                <li>✓ {translate(locale, "quickWhatsAppReply")}</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
