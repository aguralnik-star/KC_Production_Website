import { Award, Factory, ShieldCheck, Users } from 'lucide-react';

const TRUST_ITEMS = [
  { title: 'Founded in 1987', description: 'Family-owned precision manufacturing heritage.', icon: Award },
  { title: 'Precision Manufacturing', description: 'CNC machining, tooling, fixtures, and gauges.', icon: Factory },
  { title: 'Responsive Service', description: 'Prompt communication and practical project support.', icon: Users },
  { title: 'Quality Inspection', description: 'CMM, gauging, and inspection-focused discipline.', icon: ShieldCheck },
];

export default function HomeTrustStrip() {
  return (
    <section className="home-trust-strip border-b border-slate-200 bg-white" aria-label="Company trust highlights">
      <div className="section-container">
        <ul className="home-trust-strip__grid">
          {TRUST_ITEMS.map(({ title, description, icon: Icon }) => (
            <li key={title}>
              <article className="home-trust-strip__card">
                <div className="home-trust-strip__icon" aria-hidden="true">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="home-trust-strip__title">{title}</h3>
                <p className="home-trust-strip__description">{description}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
