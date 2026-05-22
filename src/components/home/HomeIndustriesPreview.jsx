import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';

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

export default function HomeIndustriesPreview() {
  return (
    <section className="section-padding" aria-labelledby="home-industries-heading">
      <div className="section-container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2 id="home-industries-heading" className="max-w-2xl text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Serving Demanding Manufacturing Markets
          </h2>
          <CTAButton to="/industries" variant="secondary" className="shrink-0">
            All Industries
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>

        <ul className="mt-10 flex flex-wrap gap-3">
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
