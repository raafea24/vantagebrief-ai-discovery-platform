export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section aria-labelledby="foundation-title">
        <p className="mb-3 text-sm font-semibold tracking-[0.14em] text-brass uppercase">
          VantageBrief
        </p>
        <h1
          id="foundation-title"
          className="font-serif text-5xl leading-tight text-ink sm:text-6xl"
        >
          Project foundation
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted">
          The VantageBrief application foundation is ready. The product experience
          will be created in its approved implementation phases.
        </p>
      </section>
    </main>
  );
}
