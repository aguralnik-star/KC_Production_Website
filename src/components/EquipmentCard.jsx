import { Check, Cog, Factory, Wrench } from 'lucide-react';
import { FEATURED_EQUIPMENT } from '../data/company';

const FEATURED_ICONS = [Factory, Cog, Wrench];

export default function EquipmentCard({ icon: Icon, title, description, items = [] }) {
  return (
    <article className="card h-full">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-charcoal text-accent-light">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
          {description && <p className="mt-1 text-sm leading-relaxed text-metallic">{description}</p>}
        </div>
      </div>
      {items.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-charcoal">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function EquipmentPreviewCard({ className = '' }) {
  const { homepagePreview, representativeLabel } = FEATURED_EQUIPMENT;

  return (
    <article className={`equipment-preview-card ${className}`.trim()}>
      <p className="equipment-preview-card__label">{representativeLabel}</p>
      <h3 className="equipment-preview-card__title">{homepagePreview.title}</h3>
      <p className="equipment-preview-card__subtitle">{homepagePreview.subtitle}</p>
      <ul className="equipment-preview-card__list">
        {homepagePreview.bullets.map((item) => (
          <li key={item}>
            <Check className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function FeaturedEquipmentShowcase({ className = '' }) {
  const equipment = FEATURED_EQUIPMENT;

  return (
    <article className={`equipment-featured-card ${className}`.trim()} aria-labelledby="featured-equipment-title">
      <div className="equipment-featured-card__glow" aria-hidden="true" />
      <div className="equipment-featured-card__lines" aria-hidden="true" />

      <div className="equipment-featured-card__content">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="equipment-featured-card__disclaimer">{equipment.disclaimer}</p>
            <p className="equipment-featured-card__label">{equipment.representativeLabel}</p>
          </div>
          <div className="flex gap-2" aria-hidden="true">
            {FEATURED_ICONS.map((Icon, index) => (
              <span key={`featured-equipment-icon-${index}`} className="equipment-featured-card__icon">
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>
        </div>

        <p className="equipment-featured-card__category">{equipment.category}</p>
        <h3 id="featured-equipment-title" className="equipment-featured-card__title">
          {equipment.name}
        </h3>
        <p className="equipment-featured-card__description">{equipment.description}</p>

        <div className="equipment-featured-card__badges">
          {equipment.specifications.map((spec) => (
            <span key={spec} className="equipment-spec-badge">
              {spec}
            </span>
          ))}
        </div>

        <ul className="equipment-featured-card__features">
          {equipment.features.map((feature) => (
            <li key={feature}>
              <Check className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
