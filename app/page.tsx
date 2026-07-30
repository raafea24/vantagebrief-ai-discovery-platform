import { HeroSection } from "@/components/landing/HeroSection";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { ValueSection } from "@/components/landing/ValueSection";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <LandingHeader />
      <HeroSection />
      <ValueSection />
    </main>
  );
}
