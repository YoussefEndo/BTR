/**
 * Central catalog of DB table names used with dynamic select/filter strings in
 * the Supabase client. Add table/column names here as the schema grows so
 * query strings stay in one place.
 */
export const DB = {
  categories: "categories",
  products: "products",
  productImages: "product_images",
  productOptions: "product_options",
  optionValues: "option_values",
  orders: "orders",
  orderOptions: "order_options",
} as const;
