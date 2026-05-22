import { Link } from 'react-router-dom';
import { Cpu, RotateCw, FlaskConical, Factory, Ruler, Wrench, ArrowRight } from 'lucide-react';

const capabilities = [
  { icon: Cpu, title: 'CNC Milling', description: '3-axis and multi-axis milling for complex geometries, tight tolerances, and production-ready components.' },
  { icon: RotateCw, title: 'CNC Turning', description: 'Precision lathe work for shafts, bushings, fittings, and turned production parts in a wide range of materials.' },
  { icon: FlaskConical, title: 'Prototype Machining', description: 'Rapid turnaround prototypes to validate designs before committing to full production tooling and runs.' },
  { icon: Factory, title: 'Production Machining', description: 'Short and medium production runs with consistent quality, documented processes, and on-time delivery.' },
  { icon: Ruler, title: 'Fixtures & Gauges', description: 'Custom inspection fixtures, go/no-go gauges, and holding fixtures built to your exact specifications.' },
  { icon: Wrench, title: 'Tooling & Components', description: 'Custom machined tooling, jigs, and specialty components engineered for your manufacturing workflow.' },
];

export default function Capabilities({ showAll = false, limit = 6 }) {
  const items = showAll ? capabilities : capabilities.slice(0, limit);

  return (
    <section className="section-padding bg-slate-50">
      <div className="section-container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">Capabilities</p>
            <h2 className="section-title">Full-Service Precision Machining</h2>
            <p className="section-subtitle">
              From single prototypes to recurring production, we machine components and tooling that meet your exact requirements.
            </p>
          </div>
          {!showAll && (
            <Link to="/capabilities" className="btn-secondary shrink-0">
              All Capabilities
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card group">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-metallic">Materials We Machine</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Aluminum', 'Stainless Steel', 'Carbon Steel', 'Tool Steel', 'Brass', 'Copper', 'Bronze', 'Plastics'].map((material) => (
              <span key={material} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-charcoal">{material}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
