import { AllProductsSection } from "../features/products/components/AllProductsSection";
import { Footer } from "../components/layout/Footer";
import { DealsSection } from "../features/products/components/DealsSection";
import { HeroSection } from "../sections/HeroSection";
import { PromoBanners } from "../sections/PromoBanners";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <PromoBanners />
      <DealsSection />
      <AllProductsSection />
      <Footer />
    </>
  );
}