import { DEFAULT_SEO, LOCAL_BUSINESS_SCHEMA, SITE_URL } from '../config/siteConfig';

import { GOOGLE_SITE_VERIFICATION } from '../config/analyticsConfig';

const MANAGED_META_NAMES = new Set([
  'description',
  'keywords',
  'robots',
  'google-site-verification',
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
]);

const MANAGED_META_PROPERTIES = new Set([
  'og:title',
  'og:description',
  'og:image',
  'og:url',
  'og:type',
  'og:site_name',
]);

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export function buildCanonicalUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildPageSeo(pageConfig = {}) {
  const title = pageConfig.title || DEFAULT_SEO.title;
  const description = pageConfig.description || DEFAULT_SEO.description;
  const canonical = buildCanonicalUrl(pageConfig.path || '/');
  const ogImage = pageConfig.ogImage || DEFAULT_SEO.ogImage;

  return {
    title,
    description,
    keywords: pageConfig.keywords || DEFAULT_SEO.keywords,
    canonical,
    ogTitle: pageConfig.ogTitle || title,
    ogDescription: pageConfig.ogDescription || description,
    ogImage,
    ogType: pageConfig.ogType || DEFAULT_SEO.ogType,
    twitterCard: pageConfig.twitterCard || DEFAULT_SEO.twitterCard,
    noindex: Boolean(pageConfig.noindex),
  };
}

export function buildJsonLd(schemaKey, customSchema) {
  if (customSchema) return customSchema;
  if (schemaKey === 'localBusiness') return LOCAL_BUSINESS_SCHEMA;
  return null;
}

export function applySeoToDocument(seo, jsonLd) {
  document.title = seo.title;

  upsertMeta('meta[name="description"]', { name: 'description', content: seo.description });
  upsertMeta('meta[name="keywords"]', { name: 'keywords', content: seo.keywords });
  upsertMeta('meta[name="robots"]', {
    name: 'robots',
    content: seo.noindex ? 'noindex, nofollow' : 'index, follow',
  });

  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.ogTitle });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.ogDescription });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: seo.ogImage });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonical });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.ogType });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'K&C Design and Manufacturing' });

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: seo.twitterCard });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.ogTitle });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.ogDescription });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.ogImage });

  upsertLink('canonical', seo.canonical);

  const scriptId = 'kc-json-ld';
  const existingScript = document.getElementById(scriptId);
  if (existingScript) existingScript.remove();

  if (jsonLd) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}

export function cleanupManagedSeoTags() {
  MANAGED_META_NAMES.forEach((name) => {
    document.head.querySelector(`meta[name="${name}"]`)?.remove();
  });
  MANAGED_META_PROPERTIES.forEach((property) => {
    document.head.querySelector(`meta[property="${property}"]`)?.remove();
  });
  document.head.querySelector('link[rel="canonical"]')?.remove();
  document.getElementById('kc-json-ld')?.remove();
}

export function applyGoogleSiteVerification(content = GOOGLE_SITE_VERIFICATION) {
  if (!content || typeof document === 'undefined') return;

  upsertMeta('meta[name="google-site-verification"]', {
    name: 'google-site-verification',
    content,
  });
}
