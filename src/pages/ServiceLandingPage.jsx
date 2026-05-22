import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RelatedServices from '../components/seo/RelatedServices';
import RelatedIndustries from '../components/seo/RelatedIndustries';
import RelatedProjects from '../components/seo/RelatedProjects';
import ServiceHero from '../components/services/ServiceHero';
import ServiceOverview from '../components/services/ServiceOverview';
import ServiceCapabilities from '../components/services/ServiceCapabilities';
import ServiceApplications from '../components/services/ServiceApplications';
import ServiceMaterials from '../components/services/ServiceMaterials';
import ServiceProcess from '../components/services/ServiceProcess';
import ServiceWhyKC from '../components/services/ServiceWhyKC';
import ServiceFAQ from '../components/services/ServiceFAQ';
import ApprovedTestimonialsSection from '../components/trust/ApprovedTestimonialsSection';
import ServiceCTA from '../components/services/ServiceCTA';
import CredibilityBand from '../components/trust/CredibilityBand';
import { getServiceBySlug } from '../data/seoServicePages';
import { buildServicePageJsonLd } from '../utils/serviceSeoUtils';
import { trackServicePageView } from '../utils/analytics';

export default function ServiceLandingPage() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  useEffect(() => {
    if (slug && service) {
      trackServicePageView(slug);
    }
  }, [slug, service]);

  if (!service) {
    return <Navigate to="/capabilities" replace />;
  }

  return (
    <>
      <SEO
        title={service.title}
        description={service.metaDescription}
        path={service.path}
        jsonLd={buildServicePageJsonLd(service)}
      />

      <div className="section-container px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/capabilities' },
            { label: service.eyebrow },
          ]}
        />
      </div>

      <ServiceHero eyebrow={service.eyebrow} h1={service.h1} overview={service.overview} serviceSlug={slug} />
      <CredibilityBand compact />
      <ServiceOverview overview={service.overview} />
      <ServiceCapabilities capabilities={service.capabilities} />
      <ServiceApplications applications={service.applications} />
      <ServiceMaterials materials={service.materials} />
      <ServiceProcess />
      <ServiceWhyKC />
      <ServiceFAQ faq={service.faq} />
      <RelatedServices serviceSlug={slug} />
      <RelatedIndustries serviceSlug={slug} />
      <RelatedProjects className="bg-brand-light" />
      <ApprovedTestimonialsSection limit={2} />
      <ServiceCTA serviceSlug={slug} />
    </>
  );
}
