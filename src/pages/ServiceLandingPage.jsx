import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ServiceHero from '../components/services/ServiceHero';
import ServiceOverview from '../components/services/ServiceOverview';
import ServiceCapabilities from '../components/services/ServiceCapabilities';
import ServiceApplications from '../components/services/ServiceApplications';
import ServiceMaterials from '../components/services/ServiceMaterials';
import ServiceProcess from '../components/services/ServiceProcess';
import ServiceWhyKC from '../components/services/ServiceWhyKC';
import ServiceFAQ from '../components/services/ServiceFAQ';
import ServiceCTA from '../components/services/ServiceCTA';
import { getRelatedServices, getServiceBySlug } from '../data/seoServicePages';
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

  const relatedServices = getRelatedServices(service.relatedServices ?? []);

  return (
    <>
      <SEO
        title={service.title}
        description={service.metaDescription}
        path={service.path}
        jsonLd={buildServicePageJsonLd(service)}
      />

      <ServiceHero eyebrow={service.eyebrow} h1={service.h1} overview={service.overview} serviceSlug={slug} />
      <ServiceOverview overview={service.overview} />
      <ServiceCapabilities capabilities={service.capabilities} />
      <ServiceApplications applications={service.applications} />
      <ServiceMaterials materials={service.materials} />
      <ServiceProcess />
      <ServiceWhyKC />
      <ServiceFAQ faq={service.faq} />
      <ServiceCTA relatedServices={relatedServices} serviceSlug={slug} />
    </>
  );
}
