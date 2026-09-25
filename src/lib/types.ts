// Resolved (locale-picked) display shapes — every product/category-fetching
// component builds one of these from the bilingual DB columns before handing
// off to presentational components (ProductCard, SpecsCard, RelatedProducts,
// ProductActions), so those components never need to know about locale.

export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  badge?: string;
  description: string;
  specs: { label: string; value: string }[];
};

export type Category = {
  slug: string;
  name: string;
  image: string;
  count: number;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  // Rich-text HTML from the admin's TipTap editor, rendered via
  // dangerouslySetInnerHTML — trusted since only staff (RLS-gated) write it.
  content: string;
  image: string;
  category: string;
  categorySlug: string;
  date: string;
  readTime: string;
};

export type NewsCategory = {
  slug: string;
  name: string;
};

export const ORDER_STATUSES = ["pending", "confirmed", "shipping", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

export type OrderItem = {
  productSlug: string;
  productName: string;
  productImage: string | null;
  price: number;
  qty: number;
};

export type Order = {
  orderCode: string;
  status: OrderStatus;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  note: string;
  paymentMethod: "cod" | "transfer";
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
};
