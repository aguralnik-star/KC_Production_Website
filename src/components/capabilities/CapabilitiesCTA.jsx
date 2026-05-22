import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';

export default function CapabilitiesCTA() {
  return (
    <section className="section-padding bg-charcoal" aria-labelledby="capabilities-cta-heading">
      <div className="section-container text-center">
        <h2 id="capabilities-cta-heading" className="text-3xl font-bold text-white sm:text-4xl">
          Have a machining, tooling, or fixture project?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">
          Send your drawings, specifications, and project requirements. K&C will review your RFQ and follow up with
          next steps.
        </p>
        <CTAButton to="/contact" className="mt-8" analyticsLabel="Request a Quote" analyticsLocation="capabilities">
          Request a Quote
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </CTAButton>
      </div>
    </section>
  );
}
