import { REPRESENTATIVE_EQUIPMENT_GALLERY } from '../data/company';
import { EquipmentCard } from './EquipmentCard';

export default function EquipmentGallery({ className = '', id }) {
  const { title, disclaimer, items } = REPRESENTATIVE_EQUIPMENT_GALLERY;
  const featuredItem = items.find((item) => item.featured);
  const galleryItems = items.filter((item) => !item.featured);

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

        {featuredItem ? (
          <div className="mt-10">
            <EquipmentCard
              variant="gallery"
              featured
              title={featuredItem.name}
              category={featuredItem.category}
              description={featuredItem.description}
              image={featuredItem.image}
              imageAlt={featuredItem.imageAlt}
              badges={featuredItem.badges}
              maxBadges={4}
              ctaTo="/contact"
              ctaLabel="Learn More"
            />
          </div>
        ) : null}

        <ul className={`equipment-gallery-grid ${featuredItem ? 'mt-8' : 'mt-10'}`}>
          {galleryItems.map((item) => (
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
