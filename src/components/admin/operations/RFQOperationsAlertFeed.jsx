import { ExternalLink } from 'lucide-react';
import RFQOperationsStatusBadge from './RFQOperationsStatusBadge';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function AlertList({ alerts, onOpenRfq }) {
  if (!alerts.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-metallic">
        No alerts in this severity band.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {alerts.map((alert, index) => (
        <li key={`${alert.alert_type}-${alert.rfq_request_id ?? 'global'}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <RFQOperationsStatusBadge status={alert.alert_level} label={alert.alert_level} />
                <h4 className="font-semibold text-charcoal">{alert.title}</h4>
              </div>
              <p className="mt-2 text-sm text-metallic">{alert.message}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-metallic">
                {alert.reference_number && <span>Ref: {alert.reference_number}</span>}
                {alert.company && <span>{alert.company}</span>}
                {alert.name && <span>{alert.name}</span>}
                <span>{formatDate(alert.created_at)}</span>
              </div>
            </div>
            {alert.rfq_request_id && (
              <button
                type="button"
                onClick={() => onOpenRfq?.(alert.rfq_request_id)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                {alert.action_label || 'Open RFQ'}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function RFQOperationsAlertFeed({ groupedAlerts, onOpenRfq }) {
  const sections = [
    { key: 'critical', label: 'Critical', alerts: groupedAlerts?.critical ?? [] },
    { key: 'warning', label: 'Warning', alerts: groupedAlerts?.warning ?? [] },
    { key: 'watch', label: 'Watch', alerts: groupedAlerts?.watch ?? [] },
  ];

  return (
    <section className="space-y-6">
      {sections.map(({ key, label, alerts }) => (
        <div key={key}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">{label}</h3>
            <RFQOperationsStatusBadge status={key} label={`${alerts.length} alert${alerts.length === 1 ? '' : 's'}`} />
          </div>
          <AlertList alerts={alerts} onOpenRfq={onOpenRfq} />
        </div>
      ))}
    </section>
  );
}
