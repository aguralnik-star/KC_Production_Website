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

const RFQ_CATEGORY = 'rfq_conversion';

export function useConversionTracking(location = 'contact_form') {
  const startedRef = useRef(false);

  const trackFormStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackRFQStart(location);
  }, [location]);

  const trackStepContactCompleted = useCallback(() => {
    trackEvent('rfq_step_contact_completed', { category: RFQ_CATEGORY, step: 'contact' });
  }, []);

  const trackStepProjectCompleted = useCallback(() => {
    trackEvent('rfq_step_project_completed', { category: RFQ_CATEGORY, step: 'project' });
  }, []);

  const trackFileAdded = useCallback((fileCount) => {
    trackFileUploadAdded(fileCount);
  }, []);

  const trackFileRemoved = useCallback((fileCount) => {
    trackEvent('rfq_file_upload_removed', { category: RFQ_CATEGORY, file_count: Number(fileCount) || 0 });
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
    trackEvent('rfq_draft_restored', { category: RFQ_CATEGORY, step: 'draft' });
  }, []);

  const trackDraftCleared = useCallback(() => {
    trackEvent('rfq_draft_cleared', { category: RFQ_CATEGORY, step: 'draft' });
  }, []);

  const trackConfirmationConversion = useCallback((referenceNumber) => {
    if (!referenceNumber) return;
    trackOnce('rfq_form_submit_success', referenceNumber, {
      category: RFQ_CATEGORY,
      step: 'confirmation',
      reference_number: referenceNumber,
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
