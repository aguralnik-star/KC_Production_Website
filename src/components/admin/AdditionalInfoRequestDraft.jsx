import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Plus, Send, XCircle } from 'lucide-react';
import {
  REQUEST_TYPES,
  REQUESTED_ITEM_TEMPLATES,
  buildDefaultAdditionalInfoDraft,
  cancelAdditionalInfoRequest,
  createAdditionalInfoRequestDraft,
  saveAdditionalInfoRequest,
  sendAdditionalInfoRequest,
} from '../../services/additionalInfoAdminService';

function toDateTimeLocalValue(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AdditionalInfoRequestDraft({
  request,
  activeDraft,
  onDraftChange,
  onCreated,
  onSaved,
  onSent,
  onCanceled,
}) {
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (activeDraft) {
      setDraft(activeDraft);
      setError('');
      setSuccess('');
    } else {
      setDraft(null);
    }
  }, [activeDraft]);

  const updateDraft = (updates) => {
    const nextDraft = { ...(draft ?? {}), ...updates };
    setDraft(nextDraft);
    onDraftChange?.(nextDraft);
  };

  const handleCreate = async () => {
    if (!request?.id) return;
    setCreating(true);
    setError('');
    setSuccess('');
    try {
      const created = await createAdditionalInfoRequestDraft(
        request.id,
        buildDefaultAdditionalInfoDraft(request),
      );
      setDraft(created);
      onCreated?.(created);
      setSuccess('Draft created.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create draft.');
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    if (!draft?.id) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const saved = await saveAdditionalInfoRequest(draft.id, {
        request_type: draft.request_type,
        subject: draft.subject,
        message: draft.message,
        requested_items: draft.requested_items,
        expires_at: draft.expires_at,
        customer_email: draft.customer_email ?? request.email,
      });
      setDraft(saved);
      onSaved?.(saved);
      setSuccess('Draft saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!draft?.id) return;
    setSending(true);
    setError('');
    setSuccess('');
    try {
      let currentDraft = draft;
      if (['draft', 'failed'].includes(draft.status)) {
        currentDraft = await saveAdditionalInfoRequest(draft.id, {
          request_type: draft.request_type,
          subject: draft.subject,
          message: draft.message,
          requested_items: draft.requested_items,
          expires_at: draft.expires_at,
          customer_email: draft.customer_email ?? request.email,
        });
        setDraft(currentDraft);
      }

      const result = await sendAdditionalInfoRequest(currentDraft.id);
      onSent?.(result);
      setSuccess('Additional information request email sent.');
      setDraft(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send request.');
    } finally {
      setSending(false);
    }
  };

  const handleCancel = async () => {
    if (!draft?.id) return;
    setCanceling(true);
    setError('');
    setSuccess('');
    try {
      const canceled = await cancelAdditionalInfoRequest(draft.id);
      onCanceled?.(canceled);
      setDraft(null);
      setSuccess('Request canceled.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to cancel request.');
    } finally {
      setCanceling(false);
    }
  };

  const appendRequestedItem = (item) => {
    const current = draft?.requested_items ?? '';
    updateDraft({
      requested_items: current ? `${current}\n${item}` : item,
    });
  };

  const editable = draft && ['draft', 'failed'].includes(draft.status);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-charcoal">Request Additional Information</h3>
          <p className="mt-1 text-xs text-metallic">
            Create a draft, review the message, then explicitly send the secure upload link to the customer.
          </p>
        </div>
        {!draft && (
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            New Request
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          {success}
        </p>
      )}

      {draft && (
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="additional-info-type" className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                Request Type
              </label>
              <select
                id="additional-info-type"
                value={draft.request_type}
                onChange={(event) => updateDraft({ request_type: event.target.value })}
                disabled={!editable}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              >
                {REQUEST_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="additional-info-expires" className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                Expiration Date
              </label>
              <input
                id="additional-info-expires"
                type="datetime-local"
                value={toDateTimeLocalValue(draft.expires_at)}
                onChange={(event) => updateDraft({ expires_at: new Date(event.target.value).toISOString() })}
                disabled={!editable}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="additional-info-subject" className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Email Subject
            </label>
            <input
              id="additional-info-subject"
              type="text"
              value={draft.subject}
              onChange={(event) => updateDraft({ subject: event.target.value })}
              disabled={!editable}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor="additional-info-message" className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Customer Message
            </label>
            <textarea
              id="additional-info-message"
              rows={5}
              value={draft.message}
              onChange={(event) => updateDraft({ message: event.target.value })}
              disabled={!editable}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor="additional-info-items" className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Requested Items
            </label>
            <textarea
              id="additional-info-items"
              rows={4}
              value={draft.requested_items ?? ''}
              onChange={(event) => updateDraft({ requested_items: event.target.value })}
              disabled={!editable}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
            {editable && (
              <div className="mt-2 flex flex-wrap gap-2">
                {REQUESTED_ITEM_TEMPLATES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => appendRequestedItem(item)}
                    className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-charcoal hover:border-accent hover:text-accent"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {editable && (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || sending}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || saving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Send Request Email
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={canceling}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {canceling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  Cancel Request
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
