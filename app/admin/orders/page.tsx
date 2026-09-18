import { OrdersManager } from "@/components/admin/OrdersManager";
import { createClient } from "@/lib/supabase/server";
import { DB } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from(DB.orders)
    .select("*, products(name, slug)")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as OrderRow[];

  return <OrdersManager initialOrders={orders} />;
}

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
