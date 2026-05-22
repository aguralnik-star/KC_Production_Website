import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Cog, Factory, Settings2, Wrench } from 'lucide-react';
import CTAButton from './CTAButton';
import { FEATURED_EQUIPMENT } from '../data/company';

const FEATURED_ICONS = [Factory, Cog, Wrench];

function EquipmentImagePlaceholder({ alt }) {
  return (
    <div className="equipment-image equipment-image--placeholder" role="img" aria-label={alt}>
      <div className="equipment-image__placeholder-glow" aria-hidden="true" />
      <div className="equipment-image__placeholder-lines" aria-hidden="true" />
      <Factory className="equipment-image__placeholder-icon" aria-hidden="true" />
      <p className="equipment-image__placeholder-text">Equipment Image Coming Soon</p>
    </div>
  );
}

export function EquipmentImage({
  src,
  alt,
  className = '',
  priority = false,
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`equipment-image-frame ${className}`.trim()}>
        <EquipmentImagePlaceholder alt={alt} />
      </div>
    );
  }

  return (
    <div className={`equipment-image-frame ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        className="equipment-image"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width={1600}
        height={900}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function EquipmentCard({
  title,
  category,
  description,
  image,
  specs = [],
  badges = [],
  features = [],
  imageAlt,
  representativeLabel,
  disclaimer,
  variant = 'featured',
  className = '',
  showFeatures = true,
  ctaTo,
  ctaLabel,
}) {
  const alt = imageAlt || title;

  if (variant === 'preview') {
    return (
      <article className={`equipment-preview-card ${className}`.trim()}>
        <EquipmentImage src={image} alt={alt} />
        <div className="equipment-preview-card__body">
          {representativeLabel ? (
            <p className="equipment-preview-card__label">{representativeLabel}</p>
          ) : null}
          <p className="equipment-preview-card__category">{category}</p>
          <h3 className="equipment-preview-card__title">{title}</h3>
          {description ? <p className="equipment-preview-card__subtitle">{description}</p> : null}
          {badges.length > 0 ? (
            <div className="equipment-preview-card__badges">
              {badges.slice(0, 3).map((badge) => (
                <span key={badge} className="equipment-preview-badge">
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
          {ctaTo && ctaLabel ? (
            <CTAButton to={ctaTo} variant="secondary" className="mt-6 w-full sm:w-auto">
              {ctaLabel}
            </CTAButton>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article
      className={`equipment-featured-card ${className}`.trim()}
      aria-labelledby={title ? `equipment-card-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
    >
      <div className="equipment-featured-card__glow" aria-hidden="true" />
      <div className="equipment-featured-card__lines" aria-hidden="true" />

      <div className="equipment-featured-card__layout">
        <EquipmentImage src={image} alt={alt} priority className="equipment-featured-card__media" />

        <div className="equipment-featured-card__content">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {disclaimer ? <p className="equipment-featured-card__disclaimer">{disclaimer}</p> : null}
              {representativeLabel ? (
                <p className="equipment-featured-card__label">{representativeLabel}</p>
              ) : null}
            </div>
            <div className="flex gap-2" aria-hidden="true">
              {FEATURED_ICONS.map((Icon, index) => (
                <span key={`featured-equipment-icon-${index}`} className="equipment-featured-card__icon">
                  <Icon className="h-5 w-5" />
                </span>
              ))}
            </div>
          </div>

          {category ? <p className="equipment-featured-card__category">{category}</p> : null}
          <h3
            id={title ? `equipment-card-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
            className="equipment-featured-card__title"
          >
            {title}
          </h3>
          {description ? <p className="equipment-featured-card__description">{description}</p> : null}

          {badges.length > 0 ? (
            <div className="equipment-featured-card__badges">
              {badges.map((badge) => (
                <span key={badge} className="equipment-spec-badge">
                  {badge}
                </span>
              ))}
            </div>
          ) : null}

          {specs.length > 0 ? (
            <ul className="equipment-featured-card__specs">
              {specs.map((spec) => (
                <li key={spec}>
                  <Settings2 className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {showFeatures && features.length > 0 ? (
            <ul className="equipment-featured-card__features">
              {features.map((feature) => (
                <li key={feature}>
                  <Check className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function EquipmentCategoryCard({ icon: Icon, title, description, items = [] }) {
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
  const equipment = FEATURED_EQUIPMENT;

  return (
    <EquipmentCard
      variant="preview"
      className={className}
      title={equipment.name}
      category={equipment.category}
      description={equipment.homepagePreview.summary}
      image={equipment.image}
      imageAlt={equipment.imageAlt}
      badges={equipment.badges}
      representativeLabel={equipment.representativeLabel}
      ctaTo="/equipment"
      ctaLabel="View Equipment"
    />
  );
}

export function FeaturedEquipmentShowcase({ className = '' }) {
  const equipment = FEATURED_EQUIPMENT;

  return (
    <EquipmentCard
      className={className}
      title={equipment.name}
      category={equipment.category}
      description={equipment.description}
      image={equipment.image}
      imageAlt={equipment.imageAlt}
      specs={equipment.specs}
      badges={equipment.badges}
      features={equipment.features}
      representativeLabel={equipment.representativeLabel}
      disclaimer={equipment.disclaimer}
    />
  );
}

export function EquipmentPreviewLink() {
  return (
    <Link to="/equipment" className="text-sm font-semibold text-brand-primary hover:text-brand-accent">
      View equipment and representative machining capabilities
    </Link>
  );
}
