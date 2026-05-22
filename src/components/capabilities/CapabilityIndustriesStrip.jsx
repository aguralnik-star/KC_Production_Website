const INDUSTRIES = [
  'Transportation',
  'Medical',
  'Automotive',
  'Hydraulics',
  'Valves',
  'Heavy Equipment',
  'Material Handling',
  'Electronics',
  'Food Service',
  'Military',
];

export default function CapabilityIndustriesStrip() {
  return (
    <section className="section-padding" aria-labelledby="capability-industries-heading">
      <div className="section-container">
        <h2
          id="capability-industries-heading"
          className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
        >
          Serving Demanding Manufacturing Markets
        </h2>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {INDUSTRIES.map((industry) => (
            <li key={industry}>
              <span className="capability-industry-tag">{industry}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
