import { FinalCallToAction } from "@/components/landing/FinalCallToAction";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { ValueSection } from "@/components/landing/ValueSection";

export default function HomePage() {
  return (
    <div className="landing-shell" id="top">
      <LandingHeader />
      <main>
        <HeroSection />
        <ValueSection />
        <HowItWorksSection />
        <UseCasesSection />
        <FinalCallToAction />
      </main>
      <LandingFooter />
    </div>
  );
}
