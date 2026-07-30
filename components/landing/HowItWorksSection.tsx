import {
  FileCheck2,
  Layers3,
  MessageCircleMore,
  Send,
} from "lucide-react";

const stages = [
  {
    number: "01",
    title: "Start the conversation",
    description:
      "Share the business context, objective, and current difficulty in a guided conversation.",
    Icon: MessageCircleMore,
  },
  {
    number: "02",
    title: "We structure the insights",
    description:
      "Challenges, workflows, requirements, and open decisions are organized as the discussion develops.",
    Icon: Layers3,
  },
  {
    number: "03",
    title: "You review and refine",
    description:
      "Review what has been captured, clarify assumptions, and add the details that still matter.",
    Icon: FileCheck2,
  },
  {
    number: "04",
    title: "Get your brief",
    description:
      "Receive a decision-ready Opportunity Brief to review and email when you explicitly request it.",
    Icon: Send,
  },
];

export function HowItWorksSection() {
  return (
    <section className="process-section" aria-labelledby="process-heading">
      <div className="landing-container">
        <header className="process-section__header">
          <p className="process-section__eyebrow">
            <span aria-hidden="true">✦</span>
            How It Works
          </p>
          <h2 id="process-heading">
            A guided process.
            <em>Clarity at every step.</em>
          </h2>
          <p>
            VantageBrief turns a focused business conversation into structured
            context, clear requirements, and a practical Opportunity Brief.
          </p>
        </header>

        <ol className="process-section__stages">
          {stages.map(({ number, title, description, Icon }, index) => (
            <li key={number}>
              <span className="process-section__icon" aria-hidden="true">
                <Icon size={30} strokeWidth={1.5} />
              </span>
              <span className="process-section__number">{number}</span>
              <h3>{title}</h3>
              <span className="process-section__rule" aria-hidden="true" />
              <p>{description}</p>
              {index < stages.length - 1 ? (
                <span className="process-section__arrow" aria-hidden="true">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
