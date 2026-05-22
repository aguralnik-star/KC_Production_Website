import { Award, Clock, DollarSign, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const COMMITMENTS = [
  { title: 'First-Class Quality', icon: ShieldCheck },
  { title: 'Prompt Quotations', icon: Clock },
  { title: 'Competitive Pricing', icon: DollarSign },
  { title: 'On-Time Delivery', icon: Award },
  { title: 'Long-Term Customer Relationships', icon: Users },
  { title: 'Continuous Improvement', icon: TrendingUp },
];

export default function QualityCommitmentCards() {
  return (
    <section className="section-padding bg-slate-50" aria-labelledby="quality-commitments-heading">
      <div className="section-container">
        <h2
          id="quality-commitments-heading"
          className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
        >
          Our Quality Commitments
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITMENTS.map(({ title, icon: Icon }) => (
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
  );
}
