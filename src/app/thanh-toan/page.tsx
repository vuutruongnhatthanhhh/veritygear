import type { Metadata } from "next";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Thanh toán — VERITY GEAR",
  description:
    "Hoàn tất thông tin giao hàng và thanh toán đơn hàng VERITY GEAR của bạn.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
