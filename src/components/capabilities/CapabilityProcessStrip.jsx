import { ClipboardList, Cog, FileSearch, PackageCheck, Send } from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Submit Drawings', icon: Send },
  { number: 2, title: 'Review Requirements', icon: FileSearch },
  { number: 3, title: 'Quote & Schedule', icon: ClipboardList },
  { number: 4, title: 'Machine & Inspect', icon: Cog },
  { number: 5, title: 'Deliver with Confidence', icon: PackageCheck },
];

export default function CapabilityProcessStrip() {
  return (
    <section className="section-padding bg-brand-light" aria-labelledby="capability-process-heading">
      <div className="section-container">
        <h2 id="capability-process-heading" className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          From RFQ to Finished Parts
        </h2>

        <ol className="capability-process-strip mt-10">
          {STEPS.map(({ number, title, icon: Icon }, index) => (
            <li key={title} className="capability-process-strip__step card">
              <div className="capability-process-strip__icon-wrap" aria-hidden="true">
                <Icon className="h-5 w-5" />
              </div>
              <p className="capability-process-strip__number">Step {number}</p>
              <p className="capability-process-strip__title">{title}</p>
              {index < STEPS.length - 1 ? (
                <span className="capability-process-strip__connector hidden lg:block" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
