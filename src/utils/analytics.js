import {
  ALLOWED_ANALYTICS_PARAM_KEYS,
  ANALYTICS_DEBUG,
  CLARITY_PROJECT_ID,
  GA4_MEASUREMENT_ID,
  RFQ_REFERENCE_PATTERN,
  isPublicAnalyticsPath,
} from '../config/analyticsConfig';

let ga4Initialized = false;
let clarityInitialized = false;
let currentPath = '';

function canTrack(path = currentPath) {
  return typeof window !== 'undefined' && isPublicAnalyticsPath(path);
}

function sanitizeReferenceNumber(referenceNumber) {
  if (!referenceNumber || typeof referenceNumber !== 'string') return undefined;
  const trimmed = referenceNumber.trim().toUpperCase();
  return RFQ_REFERENCE_PATTERN.test(trimmed) ? trimmed : undefined;
}

function sanitizeParams(params = {}) {
  const safe = {};

  Object.entries(params).forEach(([key, value]) => {
    if (!ALLOWED_ANALYTICS_PARAM_KEYS.has(key)) return;
    if (value === undefined || value === null || value === '') return;

    if (key === 'reference_number') {
      const ref = sanitizeReferenceNumber(String(value));
      if (ref) safe[key] = ref;
      return;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      safe[key] = value;
    }
  });

  return safe;
}

function logDebug(eventName, params) {
  if (ANALYTICS_DEBUG) {
    console.info('[analytics]', eventName, params);
  }
}

function sendToGA4(eventName, params) {
  if (!GA4_MEASUREMENT_ID || typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, params);
}

export function setAnalyticsPath(path) {
  currentPath = path || '';
}

export function initGA4() {
  if (typeof window === 'undefined' || !GA4_MEASUREMENT_ID || ga4Initialized) return;

  ga4Initialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`;
  script.id = 'kc-ga4-script';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });
}

export function initClarity() {
  if (typeof window === 'undefined' || !CLARITY_PROJECT_ID || clarityInitialized) return;

  clarityInitialized = true;

  window.clarity =
    window.clarity ||
    function clarityStub() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_PROJECT_ID)}`;
  script.id = 'kc-clarity-script';
  document.head.appendChild(script);
}

export function initPublicAnalytics(path = '/') {
  setAnalyticsPath(path);
  if (!canTrack(path)) return;
  initGA4();
  initClarity();
}

export function trackPageView(path, title) {
  if (!canTrack(path)) return;

  const params = sanitizeParams({
    page_path: path || window.location.pathname,
    page_title: title || document.title,
  });

  logDebug('page_view', params);

  if (GA4_MEASUREMENT_ID && typeof window.gtag === 'function') {
    window.gtag('config', GA4_MEASUREMENT_ID, params);
    window.gtag('event', 'page_view', params);
  }
}

export function trackEvent(eventName, params = {}) {
  if (!eventName || typeof eventName !== 'string' || !canTrack()) return;

  const payload = sanitizeParams(params);
  logDebug(eventName, payload);
  sendToGA4(eventName, payload);
}

export function trackOnce(eventName, dedupeKey, params = {}) {
  if (!canTrack() || !dedupeKey || typeof window === 'undefined') {
    trackEvent(eventName, params);
    return;
  }

  const storageKey = `kc_analytics_once_${eventName}_${dedupeKey}`;
  if (sessionStorage.getItem(storageKey)) return;

  sessionStorage.setItem(storageKey, '1');
  trackEvent(eventName, params);
}

export function trackCTAClick(label, location, destination = '') {
  trackEvent('cta_click', {
    cta_label: label,
    cta_location: location,
    destination,
  });
}

export function trackRFQStart(location = 'contact_form') {
  trackOnce('rfq_form_start', location, { location });
}

export function trackRFQSubmitAttempt() {
  trackEvent('rfq_form_submit_attempt');
}

export function trackRFQSubmitSuccess(referenceNumber) {
  const params = {};
  const ref = sanitizeReferenceNumber(referenceNumber);
  if (ref) params.reference_number = ref;
  trackEvent('rfq_form_submit_success', params);
}

export function trackRFQSubmitError(errorType = 'submit') {
  trackEvent('rfq_form_submit_error', { error_type: errorType });
}

export function trackFileUploadAdded(fileCount) {
  trackEvent('rfq_file_upload_added', { file_count: Number(fileCount) || 0 });
}

export function trackFileUploadError(errorType = 'validation') {
  trackEvent('rfq_file_upload_error', { error_type: errorType });
}

export function trackStatusLookupAttempt() {
  trackEvent('rfq_status_lookup_attempt');
}

export function trackStatusLookupSuccess(referenceNumber) {
  const params = {};
  const ref = sanitizeReferenceNumber(referenceNumber);
  if (ref) params.reference_number = ref;
  trackEvent('rfq_status_lookup_success', params);
}

export function trackStatusLookupNotFound() {
  trackEvent('rfq_status_lookup_not_found');
}

export function trackStatusLookupError(errorType = 'lookup') {
  trackEvent('rfq_status_lookup_error', { error_type: errorType });
}

export function trackAdditionalInfoUploadStart() {
  trackEvent('additional_info_upload_start');
}

export function trackAdditionalInfoUploadSuccess() {
  trackEvent('additional_info_upload_success');
}

export function trackPhoneClick(location) {
  trackEvent('phone_click', { location });
}

export function trackEmailClick(location) {
  trackEvent('email_click', { location });
}

export function trackServicePageView(serviceSlug) {
  if (!serviceSlug) return;
  trackEvent('service_page_view', { service_slug: serviceSlug });
}

export function trackProjectShowcaseView(projectTitle, projectCategory) {
  trackEvent('project_showcase_view', {
    project_title: projectTitle,
    project_category: projectCategory,
  });
}

export function trackProjectCategoryFilter(category) {
  trackEvent('cta_click', {
    cta_label: 'category_filter',
    cta_location: 'projects',
    project_category: category,
  });
}
