import { ArrowRight, Monitor, ScanLine, Ruler, Layers } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import EquipmentCategoryCard, { FeaturedEquipmentShowcase } from '../components/EquipmentCard';
import EquipmentGallery from '../components/EquipmentGallery';
import CTAButton from '../components/CTAButton';
import { EQUIPMENT_SECTIONS, FEATURED_EQUIPMENT } from '../data/company';

const icons = [Monitor, ScanLine, Ruler, Layers];

export default function Equipment() {
  return (
    <>
      <SEO {...PAGE_SEO.equipment} />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Equipment"
            title="Modern CNC & Inspection Technology"
            description="Invested in Haas CNC machining centers, precision inspection equipment, and Mastercam programming to deliver first-class quality."
            dark
          />
        </div>
      </section>

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
          </div>

          <div className="mt-10">
            <FeaturedEquipmentShowcase />
          </div>
        </div>
      </section>

      <EquipmentGallery className="bg-white" />

      <section className="section-padding bg-brand-light">
        <div className="section-container grid gap-6 sm:grid-cols-2">
          {EQUIPMENT_SECTIONS.map((section, i) => (
            <EquipmentCategoryCard key={section.title} icon={icons[i]} title={section.title} description={section.description} items={section.items} />
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <SectionHeading
            label="Inspection Highlight"
            title="Mitutoyo Crysta-Plus M574 CMM"
            description="Our coordinate measuring machine enables precise dimensional verification for complex parts and tight-tolerance work — supporting the first-class quality our customers expect."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          <p className="mx-auto mt-4 max-w-xl text-slate-400">Contact us for a prompt quotation on your next machining project.</p>
          <CTAButton to="/contact" className="mt-8">
            Request a Quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </section>
    </>
  );
}
