import { REPRESENTATIVE_EQUIPMENT_GALLERY } from '../data/company';
import { EquipmentCard } from './EquipmentCard';

export default function EquipmentGallery({ className = '' }) {
  const { title, disclaimer, items } = REPRESENTATIVE_EQUIPMENT_GALLERY;

  return (
    <section
      className={`section-padding ${className}`.trim()}
      aria-labelledby="representative-equipment-gallery-heading"
    >
      <div className="section-container">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Representative Equipment
          </p>
          <h2
            id="representative-equipment-gallery-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-metallic sm:text-lg">{disclaimer}</p>
        </div>

        <ul className="equipment-gallery-grid mt-10">
          {items.map((item) => (
            <li key={item.id}>
              <EquipmentCard
                variant="gallery"
                title={item.name}
                category={item.category}
                description={item.description}
                image={item.image}
                imageAlt={item.imageAlt}
                badges={item.badges}
                ctaTo="/contact"
                ctaLabel="Learn More"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
