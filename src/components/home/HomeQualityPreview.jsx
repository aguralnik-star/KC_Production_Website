import { ArrowRight, Check } from 'lucide-react';
import CTAButton from '../CTAButton';

const FEATURES = [
  'Drawing and requirement review',
  'Precision machining support',
  'CMM and inspection equipment',
  'Repeatable process discipline',
  'Long-term customer trust',
];

export default function HomeQualityPreview() {
  return (
    <section className="section-padding bg-slate-50" aria-labelledby="home-quality-heading">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <h2 id="home-quality-heading" className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Quality-Focused From Quote to Delivery
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-metallic">
              Quality begins with understanding customer requirements and continues through machining, inspection,
              documentation, and delivery.
            </p>
            <div className="mt-8">
              <CTAButton to="/quality" variant="secondary">
                Quality Commitment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
            </div>
          </div>

          <ul className="card space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-charcoal">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" aria-hidden="true" />
                <span className="text-sm font-medium sm:text-base">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
