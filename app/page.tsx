import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import BenchmarkSection from "@/components/BenchmarkSection";
// import TestimonialsSection from "@/components/TestimonialsSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import PalestineSection from "@/components/PalestineSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeatureSection />
      <BenchmarkSection />
      {/* <TestimonialsSection /> */}
      <ShowcaseSection />
      <PalestineSection />
      <CTASection />
      <Footer />
    </main>
  );
}
