import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import HomeHeroV2 from '../components/home/HomeHeroV2';
import HomeTrustStrip from '../components/home/HomeTrustStrip';
import CredibilityBand from '../components/trust/CredibilityBand';
import HomeCapabilitiesPreview from '../components/home/HomeCapabilitiesPreview';
import HomeServicesPreview from '../components/home/HomeServicesPreview';
import HomeProjectsPreview from '../components/home/HomeProjectsPreview';
import HomeEquipmentPreview from '../components/home/HomeEquipmentPreview';
import HomeQualityPreview from '../components/home/HomeQualityPreview';
import IndustriesServedModern from '../components/trust/IndustriesServedModern';
import HomeWhyKC from '../components/home/HomeWhyKC';
import HomeStatsBand from '../components/home/HomeStatsBand';
import TestimonialSection from '../components/trust/TestimonialSection';
import HomeRFQCTA from '../components/home/HomeRFQCTA';

export default function Home() {
  return (
    <>
      <SEO {...PAGE_SEO.home} schema="localBusiness" />

      <HomeHeroV2 />
      <HomeTrustStrip />
      <CredibilityBand />
      <HomeCapabilitiesPreview />
      <HomeServicesPreview />
      <HomeProjectsPreview />
      <HomeEquipmentPreview />
      <HomeQualityPreview />
      <IndustriesServedModern
        limit={6}
        showDescriptions={false}
        showCTA
        ctaLabel="View All Industries"
        ctaTo="/industries"
        title="Serving Demanding Manufacturing Markets"
        description="K&C supports precision machining, tooling, fixtures, and gauge applications across a wide range of industrial markets."
      />
      <HomeWhyKC />
      <HomeStatsBand />
      <TestimonialSection limit={4} />
      <HomeRFQCTA />
    </>
  );
}
