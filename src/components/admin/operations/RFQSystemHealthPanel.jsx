import { Activity, Clock3, Mail, Search, Upload } from 'lucide-react';
import RFQOperationsStatusBadge from './RFQOperationsStatusBadge';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const HEALTH_LABELS = {
  healthy: 'Healthy',
  attention: 'Attention Needed',
  critical: 'Critical',
};

export default function RFQSystemHealthPanel({ health, healthState }) {
  const metrics = [
    { label: 'RFQs Last 24h', value: health?.rfqs_last_24h ?? 0, icon: Activity },
    { label: 'Uploaded Files Last 24h', value: health?.uploaded_files_last_24h ?? 0, icon: Upload },
    { label: 'Customer Reuploads Last 24h', value: health?.customer_reuploads_last_24h ?? 0, icon: Upload },
    { label: 'Failed Emails Last 24h', value: health?.failed_email_count_last_24h ?? 0, icon: Mail },
    { label: 'Lookup Events Last 24h', value: health?.lookup_events_last_24h ?? 0, icon: Search },
    { label: 'Failed Lookups Last 24h', value: health?.failed_lookup_events_last_24h ?? 0, icon: Search },
  ];

  const timestamps = [
    { label: 'Latest RFQ Received', value: health?.latest_rfq_created_at },
    { label: 'Latest Customer Reupload', value: health?.latest_customer_reupload_at },
    { label: 'Latest Email Sent', value: health?.latest_email_sent_at },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-metallic">System Health</p>
          <h3 className="mt-1 text-lg font-bold text-charcoal">Platform Telemetry</h3>
        </div>
        <RFQOperationsStatusBadge status={healthState} label={HEALTH_LABELS[healthState] ?? healthState} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-metallic">
              <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
              {label}
            </div>
            <p className="mt-2 text-2xl font-bold text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
        {timestamps.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-slate-100 px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-metallic">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </p>
            <p className="mt-1 text-sm font-medium text-charcoal">{formatDate(value)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
