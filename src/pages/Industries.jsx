import {
  Truck, HeartPulse, Droplets, Car, Cog, Construction,
  Package, Gamepad2, Cpu, ScanSearch, Ruler, UtensilsCrossed, Shield,
} from 'lucide-react';
import PageHead from '../components/PageHead';
import SectionHeading from '../components/SectionHeading';
import IndustryCard from '../components/IndustryCard';
import CTAButton from '../components/CTAButton';
import { INDUSTRIES } from '../data/company';

const industryIcons = [
  Truck, HeartPulse, Droplets, Car, Cog, Construction,
  Package, Gamepad2, Cpu, ScanSearch, Ruler, UtensilsCrossed, Shield,
];

export default function Industries() {
  return (
    <>
      <PageHead
        title="Industries Served | K&C Design and Manufacturing"
        description="Precision machining for transportation, medical, hydraulics, automotive, industrial, gaming, electronics, military, and more."
      />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Industries"
            title="Trusted by Midwest Manufacturers"
            description="For over 35 years, K&C has served diverse industries with quality machining, fixtures, gauges, and tooling — building long-term relationships through performance and personal service."
            dark
          />
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {INDUSTRIES.map(({ title, description }, i) => (
            <IndustryCard key={title} icon={industryIcons[i]} title={title} description={description} />
          ))}
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container text-center">
          <SectionHeading
            title="Don't See Your Industry Listed?"
            description="We work with manufacturers across many sectors. Contact us to discuss your project — we'd be honored to share our expertise."
            align="center"
          />
          <CTAButton to="/contact" className="mt-8">Request a Quote</CTAButton>
        </div>
      </section>
    </>
  );
}
