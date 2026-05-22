import { REPRESENTATIVE_EQUIPMENT_GALLERY } from '../data/company';
import { EquipmentCard } from './EquipmentCard';

export default function EquipmentGallery({ className = '', id }) {
  const { title, disclaimer, items } = REPRESENTATIVE_EQUIPMENT_GALLERY;

  return (
    <section
      id={id}
      className={`section-padding ${className}`.trim()}
      aria-labelledby="representative-equipment-gallery-heading"
    >
      <div className="section-container">
        <div className="max-w-4xl">
          <h2
            id="representative-equipment-gallery-heading"
            className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-metallic sm:text-lg">{disclaimer}</p>
        </div>

        <ul className="equipment-gallery-grid mt-10">
          {items.map((item) => (
            <li key={item.id} className="equipment-gallery-grid__item">
              <EquipmentCard
                variant="gallery"
                title={item.name}
                category={item.category}
                description={item.description}
                image={item.image}
                imageAlt={item.imageAlt}
                badges={item.badges}
                maxBadges={3}
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
