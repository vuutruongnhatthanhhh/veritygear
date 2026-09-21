import type { Metadata } from "next";
import { Suspense } from "react";
import NewsHero from "@/components/news/NewsHero";
import NewsGrid from "@/components/news/NewsGrid";
import Newsletter from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "Tin tức — VERITY GEAR",
  description:
    "Cập nhật tin tức mới nhất từ VERITY GEAR — ra mắt sản phẩm, sự kiện esports và hướng dẫn chọn phụ kiện gaming.",
};

export default function NewsPage() {
  return (
    <>
      <NewsHero />
      <Suspense>
        <NewsGrid />
      </Suspense>
      <Newsletter />
    </>
  );
}
