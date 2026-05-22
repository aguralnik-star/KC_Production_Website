import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import RFQQuoteSummary from './RFQQuoteSummary';
import QuoteEmailDraftGenerator from './QuoteEmailDraftGenerator';
import QuoteDraftPreview from './QuoteDraftPreview';
import QuoteManualSendTracker from './QuoteManualSendTracker';
import QuoteDraftHistory from './QuoteDraftHistory';
import {
  archiveQuoteDraft,
  getManualSendEvents,
  getQuoteDrafts,
  markDraftCopied,
  markDraftManuallySent,
  saveQuoteDraft,
  updateQuoteDraft,
} from '../../services/quoteDraftService';
import { resendCustomerConfirmationEmail } from '../../services/adminRfqService';

export default function RFQWorkflowPanel({ request, files, onRequestUpdated }) {
  const [drafts, setDrafts] = useState([]);
  const [sendEvents, setSendEvents] = useState([]);
  const [activeDraft, setActiveDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [archivingId, setArchivingId] = useState(null);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadQuoteData = useCallback(async () => {
    if (!request?.id) return;
    setLoading(true);
    setError('');
    try {
      const [draftList, events] = await Promise.all([
        getQuoteDrafts(request.id),
        getManualSendEvents(request.id),
      ]);
      setDrafts(draftList);
      setSendEvents(events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load quote workflow data.');
    } finally {
      setLoading(false);
    }
  }, [request?.id]);

  useEffect(() => {
    setActiveDraft(null);
    setSuccessMessage('');
    loadQuoteData();
  }, [loadQuoteData, request?.id]);

  const handleGenerate = (draft) => {
    setActiveDraft({
      subject: draft.subject,
      body: draft.body,
      draft_type: draft.draft_type,
      status: 'draft',
    });
    setSuccessMessage('');
  };

  const handleSaveDraft = async () => {
    if (!activeDraft || !request?.id) return;
    setSaving(true);
    setError('');
    try {
      const result = await saveQuoteDraft(request.id, activeDraft);
      setActiveDraft(result.draft);
      onRequestUpdated?.(result.rfq);
      await loadQuoteData();
      setSuccessMessage('Quote draft saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDraftContent = async () => {
    if (!activeDraft?.id) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateQuoteDraft(activeDraft.id, {
        subject: activeDraft.subject,
        body: activeDraft.body,
      });
      setActiveDraft(updated);
      await loadQuoteData();
      setSuccessMessage('Draft updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkCopied = async () => {
    if (!activeDraft?.id) return;
    setLoadingAction(true);
    setError('');
    try {
      const updated = await markDraftCopied(activeDraft.id);
      setActiveDraft(updated);
      await loadQuoteData();
      setSuccessMessage('Draft marked as copied.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to mark draft copied.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleMarkManuallySent = async () => {
    if (!activeDraft?.id || !request) return;
    setLoadingAction(true);
    setError('');
    try {
      const result = await markDraftManuallySent(activeDraft.id, {
        sent_to_email: request.email,
        send_method: 'manual_email',
        sent_at: new Date().toISOString(),
        sent_subject: activeDraft.subject,
        notes: 'Marked manually sent from draft preview.',
      });
      setActiveDraft(result.draft);
      onRequestUpdated?.(result.rfq);
      await loadQuoteData();
      setSuccessMessage('Manual send recorded. No email was sent by the website.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to record manual send.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSaveSendEvent = async (sendData) => {
    if (!activeDraft?.id || !request?.id) return;
    setSaving(true);
    setError('');
    try {
      const result = await markDraftManuallySent(activeDraft.id, sendData);
      setActiveDraft(result.draft);
      onRequestUpdated?.(result.rfq);
      await loadQuoteData();
      setSuccessMessage('Manual send recorded. No email was sent by the website.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save manual send event.');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadDraft = (draft) => {
    setActiveDraft(draft);
    setSuccessMessage('');
  };

  const handleArchiveDraft = async (draftId) => {
    setArchivingId(draftId);
    setError('');
    try {
      await archiveQuoteDraft(draftId);
      if (activeDraft?.id === draftId) {
        setActiveDraft(null);
      }
      await loadQuoteData();
      setSuccessMessage('Draft archived.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to archive draft.');
    } finally {
      setArchivingId(null);
    }
  };

  const handleResendConfirmation = async () => {
    if (!request?.id) return;
    setResendingConfirmation(true);
    setError('');
    try {
      const updated = await resendCustomerConfirmationEmail(request.id);
      onRequestUpdated?.(updated);
      setSuccessMessage('Customer confirmation email resent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend confirmation email.');
      throw err;
    } finally {
      setResendingConfirmation(false);
    }
  };

  if (!request) return null;

  return (
    <div className="space-y-4">
      {successMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{successMessage}</p>
      )}

      {request.status === 'waiting_on_customer' && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-900">
          This RFQ is waiting on customer additional information. Use the Customer Updates tab to review the request history, customer submissions, and re-uploaded files.
        </div>
      )}

      {request.has_customer_reupload && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          The customer has submitted additional information. Review re-uploaded files in the Customer Updates tab before continuing quote preparation.
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-accent" aria-label="Loading quote workflow" />
        </div>
      ) : (
        <>
          <RFQQuoteSummary
            request={request}
            onResendConfirmation={handleResendConfirmation}
            resending={resendingConfirmation}
          />
          <QuoteEmailDraftGenerator request={request} files={files} onGenerate={handleGenerate} />
          <QuoteDraftPreview
            draft={activeDraft}
            onChange={setActiveDraft}
            onSave={activeDraft?.id ? handleUpdateDraftContent : handleSaveDraft}
            onMarkCopied={handleMarkCopied}
            onMarkManuallySent={handleMarkManuallySent}
            saving={saving}
            loadingAction={loadingAction}
          />
          <QuoteManualSendTracker
            request={request}
            draft={activeDraft}
            onSaveSendEvent={handleSaveSendEvent}
            saving={saving}
            successMessage={successMessage}
          />
          <QuoteDraftHistory
            drafts={drafts}
            onLoadDraft={handleLoadDraft}
            onArchiveDraft={handleArchiveDraft}
            loadingId={archivingId}
          />
          {sendEvents.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-charcoal">Manual Send Events</h3>
              <ul className="mt-3 space-y-2 text-sm text-metallic">
                {sendEvents.map((event) => (
                  <li key={event.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <span className="font-medium text-charcoal">{event.sent_to_email || 'Unknown recipient'}</span>
                    {' · '}
                    {event.send_method?.replace('_', ' ')}
                    {' · '}
                    {new Date(event.sent_at).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
