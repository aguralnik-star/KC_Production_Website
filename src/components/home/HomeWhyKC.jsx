import { Award, Clock, DollarSign, Handshake, ShieldCheck, Wrench } from 'lucide-react';

const WHY_KC = [
  {
    title: 'Practical Manufacturing Experience',
    description: 'Decades of machining, tooling, fixture, and gauge experience support real production needs.',
    icon: Wrench,
  },
  {
    title: 'Prompt Quotations',
    description: 'K&C responds quickly with practical guidance and competitive project feedback.',
    icon: Clock,
  },
  {
    title: 'Competitive Pricing',
    description: 'Strong manufacturing value without compromising quality or service.',
    icon: DollarSign,
  },
  {
    title: 'On-Time Delivery',
    description: 'Production planning and communication help keep projects moving forward.',
    icon: Award,
  },
  {
    title: 'First-Class Quality',
    description: 'Precision, inspection support, and repeatability are central to every project.',
    icon: ShieldCheck,
  },
  {
    title: 'Long-Term Relationships',
    description: 'K&C earns trust through consistent performance, service, and follow-through.',
    icon: Handshake,
  },
];

export default function HomeWhyKC() {
  return (
    <section className="section-padding bg-brand-light" aria-labelledby="home-why-kc-heading">
      <div className="section-container">
        <h2 id="home-why-kc-heading" className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          Why Customers Choose K&amp;C
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_KC.map(({ title, description, icon: Icon }) => (
            <article key={title} className="card h-full">
              <div className="capability-feature-card__icon" aria-hidden="true">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
