const TIMELINE = [
  {
    year: '1987',
    title: 'Company Founded',
    description:
      'K&C Design and Manufacturing is founded in Carol Stream, Illinois by Keith Clark.',
  },
  {
    year: 'Early Years',
    title: 'Gauging, Tooling & Fixtures',
    description:
      'The company focuses on inspection gauging, production tooling, and manufacturing fixtures.',
  },
  {
    year: '1992',
    title: 'Machining Capabilities Added',
    description: 'Machining capabilities are added to expand customer support.',
  },
  {
    year: '1997',
    title: 'Dedicated Facility',
    description: 'K&C moves into its first dedicated manufacturing facility.',
  },
  {
    year: '2011',
    title: 'Addison Facility',
    description: 'K&C expands into its current Addison, Illinois facility.',
  },
  {
    year: 'Today',
    title: 'Serving Midwest Manufacturers',
    description:
      'K&C continues serving Midwest manufacturers with precision machining, tooling, fixtures, gauges, inspection support, and custom manufactured components.',
  },
];

export default function AboutTimeline() {
  return (
    <section className="section-padding bg-brand-light" aria-labelledby="about-timeline-heading">
      <div className="section-container">
        <h2 id="about-timeline-heading" className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          A History of Growth and Precision
        </h2>

        <ol className="about-timeline mt-10">
          {TIMELINE.map(({ year, title, description }) => (
            <li key={year} className="about-timeline__item card">
              <p className="about-timeline__year">{year}</p>
              <h3 className="about-timeline__title">{title}</h3>
              <p className="about-timeline__description">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
