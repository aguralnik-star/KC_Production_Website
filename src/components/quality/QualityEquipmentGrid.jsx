import { Activity, Gauge, Microscope, Ruler, ScanLine, Eye } from 'lucide-react';

const EQUIPMENT = [
  {
    title: 'Mitutoyo Crysta-Plus M574 CMM',
    description: 'Coordinate measuring capability for precision dimensional inspection.',
    icon: ScanLine,
  },
  {
    title: 'Optical Comparator',
    description: 'Visual inspection support for profiles, edges, forms, and part features.',
    icon: Eye,
  },
  {
    title: 'Profilometer',
    description: 'Surface finish and profile measurement support.',
    icon: Activity,
  },
  {
    title: 'Air Gauging Equipment',
    description: 'High-precision comparative measurement for applicable part features.',
    icon: Gauge,
  },
  {
    title: 'Inspection Microscope',
    description: 'Magnified inspection for small features and detailed part review.',
    icon: Microscope,
  },
  {
    title: 'Gauging Tools',
    description:
      'Thread gauges, plug gauges, ring gauges, pin gauges, micrometers, calipers, and bore gauges.',
    icon: Ruler,
  },
];

export default function QualityEquipmentGrid() {
  return (
    <section className="section-padding" aria-labelledby="quality-equipment-heading">
      <div className="section-container">
        <h2
          id="quality-equipment-heading"
          className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
        >
          Inspection &amp; Measurement Equipment
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPMENT.map(({ title, description, icon: Icon }) => (
            <article key={title} className="card h-full">
              <div className="capability-feature-card__icon" aria-hidden="true">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
