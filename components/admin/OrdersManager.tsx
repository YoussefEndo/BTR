"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { OrderStatus } from "@/types/database";
import { ORDER_STATUSES } from "@/types/database";

interface OrderRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_note: string | null;
  status: string;
  created_at: string;
  products: { name: string; slug: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  contacted: "Contacté",
  confirmed: "Confirmée",
  completed: "Terminée",
  cancelled: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function OrdersManager({ initialOrders }: { initialOrders: OrderRow[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  async function changeStatus(orderId: string, status: OrderStatus) {
    setBusyId(orderId);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      router.refresh();
    }
    setBusyId(null);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Commandes</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Détails</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3 text-stone-500">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 font-medium text-stone-900">
                  {order.products?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {order.customer_name}
                  <br />
                  <span className="text-xs text-stone-500">{order.customer_phone}</span>
                </td>
                <td className="px-4 py-3 text-stone-500">{order.customer_city}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    disabled={busyId === order.id}
                    onChange={(e) => changeStatus(order.id, e.target.value as OrderStatus)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-stone-100"} border-0`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedId(order.id)}
                    className="text-xs font-medium text-brand-700 hover:underline"
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                  Aucune commande pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-stone-900">
                Commande — {selected.products?.name ?? "Produit supprimé"}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Client</dt>
                <dd className="font-medium">{selected.customer_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Téléphone</dt>
                <dd className="font-medium">{selected.customer_phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Ville</dt>
                <dd className="font-medium">{selected.customer_city}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Date</dt>
                <dd className="font-medium">
                  {new Date(selected.created_at).toLocaleString("fr-FR")}
                </dd>
              </div>
              {selected.customer_note && (
                <div>
                  <dt className="text-stone-500">Note</dt>
                  <dd className="mt-1 rounded-lg bg-stone-50 p-3 text-stone-700">
                    {selected.customer_note}
                  </dd>
                </div>
              )}
            </dl>

            <OrderOptions orderId={selected.id} />

            <div className="mt-6 border-t border-stone-200 pt-4">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Statut de la commande
              </label>
              <select
                value={selected.status}
                onChange={(e) => changeStatus(selected.id, e.target.value as OrderStatus)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Loads order options for the detail modal. */
function OrderOptions({ orderId }: { orderId: string }) {
  const [options, setOptions] = useState<{ option_name: string; option_value: string }[] | null>(null);

  if (options === null) {
    // Lazy-load once when the modal opens.
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
      .from("order_options")
      .select("option_name, option_value")
      .eq("order_id", orderId)
      .then(({ data }) => setOptions(data ?? []));
  }

  if (options === null) return <p className="mt-4 text-sm text-stone-400">Chargement…</p>;
  if (options.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-stone-900">Options choisies</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {options.map((o, i) => (
          <li key={i} className="flex justify-between rounded-lg bg-stone-50 px-3 py-2">
            <span className="text-stone-500">{o.option_name}</span>
            <span className="font-medium">{o.option_value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
