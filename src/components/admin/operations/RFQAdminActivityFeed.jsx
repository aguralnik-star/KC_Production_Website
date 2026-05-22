import { formatActivityType } from '../../../services/rfqOperationsService';
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

export default function RFQAdminActivityFeed({ activity = [] }) {
  if (!activity.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-lg font-semibold text-charcoal">No recent admin activity</p>
        <p className="mt-2 text-sm text-metallic">Workflow actions will appear here as the team works RFQs.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Admin Activity</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Latest Actions</h3>
      </div>

      <ul className="space-y-3">
        {activity.map((item, index) => (
          <li key={`${item.activity_type}-${item.activity_at}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <RFQOperationsStatusBadge status="watch" label={formatActivityType(item.activity_type)} />
              {item.reference_number && (
                <span className="text-xs font-semibold text-charcoal">{item.reference_number}</span>
              )}
              {item.company && <span className="text-xs text-metallic">{item.company}</span>}
            </div>
            <p className="mt-2 text-sm text-charcoal">{item.activity_summary}</p>
            <p className="mt-1 text-xs text-metallic">{formatDate(item.activity_at)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
