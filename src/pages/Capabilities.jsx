import { Award, Clock, Cpu, DollarSign, Factory, FlaskConical, RotateCw, Ruler, ShieldCheck, Wrench } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import InternalLinkGrid from '../components/seo/InternalLinkGrid';
import CapabilitiesHero from '../components/capabilities/CapabilitiesHero';
import CapabilityFeatureCard from '../components/capabilities/CapabilityFeatureCard';
import CapabilityProcessStrip from '../components/capabilities/CapabilityProcessStrip';
import IndustriesServedModern from '../components/trust/IndustriesServedModern';
import CapabilitiesCTA from '../components/capabilities/CapabilitiesCTA';
import { CAPABILITY_SERVICE_LINKS } from '../data/internalLinksData';

const CAPABILITY_CARDS = [
  {
    title: 'CNC Milling',
    icon: Cpu,
    description:
      'Precision vertical CNC milling for prototypes, tooling, fixtures, and production components.',
    bullets: [
      'Haas CNC milling centers',
      '4-axis rotary table capability',
      'Aluminum, steel, stainless, brass, bronze, and plastics',
      'Prototype and production runs',
      'Fixture and tooling components',
    ],
  },
  {
    title: 'CNC Turning',
    icon: RotateCw,
    description:
      'Precision CNC turning for cylindrical parts, bushings, shafts, fittings, and custom machined components.',
    bullets: [
      'Haas ST-10 CNC lathe capability',
      'Tight tolerance turning',
      'Production part repeatability',
      'Short-run and production quantities',
      'Multi-material machining',
    ],
  },
  {
    title: 'Prototype Machining',
    icon: FlaskConical,
    description:
      'Fast, accurate prototype machining to help customers validate design, fit, and function before production.',
    bullets: [
      'Engineering collaboration',
      'Rapid design feedback',
      'Low-volume machining',
      'Material and tolerance review',
      'Transition path to production',
    ],
  },
  {
    title: 'Production Machining',
    icon: Factory,
    description:
      'Repeatable machining processes for small-to-medium production runs with quality inspection support.',
    bullets: [
      'Repeatable setup processes',
      'Consistent part quality',
      'Production documentation',
      'Batch manufacturing support',
      'On-time delivery focus',
    ],
  },
  {
    title: 'Inspection Fixtures & Gauges',
    icon: Ruler,
    description:
      'Custom inspection fixtures and gauges built to support repeatable quality control and production validation.',
    bullets: [
      'Inspection gauging',
      'Functional checking fixtures',
      'Production quality support',
      'Repeatable measurement setups',
      'Customer-specific fixture design',
    ],
  },
  {
    title: 'Tooling & Custom Components',
    icon: Wrench,
    description:
      'Tooling, fixtures, and custom machined components designed and manufactured for industrial production needs.',
    bullets: [
      'Production tooling',
      'Manufacturing fixtures',
      'Assembly support components',
      'Custom machined details',
      'Repair and replacement parts',
    ],
  },
];

const QUALITY_FEATURES = [
  { title: 'First-Class Quality', icon: ShieldCheck },
  { title: 'Prompt Quotations', icon: Clock },
  { title: 'Competitive Pricing', icon: DollarSign },
  { title: 'On-Time Delivery', icon: Award },
];

export default function Capabilities() {
  return (
    <>
      <SEO {...PAGE_SEO.capabilities} />

      <div className="section-container px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Capabilities' }]} />
      </div>

      <CapabilitiesHero />

      <section className="section-padding" aria-labelledby="capability-cards-heading">
        <div className="section-container">
          <SectionHeading
            label="What We Do"
            title="Precision Manufacturing Capabilities"
            titleId="capability-cards-heading"
            description="From CNC milling and turning to fixtures, gauges, and production tooling — K&C supports demanding machining requirements with responsive service."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {CAPABILITY_CARDS.map((capability) => (
              <CapabilityFeatureCard key={capability.title} {...capability} />
            ))}
          </div>
        </div>
      </section>

      <CapabilityProcessStrip />

      <InternalLinkGrid
        title="Explore Specific Services"
        description="Review dedicated service pages for CNC machining, milling, turning, prototype work, production runs, tooling, fixtures, and gauges."
        links={CAPABILITY_SERVICE_LINKS}
        columns={4}
        headingId="capability-services-heading"
        className="bg-brand-light !pt-0"
      />

      <IndustriesServedModern
        limit={6}
        showDescriptions={false}
        showCTA
        ctaLabel="View All Industries"
        ctaTo="/industries"
        title="Industries We Support"
        description="From transportation and medical to hydraulics, valves, heavy equipment, and custom inspection applications."
        className="bg-slate-50"
      />

      <section className="section-padding bg-white" aria-labelledby="capability-quality-heading">
        <div className="section-container">
          <SectionHeading
            label="Our Commitment"
            title="Built Around Quality and Responsiveness"
            titleId="capability-quality-heading"
            description="From quote response to inspection, K&C focuses on first-class quality, competitive pricing, prompt communication, and long-term customer relationships."
            align="center"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_FEATURES.map(({ title, icon: Icon }) => (
              <article key={title} className="card text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-charcoal text-accent-light">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-charcoal">{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CapabilitiesCTA />
    </>
  );
}
