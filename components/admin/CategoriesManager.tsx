"use client";

import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Category } from "@/types/database";

interface Props {
  initialCategories: Category[];
}

export function CategoriesManager({ initialCategories }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function getClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Uploads to the public product-images bucket under categories/.
  async function uploadCategoryImage(file: File): Promise<string | null> {
    const supabase = getClient();
    const ext = file.name.split(".").pop();
    const path = `categories/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) {
      alert(`Upload échoué : ${error.message}`);
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleImageChange(
    category: Category,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    // Reset so picking the same file again re-triggers onChange.
    e.target.value = "";
    if (!file) return;
    setUploadingId(category.id);

    const url = await uploadCategoryImage(file);
    if (url) {
      const supabase = getClient();
      const { error } = await supabase
        .from("categories")
        .update({ image_url: url })
        .eq("id", category.id);
      if (!error) {
        setCategories((prev) =>
          prev.map((c) => (c.id === category.id ? { ...c, image_url: url } : c))
        );
        router.refresh();
      } else {
        alert(`Impossible d'enregistrer l'image : ${error.message}`);
      }
    }
    setUploadingId(null);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    setBusy(true);

    const supabase = getClient();
    const slug = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), slug, description: description.trim() || null })
      .select()
      .single();

    if (!error && data) {
      setCategories((prev) => [...prev, data as Category]);
      setName("");
      setDescription("");
      router.refresh();
    } else {
      alert(error?.message ?? "Erreur lors de la création.");
    }
    setBusy(false);
  }

  async function handleToggle(category: Category) {
    setBusy(true);
    const supabase = getClient();
    const { error } = await supabase
      .from("categories")
      .update({ is_active: !category.is_active })
      .eq("id", category.id);

    if (!error) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id ? { ...c, is_active: !c.is_active } : c
        )
      );
      router.refresh();
    }
    setBusy(false);
  }

  async function handleDelete(category: Category) {
    if (
      !confirm(`Supprimer la catégorie "${category.name}" ? Action irréversible.`)
    )
      return;
    setBusy(true);
    const supabase = getClient();
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (!error) {
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      router.refresh();
    } else {
      alert(
        "Impossible de supprimer (des produits y sont peut-être rattachés). Désactivez-la plutôt."
      );
    }
    setBusy(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Catégories</h1>

      <form onSubmit={handleAdd} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm"
        />
        <input
          type="text"
          placeholder="Description (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-brand-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          Ajouter
        </button>
      </form>

      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                      {category.image_url ? (
                        <Image
                          src={category.image_url}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-[10px] text-stone-400">
                          —
                        </span>
                      )}
                    </div>
                    <label
                      className={`cursor-pointer text-xs font-medium text-brand-700 hover:underline ${
                        uploadingId === category.id ? "opacity-50" : ""
                      }`}
                    >
                      {uploadingId === category.id
                        ? "Envoi…"
                        : category.image_url
                          ? "Changer"
                          : "Ajouter"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingId !== null}
                        onChange={(e) => handleImageChange(category, e)}
                      />
                    </label>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-stone-900">{category.name}</td>
                <td className="px-4 py-3 text-stone-500">{category.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      category.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleToggle(category)}
                    className="mr-2 text-xs font-medium text-brand-700 hover:underline"
                  >
                    {category.is_active ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-400">
                  Aucune catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
