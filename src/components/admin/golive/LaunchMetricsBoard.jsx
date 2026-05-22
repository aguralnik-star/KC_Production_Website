const METRICS = [
  { key: 'visitorsToday', label: 'Visitors Today', fallback: '—' },
  { key: 'rfqsToday', label: 'RFQs Submitted Today' },
  { key: 'rfqsThisWeek', label: 'RFQs Submitted This Week' },
  { key: 'rfqCompletionRate', label: 'RFQ Completion Rate', suffix: '%', fallback: '—' },
  { key: 'quoteOpportunitiesOpen', label: 'Quote Opportunities Open' },
  { key: 'followUpsDue', label: 'Follow-Ups Due' },
  { key: 'failedEmails', label: 'Failed Emails' },
  { key: 'failedUploads', label: 'Failed Uploads', fallback: '—' },
  { key: 'openIssues', label: 'Open Issues' },
  { key: 'criticalIssues', label: 'Critical Issues' },
];

export default function LaunchMetricsBoard({ metrics }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Launch metrics board">
      {METRICS.map(({ key, label, suffix = '', fallback }) => {
        const raw = metrics?.[key];
        const value = raw == null || raw === '' ? fallback ?? '0' : `${raw}${suffix}`;
        const isAlert = (key === 'criticalIssues' && Number(raw) > 0)
          || (key === 'failedEmails' && Number(raw) > 0)
          || (key === 'openIssues' && Number(raw) > 0);

        return (
          <article
            key={key}
            className={`rounded-2xl border p-5 shadow-sm ${isAlert ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-metallic">{label}</p>
            <p className="mt-2 text-2xl font-bold text-charcoal">{value}</p>
          </article>
        );
      })}
    </section>
  );
}
