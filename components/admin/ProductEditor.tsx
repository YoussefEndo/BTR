"use client";

import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Category, OptionValue, Product, ProductImage, ProductOption, ProductOptionType } from "@/types/database";
import { PRODUCT_OPTION_TYPES } from "@/types/database";

interface OptionDraft {
  id?: string; // set when the option already exists in DB
  name: string;
  type: ProductOptionType;
  is_required: boolean;
  values: { id?: string; value: string }[];
}

interface Props {
  mode: "create" | "edit";
  categories: Category[];
  product?: Product;
  images?: ProductImage[];
  options?: (ProductOption & { values: OptionValue[] })[];
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductEditor({
  mode,
  categories,
  product,
  images = [],
  options = [],
}: Props) {
  const router = useRouter();

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [mainImageUrl, setMainImageUrl] = useState(product?.main_image_url ?? "");
  const [gallery, setGallery] = useState<ProductImage[]>(images);
  const [optionDrafts, setOptionDrafts] = useState<OptionDraft[]>(
    options.map((o) => ({
      id: o.id,
      name: o.name,
      type: o.type,
      is_required: o.is_required,
      values: o.values.map((v) => ({ id: v.id, value: v.value })),
    }))
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  function slugChangedManually(value: string) {
    setSlug(value);
  }

  async function uploadImage(file: File, folder: "products" | "gallery"): Promise<string | null> {
    const supabase = getClient();
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) {
      setError(`Upload échoué : ${error.message}`);
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const url = await uploadImage(file, "products");
    if (url) setMainImageUrl(url);
  }

  async function handleGalleryImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const url = await uploadImage(file, "gallery");
    if (url) {
      setGallery((prev) => [
        ...prev,
        {
          id: `tmp-${Date.now()}`,
          product_id: product?.id ?? "",
          image_url: url,
          sort_order: prev.length + 1,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }

  async function removeGalleryImage(image: ProductImage) {
    // Local-only removal; the DB row is deleted on save so "Annuler"
    // restores the gallery untouched.
    setGallery((prev) => prev.filter((i) => i.id !== image.id));
  }

  function addOption() {
    setOptionDrafts((prev) => [
      ...prev,
      { name: "", type: "text", is_required: false, values: [] },
    ]);
  }

  function updateOption(index: number, patch: Partial<OptionDraft>) {
    setOptionDrafts((prev) =>
      prev.map((o, i) => (i === index ? { ...o, ...patch } : o))
    );
  }

  async function handleSave() {
    setError(null);

    if (name.trim().length < 2) {
      setError("Le nom du produit est requis.");
      return;
    }
    if (!categoryId) {
      setError("Sélectionnez une catégorie.");
      return;
    }

    setSaving(true);
    const supabase = getClient();
    const finalSlug = slug.trim() || slugify(name);

    try {
      let productId = product?.id ?? null;

      // --- Upsert product ---
      const payload = {
        name: name.trim(),
        slug: finalSlug,
        category_id: categoryId,
        description: description.trim(),
        main_image_url: mainImageUrl.trim() || null,
        is_active: isActive,
      };

      if (mode === "create") {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
        if (error) {
          // Surface duplicate-slug errors in plain language.
          throw new Error(
            error.code === "23505"
              ? `Ce slug existe déjà : "${finalSlug}". Choisissez un autre slug.`
              : error.message
          );
        }
        productId = data.id;
      } else {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product!.id);
        if (error) {
          throw new Error(
            error.code === "23505"
              ? `Ce slug existe déjà : "${finalSlug}". Choisissez un autre slug.`
              : error.message
          );
        }
      }

      // --- Gallery: insert new, delete removed ---
      const keptIds = gallery.filter((i) => !i.id.startsWith("tmp-")).map((i) => i.id);
      const toInsert = gallery
        .filter((i) => i.id.startsWith("tmp-"))
        .map((i, idx) => ({
          product_id: productId!,
          image_url: i.image_url,
          // Continue after kept images so ordering stays correct.
          sort_order: keptIds.length + idx + 1,
        }));

      if (toInsert.length > 0) {
        const { error } = await supabase.from("product_images").insert(toInsert);
        if (error) throw error;
      }
      if (mode === "edit") {
        const existingIds = (images ?? []).map((i) => i.id);
        const removed = existingIds.filter((id) => !keptIds.includes(id));
        for (const id of removed) {
          const { error } = await supabase
            .from("product_images")
            .delete()
            .eq("id", id);
          if (error) throw error;
        }
      }

      // --- Options: simple replace strategy (fine for MVP) ---
      for (const draft of optionDrafts) {
        if (draft.name.trim().length === 0) continue;
        let optionId = draft.id;
        const optionPayload = {
          product_id: productId!,
          name: draft.name.trim(),
          type: draft.type,
          is_required: draft.is_required,
        };
        if (optionId) {
          const { error } = await supabase
            .from("product_options")
            .update(optionPayload)
            .eq("id", optionId);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from("product_options")
            .insert(optionPayload)
            .select("id")
            .single();
          if (error) throw error;
          optionId = data.id;
        }

        // Replace option values atomically: delete + insert in one transaction.
        const valuesToInsert = draft.values
          .filter((v) => v.value.trim() !== "")
          .map((v, idx) => ({
            option_id: optionId!,
            value: v.value.trim(),
            sort_order: idx + 1,
          }));
        const { error: rpcError } = await supabase.rpc("replace_option_values", {
          p_option_id: optionId,
          p_values: valuesToInsert,
        });
        if (rpcError) {
          throw new Error(
            rpcError.code === "42883"
              ? "Migration manquante : exécutez supabase/migrations/0004_replace_option_values.sql dans le SQL Editor de Supabase, puis réessayez."
              : rpcError.message
          );
        }
      }

      // Delete options removed in the UI (cascade removes their values).
      const keptOptionIds = optionDrafts
        .filter((d) => d.id && d.name.trim().length > 0)
        .map((d) => d.id!);
      const removedOptionIds = (options ?? [])
        .map((o) => o.id)
        .filter((id) => !keptOptionIds.includes(id));
      for (const id of removedOptionIds) {
        const { error } = await supabase
          .from("product_options")
          .delete()
          .eq("id", id);
        if (error) throw error;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-semibold text-stone-900">
        {mode === "create" ? "Nouveau produit" : "Modifier le produit"}
      </h1>

      {/* --- Base fields --- */}
      <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Nom *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (mode === "create") setSlug(slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Slug (URL)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => slugChangedManually(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Catégorie *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="is_active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="is_active" className="text-sm text-stone-700">
              Produit actif (visible sur le site)
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Description *</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Image principale</label>
          <input type="file" accept="image/*" onChange={handleMainImage} className="text-sm" />
          {mainImageUrl && (
            <div className="relative mt-2 h-32 w-48 overflow-hidden rounded-lg border border-stone-200">
              <Image src={mainImageUrl} alt="" fill sizes="192px" className="object-cover" unoptimized />
            </div>
          )}
        </div>
      </section>

      {/* --- Gallery --- */}
      <section className="space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-stone-900">Galerie</h2>
        <input type="file" accept="image/*" onChange={handleGalleryImage} className="text-sm" />
        {gallery.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {gallery.map((image) => (
              <div key={image.id} className="relative h-24 w-32 overflow-hidden rounded-lg border border-stone-200">
                <Image src={image.image_url} alt="" fill sizes="128px" className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(image)}
                  className="absolute right-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Options --- */}
      <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Options de personnalisation</h2>
          <button
            type="button"
            onClick={addOption}
            className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium hover:bg-stone-50"
          >
            + Option
          </button>
        </div>

        {optionDrafts.map((draft, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-stone-200 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Nom (ex: Largeur (cm))"
                value={draft.name}
                onChange={(e) => updateOption(index, { name: e.target.value })}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              <select
                value={draft.type}
                onChange={(e) => updateOption(index, { type: e.target.value as ProductOptionType })}
                className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
              >
                {PRODUCT_OPTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={draft.is_required}
                  onChange={(e) => updateOption(index, { is_required: e.target.checked })}
                  className="h-4 w-4"
                />
                Requis
              </label>
            </div>

            {draft.type === "select" && (
              <div className="space-y-2">
                {draft.values.map((v, vi) => (
                  <div key={vi} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Valeur ${vi + 1}`}
                      value={v.value}
                      onChange={(e) =>
                        updateOption(index, {
                          values: draft.values.map((x, xi) =>
                            xi === vi ? { ...x, value: e.target.value } : x
                          ),
                        })
                      }
                      className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateOption(index, {
                          values: draft.values.filter((_, xi) => xi !== vi),
                        })
                      }
                      className="px-2 text-sm text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateOption(index, { values: [...draft.values, { value: "" }] })
                  }
                  className="text-sm font-medium text-brand-700 hover:underline"
                >
                  + Valeur
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOptionDrafts((prev) => prev.filter((_, i) => i !== index))}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Supprimer cette option
            </button>
          </div>
        ))}
      </section>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-brand-800 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium hover:bg-stone-50"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
