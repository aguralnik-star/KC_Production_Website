import { Car, Plane, HeartPulse, Zap, Cog, Building2 } from 'lucide-react';

const industries = [
  { icon: Car, title: 'Automotive', description: 'Production components, fixtures, and tooling for automotive suppliers and tier manufacturers.' },
  { icon: Plane, title: 'Aerospace', description: 'Precision-machined parts and inspection fixtures with documented quality and traceability.' },
  { icon: HeartPulse, title: 'Medical', description: 'Custom components and fixtures for medical device manufacturing and assembly applications.' },
  { icon: Zap, title: 'Energy & Power', description: 'Machined parts for power generation, transmission, and industrial energy equipment.' },
  { icon: Cog, title: 'Industrial Equipment', description: 'Replacement parts, custom tooling, and production components for OEM and MRO applications.' },
  { icon: Building2, title: 'General Manufacturing', description: 'Supporting manufacturers across diverse sectors with reliable CNC machining and fixturing.' },
];

export default function Industries() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Industries Served</p>
          <h2 className="section-title">Trusted Across Critical Industries</h2>
          <p className="section-subtitle mx-auto">
            We partner with customers who require precision, consistency, and a manufacturing partner they can count on for the long term.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card text-center sm:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-charcoal text-accent-light sm:mx-0">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
