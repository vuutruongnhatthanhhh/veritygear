import type { Metadata } from "next";
import MilestonesHero from "@/components/milestones/MilestonesHero";
import Timeline from "@/components/milestones/Timeline";
import ProductLineup from "@/components/milestones/ProductLineup";
import StatsRow from "@/components/about/StatsRow";
import AboutCta from "@/components/about/AboutCta";

export const metadata: Metadata = {
  title: "Cột mốc — VERITY GEAR",
  description:
    "Hành trình phát triển của VERITY GEAR — các cột mốc đáng nhớ từ ngày thành lập đến khi trở thành thương hiệu phụ kiện gaming được tin dùng.",
};

export default function MilestonesPage() {
  return (
    <>
      <MilestonesHero />
      <Timeline />
      <ProductLineup />
      <StatsRow />
      <AboutCta />
    </>
  );
}
