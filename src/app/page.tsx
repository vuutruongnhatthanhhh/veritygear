import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeatureStrip from "@/components/FeatureStrip";
import BrandStoryTeaser from "@/components/BrandStoryTeaser";
import ProductSpotlight from "@/components/ProductSpotlight";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

export default function Home() {
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
