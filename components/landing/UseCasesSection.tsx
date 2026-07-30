import Image from "next/image";

const useCases = [
  {
    number: "01",
    title: "Strategy Sessions + Problem Exploration",
    description:
      "Surface the real problem, explore options, and define a clear path forward.",
    image: "/images/use-cases/strategy-sessions.webp",
    imageAlt:
      "Strategy notes, workflow sketches, and a midnight folio arranged on a planning table",
  },
  {
    number: "02",
    title: "Project Kickoffs",
    description: "Align on goals, scope, and success from day one.",
    image: "/images/use-cases/project-kickoffs.webp",
    imageAlt:
      "Project planning documents, timeline notes, and a laptop prepared for a kickoff",
  },
  {
    number: "03",
    title: "Pre-sales & Proposals",
    description:
      "Turn conversations and insights into compelling, tailored proposals.",
    image: "/images/use-cases/pre-sales-proposals.webp",
    imageAlt:
      "Layered proposal documents with a notebook and brass stationery",
  },
  {
    number: "04",
    title: "Cross-functional Alignment",
    description:
      "Bring teams together and move forward with shared clarity.",
    image: "/images/use-cases/cross-functional-alignment.webp",
    imageAlt:
      "A team reviewing shared planning documents around a table",
  },
  {
    number: "05",
    title: "Stakeholder Updates",
    description:
      "Communicate progress and decisions with confidence and consistency.",
    image: "/images/use-cases/stakeholder-updates.webp",
    imageAlt:
      "A prepared stakeholder update workspace with a laptop and report",
  },
  {
    number: "06",
    title: "Workflow Discovery",
    description:
      "Map current-state workflows and uncover opportunities to improve.",
    image: "/images/use-cases/workflow-discovery.webp",
    imageAlt:
      "Detailed workflow maps spread beside a laptop and discovery notes",
  },
];

export function UseCasesSection() {
  return (
    <section className="use-cases-section" aria-labelledby="use-cases-heading">
      <div className="landing-container">
        <header className="use-cases-section__header">
          <p className="use-cases-section__eyebrow">Use Cases</p>
          <span className="use-cases-section__header-rule" aria-hidden="true" />
          <h2 id="use-cases-heading">
            Where VantageBrief creates <em>clarity.</em>
          </h2>
          <p>
            VantageBrief helps teams turn complex conversations into aligned,
            actionable direction across the moments where clarity matters most.
          </p>
        </header>

        <ol className="use-cases-collage">
          {useCases.map((useCase) => (
            <li
              className={`use-case-panel use-case-panel--${useCase.number}`}
              key={useCase.number}
            >
              <Image
                alt={useCase.imageAlt}
                className="use-case-panel__image"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 896px) 50vw, 42vw"
                src={useCase.image}
              />
              <div className="use-case-panel__copy">
                <span>{useCase.number}</span>
                <span className="use-case-panel__rule" aria-hidden="true" />
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
