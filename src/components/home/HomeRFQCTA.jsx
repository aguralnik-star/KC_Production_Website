import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';

export default function HomeRFQCTA() {
  return (
    <section className="section-padding bg-charcoal" aria-labelledby="home-rfq-cta-heading">
      <div className="section-container text-center">
        <h2 id="home-rfq-cta-heading" className="text-3xl font-bold text-white sm:text-4xl">
          Ready to discuss your next machining or tooling project?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">
          Send your drawings, specifications, and project requirements. K&amp;C will review your RFQ and follow up
          with next steps.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton to="/contact">
            Request a Quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
          <CTAButton to="/rfq/status" variant="light">
            Check RFQ Status
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
