import { ArrowRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import { HeroCinematicVideo } from "@/components/landing/HeroCinematicVideo";

const capabilities = [
  "Guided business discovery",
  "Structured opportunity briefs",
  "Email only when requested",
];

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="landing-container hero__grid">
        <div className="hero__content">
          <p className="hero__eyebrow">
            <span aria-hidden="true">✦</span>
            AI client discovery
          </p>

          <h1 id="hero-heading">
            <span>Turn business</span>
            <span>conversations into</span>
            <em>decision-ready briefs.</em>
          </h1>

          <p className="hero__summary" id="about">
            VantageBrief guides a focused conversation, clarifies the real
            operational challenge, and organizes what matters into a practical
            opportunity brief.
          </p>

          <div className="hero__actions">
            <Link className="hero__primary-action" href="/workspace">
              Start a Brief
              <ArrowRight aria-hidden="true" size={19} strokeWidth={1.8} />
            </Link>
            <Link className="hero__secondary-action" href="#how-it-works">
              <CirclePlay aria-hidden="true" size={20} strokeWidth={1.6} />
              See How It Works
            </Link>
          </div>

        </div>

        <HeroCinematicVideo />

        <ul className="hero__capabilities" id="capabilities" aria-label="Capabilities">
          {capabilities.map((capability) => (
            <li key={capability}>
              <span aria-hidden="true" />
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
