import { ExternalLink, ShieldOff, ShieldCheck } from 'lucide-react';
import RFQAlertBadge from './RFQAlertBadge';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function RFQOverdueAlerts({
  alerts,
  onDismiss,
  onResolve,
  onOpenRfq,
  busyId,
}) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
        <p className="text-sm font-medium text-charcoal">No critical alerts.</p>
        <p className="mt-1 text-sm text-metallic">Open alerts will appear here when RFQs need attention.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const rfq = alert.rfq_requests;
        const isCritical = alert.alert_level === 'critical';

        return (
          <article
            key={alert.id}
            className={`rounded-xl border bg-white p-4 shadow-sm ${
              isCritical ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <RFQAlertBadge level={alert.alert_level} />
                  <h4 className={`font-semibold ${isCritical ? 'text-red-900' : 'text-charcoal'}`}>
                    {alert.title}
                  </h4>
                </div>
                <p className="mt-2 text-sm text-charcoal">{alert.message}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-metallic">
                  <span>{rfq?.company || 'Unknown company'}</span>
                  <span>{rfq?.name || 'Unknown contact'}</span>
                  <span>Created {formatDate(alert.created_at)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenRfq(alert.rfq_request_id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-charcoal hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  Open RFQ
                </button>
                <button
                  type="button"
                  onClick={() => onDismiss(alert.id)}
                  disabled={busyId === alert.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-charcoal hover:bg-slate-50 disabled:opacity-50"
                >
                  <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => onResolve(alert.id)}
                  disabled={busyId === alert.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Resolve
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
