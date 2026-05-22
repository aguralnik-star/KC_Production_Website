import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import QualityHero from '../components/quality/QualityHero';
import QualityInspectionProcess from '../components/quality/QualityInspectionProcess';
import QualityEquipmentGrid from '../components/quality/QualityEquipmentGrid';
import QualityCommitmentCards from '../components/quality/QualityCommitmentCards';
import TrustSignalsSection from '../components/trust/TrustSignalsSection';
import { getTrustSignalsByIds, INSPECTION_TRUST_SIGNAL_IDS } from '../data/trustSignalsData';
import QualityCTA from '../components/quality/QualityCTA';

export default function Quality() {
  return (
    <>
      <SEO {...PAGE_SEO.quality} />

      <div className="section-container px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Quality' }]} />
      </div>

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

      <TrustSignalsSection
        signals={getTrustSignalsByIds(INSPECTION_TRUST_SIGNAL_IDS)}
        variant="dark"
        eyebrow="Inspection-Driven Quality"
        title="Quality Supported by Practical Inspection Discipline"
        description="K&C focuses on inspection tools, repeatability, and careful review — without overstating certifications or approvals."
      />

      <QualityCTA />
    </>
  );
}
