const outcomes = [
  { number: "01", title: "Shared understanding", description: "The business context and core challenge are captured clearly." },
  { number: "02", title: "Open questions surfaced", description: "Missing information and unresolved decisions remain visible." },
  { number: "03", title: "Next step defined", description: "The conversation ends with a practical direction for moving forward." },
];

export function OutcomeSection() {
  return (
    <section className="outcome-section" aria-labelledby="outcome-heading">
      <div className="landing-container outcome-section__layout">
        <div className="outcome-section__introduction">
          <p>THE OUTCOME</p>
          <h2 id="outcome-heading">One conversation.<br />A brief your team can act on.</h2>
          <p>VantageBrief brings scattered business context, workflow details and open decisions into one structured view—so everyone understands what matters and what should happen next.</p>
        </div>
        <ol className="outcome-section__list">
          {outcomes.map((outcome) => (
            <li key={outcome.number}><span>{outcome.number}</span><div><h3>{outcome.title}</h3><p>{outcome.description}</p></div></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
