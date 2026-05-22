import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import AboutHero from '../components/about/AboutHero';
import AboutStory from '../components/about/AboutStory';
import AboutTimeline from '../components/about/AboutTimeline';
import AboutValues from '../components/about/AboutValues';
import TrustSignalsSection from '../components/trust/TrustSignalsSection';
import AboutExperienceStrip from '../components/about/AboutExperienceStrip';
import ApprovedTestimonialsSection from '../components/trust/ApprovedTestimonialsSection';
import AboutCTA from '../components/about/AboutCTA';

export default function About() {
  return (
    <>
      <SEO {...PAGE_SEO.about} />

      <div className="section-container px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
      </div>

      <AboutHero />

      <AboutStory />

      <AboutTimeline />

      <AboutValues />

      <TrustSignalsSection limit={8} variant="light" />

      <AboutExperienceStrip />

      <ApprovedTestimonialsSection limit={2} className="bg-slate-50" eyebrow="Customer Experience" />

      <AboutCTA />
    </>
  );
}
