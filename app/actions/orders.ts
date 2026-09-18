"use server";

import { createClient } from "@/lib/supabase/server";
import { DB } from "@/lib/supabase/db";
import {
  validateCustomerFields,
  validateOptionValue,
} from "@/lib/validation/order";
import type { ProductOption, OptionValue } from "@/types/database";

export interface OrderFormState {
  ok: boolean;
  error?: string;
}

export interface CreateOrderInput {
  product_id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_note?: string;
  options: { option_id: string; value: string }[];
}

export async function createOrder(
  input: CreateOrderInput
): Promise<OrderFormState> {
  try {
    // --- Basic input shape checks ---
    if (
      typeof input?.product_id !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(input.product_id)
    ) {
      return { ok: false, error: "Produit invalide." };
    }

    const customerErrors = validateCustomerFields(input);
    if (customerErrors.length > 0) {
      return { ok: false, error: customerErrors[0].message };
    }

    const supabase = await createClient();

    // --- Load the product (must exist and be active) ---
    const { data: product } = await supabase
      .from(DB.products)
      .select("id, name, is_active")
      .eq("id", input.product_id)
      .eq("is_active", true)
      .maybeSingle();

    if (!product) {
      return { ok: false, error: "Produit introuvable." };
    }

    // --- Load option definitions server-side; never trust client values ---
    // Alias the embed as `values` to match ProductOption["values"] (if left
    // unaliased, PostgREST returns the rows under `option_values` and any
    // select option crashes the action with "Cannot read properties of
    // undefined (reading 'map')").
    const { data: optionDefs, error: optionDefsError } = await supabase
      .from(DB.productOptions)
      .select("*, values:option_values(*)")
      .eq("product_id", product.id);

    if (optionDefsError) {
      console.error(
        "[orders] option definitions fetch failed:",
        optionDefsError.message
      );
      return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
    }

    const defs = (optionDefs ?? []) as (ProductOption & {
      values: OptionValue[];
    })[];

    // --- Validate provided values against definitions ---
    const selected: { option_id: string; value: string }[] = [];
    for (const def of defs) {
      const raw = input.options.find((o) => o.option_id === def.id);
      const error = validateOptionValue(def, raw?.value);
      if (error) {
        return { ok: false, error: `${def.name} : ${error}` };
      }
      const value = (raw?.value ?? "").trim();
      if (value !== "") {
        // For select options, the value must be one of the defined choices.
        if (def.type === "select") {
          const allowed = (def.values ?? []).map((v) => v.value);
          if (!allowed.includes(value)) {
            return { ok: false, error: `${def.name} : valeur non autorisée.` };
          }
        }
        selected.push({ option_id: def.id, value });
      }
    }

    // --- Persist via security-definer RPC (migration 0014) ---
    // A direct anon insert with RETURNING fails RLS: Postgres filters
    // RETURNING rows through the SELECT policy, and anon has no SELECT on
    // orders (customer PII). create_order() inserts the order + options
    // atomically and returns the id without exposing any orders row.
    const { data: orderId, error: rpcError } = await supabase.rpc(
      "create_order",
      {
        p_product_id: product.id,
        p_customer_name: input.customer_name.trim(),
        p_customer_phone: input.customer_phone.trim(),
        p_customer_city: input.customer_city.trim(),
        p_customer_note: input.customer_note?.trim() || null,
        p_options: selected.map((s) => ({
          option_name:
            defs.find((d) => d.id === s.option_id)?.name ?? "Option",
          option_value: s.value,
        })),
      }
    );

    if (rpcError || !orderId) {
      console.error("[orders] create_order rpc failed:", rpcError?.message);
      return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[orders] unexpected error:", err);
    return { ok: false, error: "Une erreur est survenue. Veuillez réessayer." };
  }
}
