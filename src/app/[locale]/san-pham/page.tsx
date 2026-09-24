import type { Metadata } from "next";
import { Suspense } from "react";
import ShopHero from "@/components/shop/ShopHero";
import ProductsGrid from "@/components/shop/ProductsGrid";
import Newsletter from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "Sản phẩm — VERITY GEAR",
  description:
    "Toàn bộ bộ sưu tập phụ kiện gaming VERITY GEAR — bàn phím cơ, chuột gaming, tai nghe, lót chuột và tay cầm cao cấp.",
};

export default function ShopPage() {
  return (
    <>
      <ShopHero />
      <Suspense>
        <ProductsGrid />
      </Suspense>
      <Newsletter />
    </>
  );
}
