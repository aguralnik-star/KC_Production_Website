import { useCallback, useRef } from 'react';
import { trackEvent, trackOnce } from '../utils/analytics';

export function useConversionTracking() {
  const startedRef = useRef(false);
  const contactTrackedRef = useRef(false);
  const projectTrackedRef = useRef(false);

  const trackFormStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent('rfq_form_start');
  }, []);

  const trackStepContactCompleted = useCallback(() => {
    if (contactTrackedRef.current) return;
    contactTrackedRef.current = true;
    trackEvent('rfq_step_contact_completed', { step: 'contact' });
  }, []);

  const trackStepProjectCompleted = useCallback(() => {
    if (projectTrackedRef.current) return;
    projectTrackedRef.current = true;
    trackEvent('rfq_step_project_completed', { step: 'project' });
  }, []);

  const trackFileAdded = useCallback((fileCount) => {
    trackEvent('rfq_file_upload_added', { file_count: fileCount });
  }, []);

  const trackFileRemoved = useCallback((fileCount) => {
    trackEvent('rfq_file_upload_removed', { file_count: fileCount });
  }, []);

  const trackSubmitAttempt = useCallback(() => {
    trackEvent('rfq_form_submit_attempt');
  }, []);

  const trackSubmitSuccess = useCallback(() => {
    trackEvent('rfq_form_submit_success');
  }, []);

  const trackSubmitError = useCallback((errorType = 'submit') => {
    trackEvent('rfq_form_submit_error', { error_type: errorType });
  }, []);

  const trackDraftRestored = useCallback(() => {
    trackEvent('rfq_draft_restored');
  }, []);

  const trackDraftCleared = useCallback(() => {
    trackEvent('rfq_draft_cleared');
  }, []);

  const trackConfirmationView = useCallback((referenceNumber) => {
    if (!referenceNumber) return;
    trackOnce('rfq_confirmation_viewed', referenceNumber, { category: 'rfq_conversion' });
  }, []);

  return {
    trackFormStart,
    trackStepContactCompleted,
    trackStepProjectCompleted,
    trackFileAdded,
    trackFileRemoved,
    trackSubmitAttempt,
    trackSubmitSuccess,
    trackSubmitError,
    trackDraftRestored,
    trackDraftCleared,
    trackConfirmationView,
  };
}
