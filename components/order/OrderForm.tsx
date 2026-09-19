"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { createOrder } from "@/app/actions/orders";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { validateCustomerFields, validateOptionValue } from "@/lib/validation/order";
import type { OptionValue, Product, ProductImage, ProductOption } from "@/types/database";
import { translate, type Locale } from "@/lib/i18n";

interface Props {
  product: Product;
  images: ProductImage[];
  options: (ProductOption & { values: OptionValue[] })[];
  locale: Locale;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function OrderForm({ product, images, options, locale }: Props) {
  const [gallery] = useState(images);
  const [activeImage, setActiveImage] = useState(
    product.main_image_url ?? images[0]?.image_url ?? null
  );
  const [optionValues, setOptionValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.map((o) => [o.id, ""]))
  );
  const [customer, setCustomer] = useState({
    customer_name: "",
    customer_phone: "",
    customer_city: "",
    customer_note: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allImages = useMemo(() => {
    const urls = [product.main_image_url, ...gallery.map((i) => i.image_url)].filter(
      (u): u is string => Boolean(u)
    );
    return [...new Set(urls)];
  }, [product.main_image_url, gallery]);

  function setOption(id: string, value: string) {
    setOptionValues((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    // --- Client-side validation (server re-validates everything) ---
    const customerErrors = validateCustomerFields(customer);
    if (customerErrors.length > 0) {
      setErrorMessage(customerErrors[0].message);
      return;
    }
    for (const option of options) {
      const error = validateOptionValue(option, optionValues[option.id]);
      if (error) {
        setErrorMessage(`${option.name} : ${error}`);
        return;
      }
    }

    setStatus("submitting");

    // 1) Save the order to Supabase via a server action.
    const result = await createOrder({
      product_id: product.id,
      ...customer,
      options: options.map((o) => ({
        option_id: o.id,
        value: optionValues[o.id] ?? "",
      })),
    });

    if (!result.ok) {
      // 2) On DB failure: do NOT open WhatsApp, show a clear error, allow retry.
      setStatus("error");
      setErrorMessage(result.error ?? "Une erreur est survenue. Veuillez réessayer.");
      return;
    }

    // 3) Success: build the WhatsApp message and open click-to-chat.
    const url = buildWhatsAppUrl({
      productName: product.name,
      options: options
        .map((o) => ({ name: o.name, value: (optionValues[o.id] ?? "").trim() }))
        .filter((o) => o.value !== ""),
      customerName: customer.customer_name.trim(),
      customerPhone: customer.customer_phone.trim(),
      customerCity: customer.customer_city.trim(),
      note: customer.customer_note.trim() || null,
    });

    setStatus("success");
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">
          {translate(locale, "requestSaved")}
        </p>
        <p className="mt-2 text-sm text-green-700">
          {translate(locale, "whatsappPopup")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-green-300 px-5 py-2 text-sm font-medium text-green-800 hover:bg-green-100"
        >
          {translate(locale, "anotherRequest")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Gallery */}
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">
              {translate(locale, "noImage")}
            </div>
          )}
        </div>
        {allImages.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {allImages.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveImage(url)}
                className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                  activeImage === url ? "border-brand-600" : "border-transparent"
                }`}
              >
                <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900">{translate(locale, "description")}</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-600">
          {product.description}
        </p>
      </div>

      {/* Dynamic customization form, generated from DB options */}
      {options.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            {translate(locale, "customization")}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {translate(locale, "customizationDescription")}
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {options.map((option) => (
              <div
                key={option.id}
                className={option.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <label
                  htmlFor={`option-${option.id}`}
                  className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                  {option.name}
                  {option.is_required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>

                {option.type === "select" ? (
                  <select
                    id={`option-${option.id}`}
                    value={optionValues[option.id] ?? ""}
                    onChange={(e) => setOption(option.id, e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">{translate(locale, "choose")}</option>
                    {option.values.map((v) => (
                      <option key={v.id} value={v.value}>
                        {v.value}
                      </option>
                    ))}
                  </select>
                ) : option.type === "textarea" ? (
                  <textarea
                    id={`option-${option.id}`}
                    rows={3}
                    value={optionValues[option.id] ?? ""}
                    onChange={(e) => setOption(option.id, e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                ) : (
                  <input
                    id={`option-${option.id}`}
                    type={option.type === "number" ? "number" : "text"}
                    min={option.type === "number" ? 1 : undefined}
                    value={optionValues[option.id] ?? ""}
                    onChange={(e) => setOption(option.id, e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer information */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900">
          {translate(locale, "yourInformation")}
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="customer_name" className="mb-1.5 block text-sm font-medium text-stone-700">
              {translate(locale, "name")} <span className="text-red-500">*</span>
            </label>
            <input
              id="customer_name"
              type="text"
              required
              value={customer.customer_name}
              onChange={(e) => setCustomer({ ...customer, customer_name: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="customer_phone" className="mb-1.5 block text-sm font-medium text-stone-700">
              {translate(locale, "phone")} <span className="text-red-500">*</span>
            </label>
            <input
              id="customer_phone"
              type="tel"
              required
              placeholder="+212 6 XX XX XX XX"
              value={customer.customer_phone}
              onChange={(e) => setCustomer({ ...customer, customer_phone: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="customer_city" className="mb-1.5 block text-sm font-medium text-stone-700">
              {translate(locale, "city")} <span className="text-red-500">*</span>
            </label>
            <input
              id="customer_city"
              type="text"
              required
              value={customer.customer_city}
              onChange={(e) => setCustomer({ ...customer, customer_city: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="customer_note" className="mb-1.5 block text-sm font-medium text-stone-700">
              {translate(locale, "note")}
            </label>
            <textarea
              id="customer_note"
              rows={3}
              value={customer.customer_note}
              onChange={(e) => setCustomer({ ...customer, customer_note: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Sticky mobile CTA */}
      <div className="sticky bottom-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-brand-800 px-6 py-4 text-base font-semibold text-white shadow-lg transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting"
            ? translate(locale, "sending")
            : translate(locale, "sendWhatsAppRequest")}
        </button>
      </div>
      <p className="text-center text-xs text-stone-400">
        {translate(locale, "onRequest")}
      </p>
    </form>
  );
}
