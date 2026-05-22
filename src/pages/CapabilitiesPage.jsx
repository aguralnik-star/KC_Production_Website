import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const detailedCapabilities = [
  {
    title: 'CNC Milling',
    summary: 'Vertical machining centers for complex 3-axis and production milling applications.',
    details: ['3-axis milling on Haas VF-series machining centers', 'Complex geometries, pockets, contours, and threaded features', 'Prototype through medium-volume production quantities', 'Tight tolerance work with in-process inspection', 'Materials: aluminum, steels, brass, copper, bronze, and plastics'],
  },
  {
    title: 'CNC Turning',
    summary: 'Precision lathe operations for shafts, bushings, fittings, and turned production components.',
    details: ['CNC lathe turning on Haas ST and SL series machines', 'OD/ID turning, threading, grooving, and facing operations', 'Consistent repeatability for production runs', 'Quick turnaround for prototype turned parts', 'Full material traceability upon request'],
  },
  {
    title: 'Prototype Machining',
    summary: 'Fast, accurate prototypes to validate designs before committing to production.',
    details: ['Rapid quoting and scheduling for prototype projects', 'Machining from customer-supplied CAD models or drawings', 'Design feedback and manufacturability input available', 'Smooth transition from prototype to production runs', 'Single-piece and low-volume prototype quantities'],
  },
  {
    title: 'Production Machining',
    summary: 'Short and medium production runs with documented processes and consistent quality.',
    details: ['Recurring production schedules for ongoing customer demand', 'Documented setups for repeatability across runs', 'First-article inspection and in-process quality checks', 'On-time delivery commitments with clear communication', 'Kanban and blanket order arrangements available'],
  },
  {
    title: 'Fixtures & Gauges',
    summary: 'Custom inspection fixtures, holding fixtures, and precision gauges built to your specifications.',
    details: ['Go/no-go gauges and custom inspection fixtures', 'Assembly and welding fixtures for production lines', 'CMM-compatible fixturing for dimensional verification', 'Replacement and revision of existing fixture designs', 'Built to customer drawings with full inspection reports'],
  },
  {
    title: 'Tooling & Custom Components',
    summary: 'Specialty tooling, jigs, and custom machined components for your manufacturing process.',
    details: ['Custom jigs, nests, and workholding solutions', 'Replacement tooling for existing production equipment', 'Specialty machined components for OEM applications', 'Engineering collaboration on tooling design', 'Short lead times for urgent tooling requirements'],
  },
];

export default function CapabilitiesPage() {
  return (
    <>
      <section className="bg-charcoal py-16 sm:py-20">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <p className="section-label text-accent-light">Capabilities</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Precision Machining for Every Stage of Your Project</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            From first prototype to full production, K&amp;C delivers CNC milling, turning, fixtures, gauges, and custom tooling with the precision and accountability your project demands.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container space-y-8">
          {detailedCapabilities.map(({ title, summary, details }) => (
            <div key={title} className="card overflow-hidden p-0">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-5 sm:px-8">
                <h2 className="text-xl font-bold text-charcoal">{title}</h2>
                <p className="mt-1 text-metallic">{summary}</p>
              </div>
              <ul className="grid gap-3 px-6 py-6 sm:grid-cols-2 sm:px-8">
                {details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container text-center">
          <h2 className="section-title">Have a Project in Mind?</h2>
          <p className="section-subtitle mx-auto">Send us your drawings, models, or specifications and we&apos;ll provide a detailed quote.</p>
          <Link to="/contact" className="btn-primary mt-8">Request a Quote<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
