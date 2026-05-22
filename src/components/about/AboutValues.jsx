import { Award, Clock, DollarSign, Handshake, ShieldCheck, Wrench } from 'lucide-react';

const VALUES = [
  {
    title: 'Quality First',
    description: 'Precision, repeatability, and inspection support are central to every project.',
    icon: ShieldCheck,
  },
  {
    title: 'Responsive Service',
    description: 'Customers receive prompt communication, practical guidance, and dependable follow-up.',
    icon: Clock,
  },
  {
    title: 'Competitive Pricing',
    description: 'K&C works to provide strong manufacturing value without compromising quality.',
    icon: DollarSign,
  },
  {
    title: 'On-Time Delivery',
    description: 'Production planning and communication help keep customer projects moving.',
    icon: Award,
  },
  {
    title: 'Practical Manufacturing Expertise',
    description: 'Decades of experience support machining, tooling, fixture, and gauge requirements.',
    icon: Wrench,
  },
  {
    title: 'Long-Term Relationships',
    description: 'K&C focuses on earning customer trust through consistent performance and service.',
    icon: Handshake,
  },
];

export default function AboutValues() {
  return (
    <section className="section-padding" aria-labelledby="about-values-heading">
      <div className="section-container">
        <h2 id="about-values-heading" className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          What Customers Can Expect From K&amp;C
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ title, description, icon: Icon }) => (
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
