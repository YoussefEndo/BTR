"use client";

import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/orders", label: "Commandes" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-stone-100">
      <aside className="flex w-56 flex-col border-r border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-4">
          <Link href="/" className="font-semibold text-brand-900">
            BTR Immo Déco — Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-800 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-stone-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  );
}
