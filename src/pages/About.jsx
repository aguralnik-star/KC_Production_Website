import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import AboutHero from '../components/about/AboutHero';
import AboutStory from '../components/about/AboutStory';
import AboutTimeline from '../components/about/AboutTimeline';
import AboutValues from '../components/about/AboutValues';
import TrustSignalsSection from '../components/trust/TrustSignalsSection';
import AboutExperienceStrip from '../components/about/AboutExperienceStrip';
import AboutCTA from '../components/about/AboutCTA';

export default function About() {
  return (
    <>
      <SEO {...PAGE_SEO.about} />

      <AboutHero />

      <AboutStory />

      <AboutTimeline />

      <AboutValues />

      <TrustSignalsSection limit={8} variant="light" />

      <AboutExperienceStrip />

      <AboutCTA />
    </>
  );
}
