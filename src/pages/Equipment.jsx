import { ArrowRight, Cpu, ScanLine, Ruler, Layers } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import EquipmentHero from '../components/EquipmentHero';
import EquipmentCategoryCard, { FeaturedEquipmentShowcase } from '../components/EquipmentCard';
import EquipmentGallery from '../components/EquipmentGallery';
import CTAButton from '../components/CTAButton';
import { EQUIPMENT_SECTIONS, FEATURED_EQUIPMENT, REPRESENTATIVE_EQUIPMENT_GALLERY } from '../data/company';

const categoryIcons = [Cpu, ScanLine, Ruler, Layers];

export default function Equipment() {
  return (
    <>
      <SEO {...PAGE_SEO.equipment} />

      <EquipmentHero />

      <section className="section-padding bg-brand-light" aria-labelledby="equipment-feature-panel-heading">
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
              {FEATURED_EQUIPMENT.disclaimer}
            </p>
            <h2 id="equipment-feature-panel-heading" className="mt-3 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              {FEATURED_EQUIPMENT.featurePanel.headline}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-metallic">
              {FEATURED_EQUIPMENT.featurePanel.body}
            </p>
            <p className="mt-3 text-sm text-metallic">{FEATURED_EQUIPMENT.representativeLabel}</p>
          </div>

          <div className="mt-10">
            <FeaturedEquipmentShowcase compact />
          </div>
        </div>
      </section>

      <EquipmentGallery id="representative-equipment-gallery" className="border-t border-slate-200 bg-white" />

      <section className="section-padding bg-brand-light" aria-labelledby="equipment-categories-heading">
        <div className="section-container">
          <SectionHeading
            label="Shop Capabilities"
            title="Equipment & Technology Categories"
            description="Beyond representative CNC machining examples, K&C supports precision manufacturing with inspection, gauging, and CAD/CAM programming resources."
          />
          <div id="equipment-categories-heading" className="mt-10 grid gap-6 sm:grid-cols-2">
            {EQUIPMENT_SECTIONS.map((section, i) => (
              <EquipmentCategoryCard
                key={section.title}
                icon={categoryIcons[i]}
                title={section.title}
                description={section.description}
                items={section.items}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" aria-labelledby="inspection-highlight-heading">
        <div className="section-container">
          <SectionHeading
            label="Inspection Highlight"
            title="Mitutoyo Crysta-Plus M574 CMM"
            description="Our coordinate measuring machine enables precise dimensional verification for complex parts and tight-tolerance work — supporting the first-class quality our customers expect."
          />
          <div id="inspection-highlight-heading" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['Optical comparator', 'Profilometer', 'Inspection microscope', 'Air gauging'].map((item) => (
              <div key={item} className="card text-center">
                <p className="font-semibold text-charcoal">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Put Our Equipment to Work for You</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Contact us for a prompt quotation on your next machining project.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
            {REPRESENTATIVE_EQUIPMENT_GALLERY.disclaimer}
          </p>
          <CTAButton to="/contact" className="mt-8">
            Request a Quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </section>
    </>
  );
}
