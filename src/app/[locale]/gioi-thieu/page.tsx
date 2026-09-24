import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import MissionStatement from "@/components/about/MissionStatement";
import AboutStoryBlocks from "@/components/about/AboutStoryBlocks";
import StatsRow from "@/components/about/StatsRow";
import ValuesGrid from "@/components/about/ValuesGrid";
import Team from "@/components/about/Team";
import Gallery from "@/components/about/Gallery";
import AboutCta from "@/components/about/AboutCta";

export const metadata: Metadata = {
  title: "Giới thiệu — VERITY GEAR",
  description:
    "Câu chuyện thương hiệu VERITY GEAR — sứ mệnh, giá trị cốt lõi và hành trình chế tác phụ kiện gaming cao cấp cho game thủ.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionStatement />
      <AboutStoryBlocks />

      <div className="pt-24 sm:pt-32">
        <StatsRow />
      </div>
      <ValuesGrid />
      <Team />
      <Gallery />
      <AboutCta />
    </>
  );
}
