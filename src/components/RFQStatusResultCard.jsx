import RFQPublicStatusBadge from './RFQPublicStatusBadge';
import RFQStatusTimeline from './RFQStatusTimeline';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function DetailRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:grid-cols-[160px_1fr]">
      <dt className="text-sm font-medium text-metallic">{label}</dt>
      <dd className="text-sm text-charcoal">{value}</dd>
    </div>
  );
}

export default function RFQStatusResultCard({ result }) {
  return (
    <article className="card space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-metallic">Reference Number</p>
          <p className="mt-1 font-mono text-xl font-bold text-charcoal">{result.reference_number}</p>
        </div>
        <RFQPublicStatusBadge
          status={result.public_status}
          label={result.customer_status_label}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm leading-relaxed text-charcoal">{result.customer_status_message}</p>
      </div>

      <RFQStatusTimeline publicStatus={result.public_status} />

      <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-5">
        <DetailRow label="Submitted" value={formatDate(result.submitted_at)} />
        <DetailRow label="Last Update" value={formatDate(result.last_updated_public_date)} />
        <DetailRow label="Contact" value={result.name} />
        <DetailRow label="Company" value={result.company} />
        <DetailRow label="Project Type" value={result.project_type} />
        <DetailRow label="Material" value={result.material} />
        <DetailRow label="Quantity" value={result.quantity} />
        <DetailRow label="Timeline" value={result.timeline} />
      </dl>
    </article>
  );
}
