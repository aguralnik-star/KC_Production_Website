import { Check } from 'lucide-react';
import { EQUIPMENT_PAGE_HERO } from '../data/company';
import { EquipmentHeroImage } from './EquipmentCard';

export default function EquipmentHero() {
  const hero = EQUIPMENT_PAGE_HERO;

  return (
    <section className="equipment-page-hero" aria-labelledby="equipment-page-hero-heading">
      <div className="equipment-page-hero__background" aria-hidden="true">
        <div className="equipment-page-hero__grid" />
        <div className="equipment-page-hero__glow" />
      </div>

      <div className="section-container relative px-4 sm:px-6 lg:px-8">
        <div className="equipment-page-hero__layout">
          <div className="equipment-page-hero__content order-2 lg:order-1">
            <p className="equipment-page-hero__eyebrow">{hero.eyebrow}</p>
            <h1 id="equipment-page-hero-heading" className="equipment-page-hero__headline">
              {hero.headline}
            </h1>
            <p className="equipment-page-hero__description">{hero.description}</p>
            <ul className="equipment-page-hero__badges" aria-label="Equipment capabilities">
              {hero.featureBadges.map((badge) => (
                <li key={badge}>
                  <Check className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
                  <span>{badge}</span>
                </li>
              ))}
            </ul>
            <p className="equipment-page-hero__machine">{hero.machineName}</p>
          </div>

          <div className="equipment-page-hero__media order-1 lg:order-2">
            <EquipmentHeroImage
              src={hero.image}
              alt={hero.imageAlt}
              placeholderText={hero.placeholderText}
            />
            <aside className="equipment-page-hero__overlay" aria-label="Representative equipment disclaimer">
              <p className="equipment-page-hero__overlay-title">{hero.overlayTitle}</p>
              <p className="equipment-page-hero__overlay-text">{hero.overlayText}</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
