import { ArrowRight, Cpu, Layers, RotateCw, Ruler, ScanLine } from 'lucide-react';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import EquipmentHero from '../components/EquipmentHero';
import EquipmentCard from '../components/EquipmentCard';
import CTAButton from '../components/CTAButton';
import { EQUIPMENT_SECTIONS } from '../data/company';

const categoryIcons = [Cpu, RotateCw, ScanLine, Ruler, Layers];

export default function Equipment() {
  return (
    <>
      <SEO {...PAGE_SEO.equipment} />

      <EquipmentHero />

      <section className="section-padding">
        <div className="section-container grid gap-6 sm:grid-cols-2">
          {EQUIPMENT_SECTIONS.map((section, i) => (
            <EquipmentCard
              key={section.title}
              icon={categoryIcons[i]}
              title={section.title}
              description={section.description}
              items={section.items}
            />
          ))}
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <SectionHeading
            label="Inspection Highlight"
            title="Mitutoyo Crysta-Plus M574 CMM"
            description="Our coordinate measuring machine enables precise dimensional verification for complex parts and tight-tolerance work — supporting the first-class quality our customers expect."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['Optical comparator', 'Profilometer', 'Inspection microscope', 'Video borescope systems'].map((item) => (
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
          <CTAButton to="/contact" className="mt-8" analyticsLabel="Request a Quote" analyticsLocation="equipment">
            Request a Quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </section>
    </>
  );
}
