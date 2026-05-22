import { Factory } from 'lucide-react';
import SectionHeading from '../SectionHeading';

export default function ServiceApplications({ applications }) {
  return (
    <section className="section-padding" aria-labelledby="service-applications-heading">
      <div className="section-container">
        <SectionHeading
          label="Applications"
          title="Common Applications"
          description="Representative project types K&C supports across machining, tooling, fixture, and production workflows."
          titleId="service-applications-heading"
          align="center"
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((item) => (
            <li key={item} className="card flex items-start gap-3">
              <div className="capability-feature-card__icon !mt-0" aria-hidden="true">
                <Factory className="h-5 w-5" />
              </div>
              <span className="pt-1 text-sm font-medium leading-relaxed text-charcoal">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
