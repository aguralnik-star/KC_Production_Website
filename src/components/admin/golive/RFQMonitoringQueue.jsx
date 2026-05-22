import { Link } from 'react-router-dom';
import { RFQ_MONITORING_STEPS, buildDefaultRfqMonitoring } from '../../../data/goLiveData';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export default function RFQMonitoringQueue({ recentRfqs, rfqMonitoring, onStepToggle, onMonitoringChange }) {
  if (!recentRfqs?.length) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="RFQ monitoring queue">
        <h3 className="text-lg font-bold text-charcoal">First RFQ Monitoring Queue</h3>
        <p className="mt-3 text-sm text-metallic">No RFQs submitted yet. Monitor this queue after the first production submission.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label="RFQ monitoring queue">
      <div>
        <h3 className="text-lg font-bold text-charcoal">First RFQ Monitoring Queue</h3>
        <p className="mt-1 text-sm text-metallic">
          Complete the 10-step workflow for every new RFQ during the first 30 days after launch.
        </p>
      </div>

      {recentRfqs.map((rfq) => {
        const tracking = rfqMonitoring?.[rfq.id] ?? buildDefaultRfqMonitoring(rfq.id);
        const completedSteps = RFQ_MONITORING_STEPS.filter((step) => tracking.steps?.[step.id]).length;

        return (
          <article key={rfq.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Reference</p>
                <p className="text-lg font-bold text-charcoal">{rfq.reference_number ?? rfq.id.slice(0, 8)}</p>
                <p className="mt-1 text-sm text-metallic">{rfq.company_name ?? 'Unknown company'}</p>
                <p className="text-xs text-metallic">Submitted {formatDate(rfq.created_at)} · Status: {rfq.status}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-charcoal">
                  {completedSteps}/{RFQ_MONITORING_STEPS.length} steps
                </span>
                <Link
                  to={`/admin/rfqs?rfq=${rfq.id}`}
                  className="rounded-lg border border-accent px-3 py-1 text-xs font-semibold text-accent hover:bg-accent hover:text-white"
                >
                  Open in Admin
                </Link>
              </div>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {RFQ_MONITORING_STEPS.map((step) => (
                <label key={step.id} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={Boolean(tracking.steps?.[step.id])}
                    onChange={(event) => onStepToggle(rfq.id, step.id, event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                  />
                  <span className="text-xs text-charcoal">{step.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                Review Owner
                <input
                  type="text"
                  value={tracking.reviewOwner ?? ''}
                  onChange={(event) => onMonitoringChange(rfq.id, { reviewOwner: event.target.value })}
                  placeholder="Assign reviewer"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                Outcome
                <select
                  value={tracking.outcome ?? ''}
                  onChange={(event) => onMonitoringChange(rfq.id, { outcome: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">Select outcome</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
            </div>

            <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-metallic">
              Review Notes
              <textarea
                value={tracking.notes ?? ''}
                onChange={(event) => onMonitoringChange(rfq.id, { notes: event.target.value })}
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </label>
          </article>
        );
      })}
    </section>
  );
}
