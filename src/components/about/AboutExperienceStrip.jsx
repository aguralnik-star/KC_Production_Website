const SERVICES = [
  'CNC Machining',
  'CNC Milling',
  'CNC Turning',
  'Prototype Machining',
  'Production Machining',
  'Tooling',
  'Fixtures',
  'Gauges',
  'Inspection Support',
  'Custom Components',
];

export default function AboutExperienceStrip() {
  return (
    <section className="section-padding bg-slate-50" aria-labelledby="about-experience-heading">
      <div className="section-container">
        <h2
          id="about-experience-heading"
          className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
        >
          Precision Manufacturing for Demanding Applications
        </h2>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {SERVICES.map((service) => (
            <li key={service}>
              <span className="capability-industry-tag">{service}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
