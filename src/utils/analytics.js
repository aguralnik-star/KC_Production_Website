const ALLOWED_PARAM_KEYS = new Set(['step', 'file_count', 'error_type', 'category']);

function sanitizeParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([key, value]) => {
      if (!ALLOWED_PARAM_KEYS.has(key)) return false;
      if (value === undefined || value === null) return false;
      return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
    }),
  );
}

export function trackEvent(eventName, params = {}) {
  if (!eventName || typeof eventName !== 'string') return;

  const payload = {
    event: eventName,
    category: 'rfq_conversion',
    ...sanitizeParams(params),
  };

  if (import.meta.env.DEV) {
    console.info('[analytics]', payload);
  }

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  }
}

export function trackOnce(eventName, dedupeKey, params = {}) {
  if (typeof window === 'undefined' || !dedupeKey) {
    trackEvent(eventName, params);
    return;
  }

  const storageKey = `kc_analytics_once_${dedupeKey}`;
  if (sessionStorage.getItem(storageKey)) return;

  sessionStorage.setItem(storageKey, '1');
  trackEvent(eventName, params);
}
