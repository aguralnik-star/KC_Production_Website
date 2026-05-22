import { COMPANY } from '../data/company';
import { LOCAL_BUSINESS_SCHEMA, SITE_URL } from '../config/siteConfig';

export function buildServicePageJsonLd(service) {
  const serviceUrl = `${SITE_URL}${service.path}`;

  const serviceSchema = {
    '@type': 'Service',
    name: service.h1,
    description: service.metaDescription,
    url: serviceUrl,
    provider: {
      '@type': 'LocalBusiness',
      name: COMPANY.name,
      url: SITE_URL,
      telephone: COMPANY.phone,
      address: LOCAL_BUSINESS_SCHEMA.address,
    },
    areaServed: 'Midwest United States',
    serviceType: service.eyebrow,
  };

  const graph = [LOCAL_BUSINESS_SCHEMA, serviceSchema];

  if (service.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: service.faq.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
