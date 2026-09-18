/**
 * Hand-written types mirroring supabase/migrations (no Supabase codegen for
 * the MVP). If you change the schema, update these types accordingly.
 */

export type OrderStatus =
  | "pending"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
];

export type ProductOptionType = "text" | "number" | "select" | "textarea";

export const PRODUCT_OPTION_TYPES: ProductOptionType[] = [
  "text",
  "number",
  "select",
  "textarea",
];

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  main_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface ProductOption {
  id: string;
  product_id: string;
  name: string;
  type: ProductOptionType;
  is_required: boolean;
  sort_order: number;
  created_at: string;
}

export interface OptionValue {
  id: string;
  option_id: string;
  value: string;
  sort_order: number;
}

export interface Order {
  id: string;
  product_id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_note: string | null;
  status: OrderStatus;
  created_at: string;
}

export interface OrderOption {
  id: string;
  order_id: string;
  option_name: string;
  option_value: string;
}

/** Product row joined with its category (used in listings/admin). */
export interface ProductWithCategory extends Product {
  categories: Pick<Category, "id" | "name" | "slug"> | null;
}
