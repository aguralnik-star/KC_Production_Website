import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyGoogleSiteVerification } from '../utils/seoUtils';
import { hasGoogleSiteVerification, isPublicAnalyticsPath } from '../config/analyticsConfig';
import { initPublicAnalytics, setAnalyticsPath } from '../utils/analytics';

export default function AnalyticsProvider({ children }) {
  const location = useLocation();

  useEffect(() => {
    if (hasGoogleSiteVerification()) {
      applyGoogleSiteVerification();
    }
  }, []);

  useEffect(() => {
    setAnalyticsPath(location.pathname);

    if (isPublicAnalyticsPath(location.pathname)) {
      initPublicAnalytics(location.pathname);
    }
  }, [location.pathname]);

  return children;
}
