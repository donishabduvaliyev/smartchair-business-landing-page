import { useSEO } from "../hooks/useSEO";
import { Hero } from "../components/Hero";
import { CategoryStrip } from "../components/CategoryStrip";
import { BusinessOS } from "../components/BusinessOS";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Testimonials } from "../components/Testimonials";
import { PartnerInquirySection } from "../components/PartnerInquirySection";
import { FAQ } from "../components/FAQ";
import { CTA } from "../components/CTA";

export function Home() {
  useSEO({ canonicalPath: "/" });

  return (
    <>
      <Hero />
      <CategoryStrip />
      <Features />
      <BusinessOS />
      <HowItWorks />
      <Testimonials />
      <PartnerInquirySection />
      <FAQ />
      <CTA />
    </>
  );
}
