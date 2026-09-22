import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Giỏ hàng — VERITY GEAR",
  description: "Xem lại sản phẩm trong giỏ hàng trước khi tiến hành thanh toán.",
};

export default function CartPage() {
  return <CartView />;
}
