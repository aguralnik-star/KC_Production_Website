import { ClipboardList, Cog, FileSearch, PackageCheck, ScanSearch } from 'lucide-react';

const STEPS = [
  {
    number: 1,
    title: 'Review Requirements',
    description:
      'We review drawings, tolerances, materials, quantities, and project requirements before production begins.',
    icon: FileSearch,
  },
  {
    number: 2,
    title: 'Plan Manufacturing Approach',
    description:
      'Machining, tooling, fixture, and inspection needs are considered before work moves forward.',
    icon: ClipboardList,
  },
  {
    number: 3,
    title: 'Machine With Repeatability',
    description: 'CNC processes support consistent results across prototype, short-run, and production work.',
    icon: Cog,
  },
  {
    number: 4,
    title: 'Inspect Critical Features',
    description:
      'Parts, fixtures, gauges, and tooling are verified using appropriate inspection and measuring equipment.',
    icon: ScanSearch,
  },
  {
    number: 5,
    title: 'Deliver With Confidence',
    description: 'The goal is dependable quality, prompt communication, and reliable delivery.',
    icon: PackageCheck,
  },
];

export default function QualityInspectionProcess() {
  return (
    <section className="section-padding bg-brand-light" aria-labelledby="quality-process-heading">
      <div className="section-container">
        <h2 id="quality-process-heading" className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          Inspection Process
        </h2>

        <ol className="quality-process-timeline mt-10">
          {STEPS.map(({ number, title, description, icon: Icon }, index) => (
            <li key={title} className="quality-process-timeline__step card">
              <div className="quality-process-timeline__icon-wrap" aria-hidden="true">
                <Icon className="h-5 w-5" />
              </div>
              <p className="quality-process-timeline__number">Step {number}</p>
              <h3 className="quality-process-timeline__title">{title}</h3>
              <p className="quality-process-timeline__description">{description}</p>
              {index < STEPS.length - 1 ? (
                <span className="quality-process-timeline__connector hidden lg:block" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
