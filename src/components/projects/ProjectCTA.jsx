import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';

export default function ProjectCTA() {
  return (
    <section className="section-padding bg-charcoal" aria-labelledby="project-cta-heading">
      <div className="section-container text-center">
        <h2 id="project-cta-heading" className="text-3xl font-bold text-white sm:text-4xl">
          Have a similar machining, fixture, gauge, or tooling project?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">
          Send your drawings, specifications, and project requirements. K&amp;C will review your RFQ and follow up
          with next steps.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton to="/contact" analyticsLabel="Request a Quote" analyticsLocation="projects_footer">
            Request a Quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
          <CTAButton to="/capabilities" variant="light" analyticsLabel="View Capabilities" analyticsLocation="projects_footer">
            View Capabilities
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
