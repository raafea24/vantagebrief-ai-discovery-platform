import {
  ArrowUpRight,
  FileText,
  Layers3,
  MessageCircleMore,
  Send,
} from "lucide-react";
import Link from "next/link";

const values = [
  {
    number: "01",
    title: "Guided conversations",
    description:
      "A focused exchange captures business context, objectives, and the real operational challenge.",
    Icon: MessageCircleMore,
  },
  {
    number: "02",
    title: "Structured insight",
    description:
      "Themes, workflows, requirements, and open questions are organized as the discussion develops.",
    Icon: Layers3,
  },
  {
    number: "03",
    title: "Decision-ready briefs",
    description:
      "Known facts, practical recommendations, and decisions still to make come together in one clear view.",
    Icon: FileText,
  },
  {
    number: "04",
    title: "Controlled delivery",
    description:
      "The brief remains available for review and is emailed only when you explicitly request it.",
    Icon: Send,
  },
];

export function ValueSection() {
  return (
    <section className="value-section" aria-labelledby="value-heading">
      <div className="landing-container">
        <header className="value-section__header">
          <p className="value-section__eyebrow">
            <span aria-hidden="true">✦</span>
            Core business value
          </p>
          <h2 id="value-heading">
            From conversation to clarity.
            <em>From clarity to confident decisions.</em>
          </h2>
          <p>
            VantageBrief turns an open business discussion into organized context,
            practical direction, and a brief your team can review with confidence.
          </p>
        </header>

        <ol className="value-section__items">
          {values.map(({ number, title, description, Icon }) => (
            <li key={number}>
              <span className="value-section__icon" aria-hidden="true">
                <Icon size={29} strokeWidth={1.5} />
              </span>
              <span className="value-section__number">{number}</span>
              <h3>{title}</h3>
              <span className="value-section__rule" aria-hidden="true" />
              <p>{description}</p>
            </li>
          ))}
        </ol>

        <div className="value-section__cta">
          <span className="value-section__cta-mark" aria-hidden="true">
            ✦
          </span>
          <div>
            <h3>Clarity today. Momentum tomorrow.</h3>
            <p>Start a guided discovery and shape a decision-ready brief.</p>
          </div>
          <Link href="/workspace">
            Start a Brief
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />
          </Link>
        </div>
      </div>
    </section>
  );
}
