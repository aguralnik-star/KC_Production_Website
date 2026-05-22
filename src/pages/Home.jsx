import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import HomeHeroV2 from '../components/home/HomeHeroV2';
import HomeTrustStrip from '../components/home/HomeTrustStrip';
import HomeCapabilitiesPreview from '../components/home/HomeCapabilitiesPreview';
import HomeEquipmentPreview from '../components/home/HomeEquipmentPreview';
import HomeQualityPreview from '../components/home/HomeQualityPreview';
import HomeIndustriesPreview from '../components/home/HomeIndustriesPreview';
import HomeWhyKC from '../components/home/HomeWhyKC';
import HomeStatsBand from '../components/home/HomeStatsBand';
import HomeRFQCTA from '../components/home/HomeRFQCTA';

export default function Home() {
  return (
    <>
      <SEO {...PAGE_SEO.home} schema="localBusiness" />

      <HomeHeroV2 />
      <HomeTrustStrip />
      <HomeCapabilitiesPreview />
      <HomeEquipmentPreview />
      <HomeQualityPreview />
      <HomeIndustriesPreview />
      <HomeWhyKC />
      <HomeStatsBand />
      <HomeRFQCTA />
    </>
  );
}
