const useCases = [
  {
    number: "01",
    title: "Strategy Sessions + Problem Exploration",
    description:
      "Surface the real problem, explore options, and define a clear path forward.",
  },
  {
    number: "02",
    title: "Project Kickoffs",
    description: "Align on goals, scope, and success from day one.",
  },
  {
    number: "03",
    title: "Pre-sales & Proposals",
    description:
      "Turn conversations and insights into compelling, tailored proposals.",
  },
  {
    number: "04",
    title: "Cross-functional Alignment",
    description:
      "Bring teams together and move forward with shared clarity.",
  },
  {
    number: "05",
    title: "Stakeholder Updates",
    description:
      "Communicate progress and decisions with confidence and consistency.",
  },
  {
    number: "06",
    title: "Workflow Discovery",
    description:
      "Map current-state workflows and uncover opportunities to improve.",
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
