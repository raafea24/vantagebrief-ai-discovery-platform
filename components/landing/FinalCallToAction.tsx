import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FinalCallToAction() {
  return (
    <section className="final-cta-section" aria-labelledby="final-cta-heading">
      <div className="landing-container">
        <div className="final-cta-panel">
          <div className="final-cta-panel__copy">
            <p>Ready to move forward?</p>
            <h2 id="final-cta-heading">
              Turn the conversation into your next move.
            </h2>
            <p>
              Start a guided business conversation and leave with a structured
              Opportunity Brief built around the context, priorities and decisions
              that matter.
            </p>
            <Link href="/workspace">
              Start a Brief
              <ArrowRight aria-hidden="true" size={19} strokeWidth={1.7} />
            </Link>
          </div>

          <div className="final-cta-panel__image">
            <Image
              alt="Two business professionals reviewing a report beside a laptop"
              fill
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 896px) 46vw, 44vw"
              src="/images/use-cases/cta-collaborate.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
