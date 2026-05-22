import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import RFQPublicStatusEditor from './RFQPublicStatusEditor';
import CustomerStatusEmailDraftGenerator from './CustomerStatusEmailDraftGenerator';
import CustomerStatusEmailPreview from './CustomerStatusEmailPreview';
import CustomerStatusEmailSendButton from './CustomerStatusEmailSendButton';
import CustomerStatusEmailHistory from './CustomerStatusEmailHistory';
import RFQPublicStatusBadge from '../RFQPublicStatusBadge';
import {
  archiveStatusEmailDraft,
  generateStatusEmailDraft,
  getStatusEmailDrafts,
  getStatusEmailEvents,
  markStatusEmailDraftReady,
  saveStatusEmailDraft,
  sendStatusEmailDraft,
  updateStatusEmailDraft,
} from '../../services/customerStatusEmailService';
import { getRFQRequestById } from '../../services/adminRfqService';
import {
  CUSTOMER_STATUS_LABELS,
  getDefaultCustomerStatusMessage,
  getSuggestedPublicStatus,
} from '../../services/rfqWorkflowService';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function CustomerStatusEmailPanel({ request, onRequestUpdated }) {
  const [publicStatus, setPublicStatus] = useState('received');
  const [customerMessage, setCustomerMessage] = useState('');
  const [activeDraft, setActiveDraft] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [markingReady, setMarkingReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [archivingId, setArchivingId] = useState(null);
  const [error, setError] = useState('');
  const [sendResult, setSendResult] = useState(null);

  const loadData = useCallback(async () => {
    if (!request?.id) return;
    setLoading(true);
    setError('');
    try {
      const [draftList, eventList] = await Promise.all([
        getStatusEmailDrafts(request.id),
        getStatusEmailEvents(request.id),
      ]);
      setDrafts(draftList);
      setEvents(eventList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load customer update data.');
    } finally {
      setLoading(false);
    }
  }, [request?.id]);

  useEffect(() => {
    if (!request) return;
    const suggested = getSuggestedPublicStatus(request);
    setPublicStatus(request.public_status || suggested);
    setCustomerMessage(
      request.customer_status_message || getDefaultCustomerStatusMessage(suggested),
    );
    setActiveDraft(null);
    setSendResult(null);
    loadData();
  }, [request, loadData]);

  const handleGenerate = () => {
    const draft = generateStatusEmailDraft(request, publicStatus, customerMessage);
    setActiveDraft(draft);
    setSendResult(null);
  };

  const handleSaveDraft = async () => {
    if (!activeDraft || !request?.id) return;
    setSaving(true);
    setError('');
    try {
      if (activeDraft.id) {
        const updated = await updateStatusEmailDraft(activeDraft.id, {
          subject: activeDraft.subject,
          body: activeDraft.body,
          public_status: activeDraft.public_status ?? publicStatus,
        });
        setActiveDraft(updated);
      } else {
        const saved = await saveStatusEmailDraft(request.id, {
          ...activeDraft,
          public_status: publicStatus,
        });
        setActiveDraft(saved);
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkReady = async () => {
    if (!activeDraft?.id) {
      await handleSaveDraft();
      return;
    }
    setMarkingReady(true);
    setError('');
    try {
      const updated = await markStatusEmailDraftReady(activeDraft.id);
      setActiveDraft(updated);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to mark draft ready.');
    } finally {
      setMarkingReady(false);
    }
  };

  const handleSend = async () => {
    if (!activeDraft?.id) return;
    setSending(true);
    setError('');
    setSendResult(null);
    try {
      await sendStatusEmailDraft(activeDraft.id);
      setSendResult({ success: true });
      await loadData();
      const refreshedDrafts = await getStatusEmailDrafts(request.id);
      const sentDraft = refreshedDrafts.find((item) => item.id === activeDraft.id);
      if (sentDraft) setActiveDraft(sentDraft);

      const refreshedRfq = await getRFQRequestById(request.id);
      onRequestUpdated?.(refreshedRfq);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to send email.';
      setSendResult({ error: message });
      await loadData();
    } finally {
      setSending(false);
    }
  };

  const handleLoadDraft = (draft) => {
    setActiveDraft(draft);
    setPublicStatus(draft.public_status);
    setSendResult(null);
  };

  const handleArchiveDraft = async (draftId) => {
    setArchivingId(draftId);
    setError('');
    try {
      await archiveStatusEmailDraft(draftId);
      if (activeDraft?.id === draftId) setActiveDraft(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to archive draft.');
    } finally {
      setArchivingId(null);
    }
  };

  if (!request) return null;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-metallic">Current Public Status</p>
            <div className="mt-2">
              <RFQPublicStatusBadge
                status={request.public_status || publicStatus}
                label={CUSTOMER_STATUS_LABELS[request.public_status || publicStatus]}
              />
            </div>
          </div>
          <div className="text-sm text-metallic">
            <p>Last status email: {formatDate(request.last_customer_status_email_sent_at)}</p>
            <p>Email status: {request.last_customer_status_email_status || 'Not sent'}</p>
          </div>
        </div>
        {request.last_customer_status_email_status === 'failed' && request.last_customer_status_email_error && (
          <p className="mt-3 text-xs text-red-700">{request.last_customer_status_email_error}</p>
        )}
      </div>

      <RFQPublicStatusEditor request={request} onRequestUpdated={onRequestUpdated} />

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-accent" aria-label="Loading customer updates" />
        </div>
      ) : (
        <>
          <CustomerStatusEmailDraftGenerator
            publicStatus={publicStatus}
            customerMessage={customerMessage}
            onPublicStatusChange={(value) => {
              setPublicStatus(value);
              if (!customerMessage.trim() || customerMessage === getDefaultCustomerStatusMessage(publicStatus)) {
                setCustomerMessage(getDefaultCustomerStatusMessage(value));
              }
            }}
            onCustomerMessageChange={setCustomerMessage}
            onGenerate={handleGenerate}
          />

          <CustomerStatusEmailPreview
            draft={activeDraft}
            onChange={setActiveDraft}
            onSave={handleSaveDraft}
            onMarkReady={handleMarkReady}
            saving={saving}
            markingReady={markingReady}
          />

          <CustomerStatusEmailSendButton
            customerEmail={request.email}
            draft={activeDraft}
            onSend={handleSend}
            sending={sending}
            sendResult={sendResult}
          />

          <CustomerStatusEmailHistory
            drafts={drafts}
            events={events}
            onLoadDraft={handleLoadDraft}
            onArchiveDraft={handleArchiveDraft}
            archivingId={archivingId}
          />
        </>
      )}
    </div>
  );
}
