import { Check } from 'lucide-react';

export default function CapabilityFeatureCard({ icon: Icon, title, description, bullets = [] }) {
  return (
    <article className="capability-feature-card card h-full">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="capability-feature-card__icon" aria-hidden="true">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-charcoal">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
        </div>
      </div>
      {bullets.length > 0 && (
        <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
