import { ExternalLink, ListOrdered } from 'lucide-react';
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

export default function RFQOperationsActionQueue({ actionQueue = [], onOpenRfq }) {
  if (!actionQueue.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <ListOrdered className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
        <p className="mt-4 text-lg font-semibold text-charcoal">Action queue clear</p>
        <p className="mt-2 text-sm text-metallic">No prioritized operational actions require immediate attention.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Action Queue</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Prioritized Operations Tasks</h3>
      </div>

      <ol className="space-y-3">
        {actionQueue.map((item, index) => (
          <li key={`${item.alert_type}-${item.rfq_request_id ?? 'global'}-${index}`} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal text-sm font-bold text-white">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <RFQOperationsStatusBadge status={item.alert_level} label={item.alert_level} />
                <h4 className="font-semibold text-charcoal">{item.title}</h4>
              </div>
              <p className="mt-1 text-sm text-metallic">{item.message}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-metallic">
                {item.reference_number && <span>{item.reference_number}</span>}
                {item.company && <span>{item.company}</span>}
                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>
            {item.rfq_request_id && (
              <button
                type="button"
                onClick={() => onOpenRfq?.(item.rfq_request_id)}
                className="inline-flex h-fit shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Open RFQ
              </button>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
