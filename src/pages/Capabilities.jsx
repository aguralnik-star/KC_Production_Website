import { ArrowRight, Cpu, RotateCw, FlaskConical, Factory, Ruler, Wrench } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import CapabilityCard from '../components/CapabilityCard';
import CTAButton from '../components/CTAButton';
import { CAPABILITIES, MATERIALS } from '../data/company';

const icons = [Cpu, RotateCw, FlaskConical, Factory, Ruler, Wrench];

const detailedCapabilities = [
  {
    title: 'CNC Milling',
    summary: 'Haas CNC machining centers for complex milling applications from prototype to production.',
    points: ['3-axis Haas vertical machining centers', 'Complex geometries and tight tolerances', 'Aluminum, steels, brass, copper, bronze, and plastics', 'Prototype through production quantities'],
  },
  {
    title: 'CNC Turning',
    summary: 'Precision lathe work for turned components with consistent quality and repeatability.',
    points: ['CNC turning for shafts, bushings, and fittings', 'Production and prototype quantities', 'In-process inspection', 'Competitive pricing and prompt delivery'],
  },
  {
    title: 'Prototype Machining',
    summary: 'Fast, accurate prototypes to validate designs before production commitment.',
    points: ['Quick response and prompt quotations', 'Machining from customer drawings or models', 'Design feedback available', 'Smooth transition to production runs'],
  },
  {
    title: 'Production Machining',
    summary: 'Short and medium production runs with first-class quality and on-time delivery.',
    points: ['Recurring production schedules', 'Documented setups for repeatability', 'First-article inspection', 'Total commitment to customer requirements'],
  },
  {
    title: 'Fixtures & Gauges',
    summary: 'Custom inspection fixtures, manufacturing fixtures, and precision gauges.',
    points: ['Custom inspection fixtures', 'Go/no-go and specialty gauges', 'Assembly and manufacturing fixtures', 'Built to customer specifications'],
  },
  {
    title: 'Tooling & Custom Components',
    summary: 'Production tooling, manufacturing fixtures, and custom machined components.',
    points: ['Production tooling and workholding', 'Custom machined components', 'Replacement tooling', 'Industry expertise since 1987'],
  },
];

export default function Capabilities() {
  return (
    <>
      <SEO {...PAGE_SEO.capabilities} />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Capabilities"
            title="Full-Service Precision Machining & Manufacturing"
            description="CNC machining, precision machining, prototype and production work, inspection fixtures, gauges, production tooling, and custom components."
            dark
          />
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap, i) => (
              <CapabilityCard key={cap.title} icon={icons[i]} {...cap} />
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-metallic">Materials We Machine</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {MATERIALS.map((material) => (
                <span key={material} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-charcoal">{material}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container space-y-8">
          {detailedCapabilities.map(({ title, summary, points }) => (
            <article key={title} className="card overflow-hidden p-0">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-5 sm:px-8">
                <h2 className="text-xl font-bold text-charcoal">{title}</h2>
                <p className="mt-1 text-metallic">{summary}</p>
              </div>
              <ul className="grid gap-3 px-6 py-6 sm:grid-cols-2 sm:px-8">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container text-center">
          <SectionHeading title="Ready for a Prompt Quotation?" description="Share your project details and we'll respond quickly with competitive pricing." align="center" />
          <CTAButton to="/contact" className="mt-8">
            Request a Quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </section>
    </>
  );
}
