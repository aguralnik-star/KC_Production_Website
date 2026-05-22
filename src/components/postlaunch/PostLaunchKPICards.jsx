import { formatHours } from '../../services/postLaunchMonitoringService';

const CARDS = [
  { key: 'rfqs_last_7_days', label: 'RFQs Received', suffix: '' },
  { key: 'quote_conversion_rate', label: 'RFQ Conversion Rate', suffix: '%' },
  { key: 'avg_response_time', label: 'Average Response Time', format: formatHours },
  { key: 'open_issues', label: 'Open Issues', suffix: '' },
  { key: 'failed_emails', label: 'Failed Emails', suffix: '' },
  { key: 'quote_requests', label: 'Opportunities Open', suffix: '' },
];

export default function PostLaunchKPICards({ kpi }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Post-launch KPI cards">
      {CARDS.map(({ key, label, suffix = '', format }) => {
        const raw = kpi?.[key] ?? 0;
        const value = format ? format(raw) : `${raw}${suffix}`;
        return (
          <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-metallic">{label}</p>
            <p className="mt-2 text-3xl font-bold text-charcoal">{value}</p>
          </article>
        );
      })}
    </section>
  );
}
