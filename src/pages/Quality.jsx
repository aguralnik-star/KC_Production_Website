import { ClipboardCheck, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import QualityFeature from '../components/QualityFeature';
import CTAButton from '../components/CTAButton';
import { QUALITY_PILLARS } from '../data/company';

const commitments = [
  'Total commitment to our customers',
  'Quick response to questions and concerns',
  'Competitive pricing and prompt quotations',
  'First-class quality on every project',
  'Industry experts with 60+ years combined experience',
  'Prompt and on-time delivery',
  'Parts inspected to your specified tolerances',
  'Clear communication throughout your project',
];

export default function Quality() {
  return (
    <>
      <SEO {...PAGE_SEO.quality} />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Quality"
            title="First-Class Quality & Unsurpassed Service"
            description="K&C is dedicated to quality precision machining. We strive to provide the finest machining and customer service — building long-term relationships through trust and performance."
            dark
          />
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {QUALITY_PILLARS.map((pillar) => (
            <QualityFeature key={pillar.title} {...pillar} />
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-accent" aria-hidden="true" />
              <h2 className="text-3xl font-bold tracking-tight text-charcoal">Our Quality Commitments</h2>
            </div>
            <p className="mt-4 text-lg text-metallic">
              When you work with K&amp;C, you get more than machined parts — you get a partner committed to your success.
            </p>
            <ul className="mt-8 space-y-3">
              {commitments.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4">
                  <ClipboardCheck className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-charcoal">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal">
        <div className="section-container text-center">
          <SectionHeading
            title="Experience the K&C Difference"
            description="Call (630) 543-3386 — you'll speak with someone who can respond to your question or concern directly."
            align="center"
            dark
          />
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton to="/contact" variant="white">Request a Quote</CTAButton>
            <CTAButton href="tel:+16305433386" variant="light">Call Now</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
