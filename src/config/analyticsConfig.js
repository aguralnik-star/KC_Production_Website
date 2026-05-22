export const GA4_MEASUREMENT_ID = (import.meta.env.VITE_GA4_MEASUREMENT_ID || '').trim();
export const CLARITY_PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID || '').trim();
export const GOOGLE_SITE_VERIFICATION = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim();
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.kcdesignmfg.com').replace(/\/$/, '');

export const ANALYTICS_DEBUG = import.meta.env.DEV;

export const ALLOWED_ANALYTICS_PARAM_KEYS = new Set([
  'page_path',
  'page_title',
  'cta_label',
  'cta_location',
  'destination',
  'location',
  'service_slug',
  'project_category',
  'project_title',
  'reference_number',
  'form_status',
  'file_count',
  'error_type',
  'error_category',
  'step',
  'category',
]);

export const RFQ_REFERENCE_PATTERN = /^KC-RFQ-\d{8}-\d{4}$/i;

export function isAdminPath(path = '') {
  return String(path).startsWith('/admin');
}

export function isPublicAnalyticsPath(path = '') {
  return !isAdminPath(path);
}

export function hasGA4Config() {
  return Boolean(GA4_MEASUREMENT_ID);
}

export function hasClarityConfig() {
  return Boolean(CLARITY_PROJECT_ID);
}

export function hasGoogleSiteVerification() {
  return Boolean(GOOGLE_SITE_VERIFICATION);
}
