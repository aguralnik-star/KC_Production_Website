import TestimonialStatusBadge from './TestimonialStatusBadge';

export default function TestimonialRequestHistory({ logs = [] }) {
  if (!logs.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Request history">
      <h3 className="text-lg font-bold text-charcoal">Request History</h3>
      <ul className="mt-4 space-y-3">
        {logs.map((log) => (
          <li key={log.id} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-charcoal">{log.customer_name || 'Unknown customer'}</p>
              <TestimonialStatusBadge status={log.status} />
            </div>
            <p className="mt-1 text-xs text-metallic">{log.customer_email} · {log.customer_company}</p>
            <p className="mt-1 text-xs text-metallic">{new Date(log.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
