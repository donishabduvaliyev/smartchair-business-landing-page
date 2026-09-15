import { Hero } from "../components/Hero";
import { CategoryStrip } from "../components/CategoryStrip";
import { BusinessOS } from "../components/BusinessOS";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Stats } from "../components/Stats";
import { Testimonials } from "../components/Testimonials";
import { CTA } from "../components/CTA";

export function Home() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <BusinessOS />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
}
