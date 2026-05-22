import { useCallback, useRef } from 'react';
import {
  trackAdditionalInfoUploadStart,
  trackAdditionalInfoUploadSuccess,
  trackEvent,
  trackFileUploadAdded,
  trackFileUploadError,
  trackOnce,
  trackRFQStart,
  trackRFQSubmitAttempt,
  trackRFQSubmitError,
  trackRFQSubmitSuccess,
} from '../utils/analytics';

export function useConversionTracking(location = 'contact_form') {
  const startedRef = useRef(false);

  const trackFormStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackRFQStart(location);
  }, [location]);

  const trackStepContactCompleted = useCallback(() => {
    trackEvent('rfq_step_contact_completed', { form_status: 'contact_complete' });
  }, []);

  const trackStepProjectCompleted = useCallback(() => {
    trackEvent('rfq_step_project_completed', { form_status: 'project_complete' });
  }, []);

  const trackFileAdded = useCallback((fileCount) => {
    trackFileUploadAdded(fileCount);
  }, []);

  const trackFileRemoved = useCallback(() => {
    trackEvent('rfq_file_upload_removed', { form_status: 'file_removed' });
  }, []);

  const trackFileError = useCallback((errorType = 'validation') => {
    trackFileUploadError(errorType);
  }, []);

  const trackSubmitAttempt = useCallback(() => {
    trackRFQSubmitAttempt();
  }, []);

  const trackSubmitSuccess = useCallback((referenceNumber) => {
    trackRFQSubmitSuccess(referenceNumber);
  }, []);

  const trackSubmitError = useCallback((errorType = 'submit') => {
    trackRFQSubmitError(errorType);
  }, []);

  const trackDraftRestored = useCallback(() => {
    trackEvent('rfq_draft_restored', { form_status: 'draft_restored' });
  }, []);

  const trackDraftCleared = useCallback(() => {
    trackEvent('rfq_draft_cleared', { form_status: 'draft_cleared' });
  }, []);

  const trackConfirmationConversion = useCallback((referenceNumber) => {
    if (!referenceNumber) return;
    trackOnce('rfq_form_submit_success', referenceNumber, {
      reference_number: referenceNumber,
      form_status: 'confirmation_view',
    });
  }, []);

  const trackAdditionalInfoStart = useCallback(() => {
    trackAdditionalInfoUploadStart();
  }, []);

  const trackAdditionalInfoSuccess = useCallback(() => {
    trackAdditionalInfoUploadSuccess();
  }, []);

  return {
    trackFormStart,
    trackStepContactCompleted,
    trackStepProjectCompleted,
    trackFileAdded,
    trackFileRemoved,
    trackFileError,
    trackSubmitAttempt,
    trackSubmitSuccess,
    trackSubmitError,
    trackDraftRestored,
    trackDraftCleared,
    trackConfirmationConversion,
    trackAdditionalInfoStart,
    trackAdditionalInfoSuccess,
  };
}
