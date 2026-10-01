import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import MilestonesHero from "@/components/milestones/MilestonesHero";
import Timeline from "@/components/milestones/Timeline";
import ProductLineup from "@/components/milestones/ProductLineup";
import StatsRow from "@/components/about/StatsRow";
import AboutCta from "@/components/about/AboutCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/cot-moc",
    title: t("milestonesTitle"),
    description: t("milestonesDescription"),
  });
}

export const revalidate = 300;

export default async function MilestonesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

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
