import { AlertTriangle, CheckCircle2, Radar } from 'lucide-react';

const STATUS_STYLES = {
  healthy: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  attention_needed: 'border-amber-200 bg-amber-50 text-amber-900',
  critical: 'border-red-200 bg-red-50 text-red-900',
};

const STATUS_LABELS = {
  healthy: 'Healthy',
  attention_needed: 'Attention Needed',
  critical: 'Critical',
};

export default function PostLaunchExecutiveSummary({ status, launchDay, refreshedAt, kpi }) {
  const Icon = status === 'healthy' ? CheckCircle2 : AlertTriangle;

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Radar className="h-3.5 w-3.5" aria-hidden="true" />
            Post-Launch Week 1
          </div>
          <h2 className="mt-3 text-3xl font-bold">7-Day Monitoring Dashboard</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-200">
            Track RFQ performance, conversion bottlenecks, page engagement placeholders, and launch-week actions during
            the first seven days after go-live.
          </p>
        </div>

        <div className="space-y-3">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.attention_needed}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
            {STATUS_LABELS[status] ?? status}
          </span>
          <p className="text-sm text-slate-300">Launch Day {launchDay} of 7</p>
          {refreshedAt ? (
            <p className="text-xs text-slate-400">
              Updated {new Date(refreshedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-300">RFQs This Week</p>
          <p className="mt-1 text-2xl font-bold">{kpi?.rfqs_last_7_days ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-300">Open Issues</p>
          <p className="mt-1 text-2xl font-bold">{kpi?.open_issues ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-300">Failed Emails</p>
          <p className="mt-1 text-2xl font-bold">{kpi?.failed_emails ?? 0}</p>
        </div>
      </div>
    </section>
  );
}
