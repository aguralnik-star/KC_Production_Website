import { formatHours } from '../../services/postLaunchMonitoringService';

export default function PostLaunchRFQMetrics({ metrics }) {
  const rows = [
    { label: 'New RFQs today', value: metrics?.rfqsToday ?? 0 },
    { label: 'New RFQs this week', value: metrics?.rfqsThisWeek ?? 0 },
    {
      label: 'RFQ abandonment rate',
      value: metrics?.abandonmentRate != null ? `${metrics.abandonmentRate}%` : '—',
    },
    {
      label: 'RFQ completion rate',
      value: metrics?.completionRate != null ? `${metrics.completionRate}%` : '—',
    },
    { label: 'Average quote turnaround', value: formatHours(metrics?.avgQuoteTurnaroundHours) },
    { label: 'Additional info requests', value: metrics?.additionalInfoRequests ?? 0 },
    { label: 'Customer reuploads', value: metrics?.customerReuploads ?? 0 },
    { label: 'Public lookup usage', value: metrics?.publicLookupUsage ?? 0 },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">RFQ Monitoring</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">RFQ Performance</h3>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-metallic">{label}</dt>
            <dd className="mt-1 text-xl font-bold text-charcoal">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
