const STATS = [
  { value: '1987', label: 'Founded' },
  { value: 'Midwest USA', label: 'Served' },
  { value: 'CNC Machining', label: 'Core Capability' },
  { value: 'Inspection Support', label: 'Quality Focus' },
];

export default function HomeStatsBand() {
  return (
    <section className="home-stats-band" aria-label="K&C company highlights">
      <div className="section-container">
        <ul className="home-stats-band__grid">
          {STATS.map(({ value, label }) => (
            <li key={label} className="home-stats-band__item">
              <p className="home-stats-band__value">{value}</p>
              <p className="home-stats-band__label">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
