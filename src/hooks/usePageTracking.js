import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initPublicAnalytics, setAnalyticsPath, trackPageView } from '../utils/analytics';
import { isPublicAnalyticsPath } from '../config/analyticsConfig';

export function usePageTracking() {
  const location = useLocation();
  const previousPathRef = useRef('');

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;

    setAnalyticsPath(location.pathname);

    if (!isPublicAnalyticsPath(location.pathname)) {
      previousPathRef.current = path;
      return;
    }

    initPublicAnalytics(location.pathname);

    if (previousPathRef.current !== path) {
      trackPageView(path, document.title);
      previousPathRef.current = path;
    }
  }, [location.pathname, location.search, location.hash]);
}
