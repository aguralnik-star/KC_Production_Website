import { ArrowRight, Cpu, Layers, RotateCw, ScanLine } from 'lucide-react';
import CTAButton from '../CTAButton';

const EQUIPMENT_CARDS = [
  {
    title: 'CNC Milling Centers',
    description: 'Haas vertical machining centers with 4-axis rotary table capability.',
    icon: Cpu,
  },
  {
    title: 'CNC Turning',
    description: 'Haas ST-10 CNC lathe for precision turned components.',
    icon: RotateCw,
  },
  {
    title: 'Inspection Equipment',
    description: 'Mitutoyo CMM, optical comparator, profilometer, and precision gauging.',
    icon: ScanLine,
  },
  {
    title: 'CAD/CAM Programming',
    description: 'Mastercam programming environment for efficient CNC toolpaths.',
    icon: Layers,
  },
];

export default function HomeEquipmentPreview() {
  return (
    <section className="section-padding" aria-labelledby="home-equipment-heading">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="home-equipment-heading" className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Equipment and Inspection Support for Precision Work
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-metallic">
            K&amp;C uses CNC machining equipment, inspection systems, gauging tools, and CAD/CAM programming to
            support accuracy, repeatability, and production confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EQUIPMENT_CARDS.map(({ title, description, icon: Icon }) => (
            <article key={title} className="card h-full text-center sm:text-left">
              <div className="capability-feature-card__icon mx-auto sm:mx-0" aria-hidden="true">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <CTAButton to="/equipment" variant="secondary">
            View Equipment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
