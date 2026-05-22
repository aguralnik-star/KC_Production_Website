import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import Hero from '../components/Hero';
import CapabilitiesSection from '../components/Capabilities';
import SectionHeading from '../components/SectionHeading';
import IndustryCard from '../components/IndustryCard';
import QualityFeature from '../components/QualityFeature';
import CTAButton from '../components/CTAButton';
import { CORE_MESSAGE, INDUSTRIES, QUALITY_PILLARS } from '../data/company';

export default function Home() {
  return (
    <>
      <SEO {...PAGE_SEO.home} schema="localBusiness" />
      <Hero />

      <section className="section-padding border-b border-slate-100 bg-brand-light">
        <div className="section-container">
          <SectionHeading
            label="Our Commitment"
            title="Dedicated to Quality and Responsive Service"
            description={CORE_MESSAGE}
            align="center"
          />
        </div>
      </section>

      <CapabilitiesSection />

      <section className="section-padding" aria-labelledby="industries-heading">
        <div className="section-container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              label="Industries"
              title="Serving Manufacturers Across the Midwest"
              description="For over 35 years, K&C has supported diverse industries with precision machining, fixtures, and tooling — building long-term relationships one project at a time."
            />
            <CTAButton to="/industries" variant="secondary" className="shrink-0">
              All Industries
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
          </div>
          <div id="industries-heading" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {INDUSTRIES.slice(0, 8).map(({ title, description }) => (
              <IndustryCard key={title} title={title} description={description} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal" aria-labelledby="quality-heading">
        <div className="section-container">
          <SectionHeading
            label="Quality"
            title="First-Class Quality You Can Count On"
            description="We strive to provide not only the finest machining, but also unsurpassed customer service. Most of our new business comes from trusted referrals."
            align="center"
            dark
          />
          <div id="quality-heading" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUALITY_PILLARS.slice(0, 6).map((pillar) => (
              <QualityFeature key={pillar.title} {...pillar} dark />
            ))}
          </div>
          <div className="mt-10 text-center">
            <CTAButton to="/quality" variant="white">Our Quality Standards</CTAButton>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="overflow-hidden rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, #0D4F8B 0%, #2E6DA4 100%)' }}>
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12 lg:p-14">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Ready to Start?</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Request a Prompt, Competitive Quote</h2>
                <p className="mt-4 text-lg leading-relaxed text-blue-100">
                  Call us at (630) 543-3386 or submit an RFQ — you&apos;ll speak with someone knowledgeable who can respond to your needs directly.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <CTAButton to="/contact" variant="white">Submit RFQ</CTAButton>
                  <CTAButton href="tel:+16305433386" variant="light">Call (630) 543-3386</CTAButton>
                </div>
              </div>
              <div className="relative hidden bg-charcoal/30 p-8 lg:block lg:p-14">
                <div className="flex h-full flex-col justify-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="font-semibold text-white">What we ensure</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    <li>• Total commitment to our customers</li>
                    <li>• Quick response and prompt quotations</li>
                    <li>• Competitive pricing</li>
                    <li>• First-class quality</li>
                    <li>• Industry experts with 60+ years combined experience</li>
                    <li>• Prompt and on-time delivery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
