import { useEffect } from 'react';
import { applySeoToDocument, buildJsonLd, buildPageSeo } from '../utils/seoUtils';

export default function SEO({
  title,
  description,
  path = '/',
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType,
  twitterCard,
  schema,
  jsonLd,
  noindex = false,
}) {
  useEffect(() => {
    const seo = buildPageSeo({
      title,
      description,
      path,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      twitterCard,
      noindex,
    });

    if (canonical) {
      seo.canonical = canonical;
    }

    applySeoToDocument(seo, buildJsonLd(schema, jsonLd));
  }, [
    title,
    description,
    path,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    schema,
    jsonLd,
    noindex,
  ]);

  return null;
}
