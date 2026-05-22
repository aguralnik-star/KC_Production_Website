import SEO from '../components/SEO';
import { PAGE_SEO } from '../config/siteConfig';
import SectionHeading from '../components/SectionHeading';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import IndustriesServedModern from '../components/trust/IndustriesServedModern';
import TrustCTA from '../components/trust/TrustCTA';

export default function Industries() {
  return (
    <>
      <SEO {...PAGE_SEO.industries} />

      <section className="page-hero">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: 'Home', to: '/' }, { label: 'Industries' }]}
            className="mb-6"
            dark
          />
          <SectionHeading
            label="Industries Served"
            title="Manufacturing Support Across Demanding Industrial Markets"
            description="K&C Design and Manufacturing supports customers across transportation, medical, automotive, hydraulics, valves, heavy equipment, material handling, electronics, food service, military, and custom inspection applications."
            titleId="industries-hero-heading"
            headingLevel="h1"
            dark
          />
        </div>
      </section>

      <IndustriesServedModern
        showDescriptions
        showHeader={false}
        className="!pt-0"
      />

      <TrustCTA
        analyticsLocation="industries_page"
        secondaryLabel="View Capabilities"
        secondaryTo="/capabilities"
      />

      <section className="section-padding bg-slate-50">
        <div className="section-container text-center">
          <SectionHeading
            title="Don't See Your Industry Listed?"
            description="We work with manufacturers across many sectors. Contact us to discuss your project — we'd be honored to share our expertise."
            align="center"
          />
        </div>
      </section>
    </>
  );
}
