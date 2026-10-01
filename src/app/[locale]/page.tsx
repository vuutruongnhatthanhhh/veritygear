import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeatureStrip from "@/components/FeatureStrip";
import BrandStoryTeaser from "@/components/BrandStoryTeaser";
import ProductSpotlight from "@/components/ProductSpotlight";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

// ISR: served from cache and regenerated in the background at most once a
// minute, instead of re-querying Supabase for every section on every visit.
export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Marquee />
      <CategoryGrid />
      <FeaturedProducts />
      <FeatureStrip />
      <BrandStoryTeaser />
      <ProductSpotlight />
      <Testimonials />
      <Newsletter />
    </>
  );
}
