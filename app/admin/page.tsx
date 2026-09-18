import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { DB } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [products, categories, pendingOrders] = await Promise.all([
    supabase.from(DB.products).select("id", { count: "exact", head: true }),
    supabase.from(DB.categories).select("id", { count: "exact", head: true }),
    supabase
      .from(DB.orders)
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const stats = [
    { label: "Produits", value: products.count ?? 0, href: "/admin/products" },
    { label: "Catégories", value: categories.count ?? 0, href: "/admin/categories" },
    { label: "Commandes en attente", value: pendingOrders.count ?? 0, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-stone-900">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
