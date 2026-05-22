import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Loader2, RefreshCw, Send } from 'lucide-react';
import AccessibleButton from '../../AccessibleButton';
import FactoraOSSyncStatusBadge from './FactoraOSSyncStatusBadge';
import {
  getFactoraOSSyncEvents,
  retryFactoraOSSync,
  sendRFQToFactoraOS,
} from '../../../services/factoraOSIntegrationService';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function FactoraOSSyncPanel({ rfqRequestId, crmConverted }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const loadEvents = useCallback(async () => {
    if (!rfqRequestId || !crmConverted) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = await getFactoraOSSyncEvents(rfqRequestId);
      setEvents(rows);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load sync status.');
    } finally {
      setLoading(false);
    }
  }, [rfqRequestId, crmConverted]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  if (!crmConverted) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-metallic">
        Convert this RFQ to a local CRM record before sending to FactoraOS.
      </section>
    );
  }

  const latest = events[0] ?? null;

  const handleSend = async () => {
    setSending(true);
    setError('');
    try {
      await sendRFQToFactoraOS(rfqRequestId);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send to FactoraOS.');
      await loadEvents();
    } finally {
      setSending(false);
    }
  };

  const handleRetry = async () => {
    if (!latest?.id) return;
    setSending(true);
    setError('');
    try {
      await retryFactoraOSSync(latest.id);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to retry sync.');
      await loadEvents();
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="factoraos-sync-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="factoraos-sync-heading" className="text-sm font-bold text-charcoal">FactoraOS CRM Intake</h3>
          <p className="mt-1 text-xs text-metallic">
            Sends RFQ to FactoraOS intake queue for review. Does not auto-create customers in FactoraOS.
          </p>
        </div>
        {latest ? <FactoraOSSyncStatusBadge status={latest.sync_status} /> : null}
      </div>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-metallic">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading sync status…
        </div>
      ) : (
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Last Sync</dt>
            <dd className="text-charcoal">{formatDate(latest?.synced_at || latest?.sync_attempted_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Intake ID</dt>
            <dd className="font-mono text-xs text-charcoal">{latest?.factoraos_intake_id || '—'}</dd>
          </div>
        </dl>
      )}

      {latest?.error_message ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {latest.error_message}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <AccessibleButton
          type="button"
          onClick={handleSend}
          disabled={sending || latest?.sync_status === 'sent'}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {sending ? 'Sending…' : 'Send to FactoraOS'}
        </AccessibleButton>
        {latest?.sync_status === 'failed' ? (
          <AccessibleButton
            type="button"
            onClick={handleRetry}
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Retry Sync
          </AccessibleButton>
        ) : null}
      </div>
    </section>
  );
}
