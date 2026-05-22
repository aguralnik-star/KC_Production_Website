import { CheckCircle2 } from 'lucide-react';
import SectionHeading from '../SectionHeading';

export default function ServiceCapabilities({ capabilities }) {
  return (
    <section className="section-padding bg-brand-light" aria-labelledby="service-capabilities-heading">
      <div className="section-container">
        <SectionHeading
          label="Capabilities"
          title="What K&C Supports"
          description="Practical machining and manufacturing support aligned with your drawings, specifications, and production goals."
          titleId="service-capabilities-heading"
          align="center"
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => (
            <li key={item} className="card flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" aria-hidden="true" />
              <span className="text-sm font-medium leading-relaxed text-charcoal">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
