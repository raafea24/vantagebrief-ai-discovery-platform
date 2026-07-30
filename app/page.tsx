import { HeroSection } from "@/components/landing/HeroSection";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <LandingHeader />
      <HeroSection />
    </main>
  );
}
