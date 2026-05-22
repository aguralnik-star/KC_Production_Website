import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import QualityHero from '../components/quality/QualityHero';
import QualityInspectionProcess from '../components/quality/QualityInspectionProcess';
import QualityEquipmentGrid from '../components/quality/QualityEquipmentGrid';
import QualityCommitmentCards from '../components/quality/QualityCommitmentCards';
import QualityCTA from '../components/quality/QualityCTA';

export default function Quality() {
  return (
    <>
      <SEO {...PAGE_SEO.quality} />

      <QualityHero />

      <section className="section-padding" aria-labelledby="quality-message-heading">
        <div className="section-container">
          <SectionHeading
            label="Our Approach"
            title="Built Around Quality From Quote to Delivery"
            titleId="quality-message-heading"
            description="Quality at K&C begins before machining starts. From reviewing customer requirements to verifying finished parts, our process is built to support accuracy, consistency, and long-term customer relationships."
            align="center"
          />
        </div>
      </section>

      <QualityInspectionProcess />

      <QualityEquipmentGrid />

      <QualityCommitmentCards />

      <QualityCTA />
    </>
  );
}
