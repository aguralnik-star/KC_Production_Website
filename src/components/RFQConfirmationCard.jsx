import RFQReferenceBadge from './RFQReferenceBadge';

function formatSubmittedAt(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function DetailRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:grid-cols-[160px_1fr] print:border-charcoal/10">
      <dt className="text-sm font-medium text-metallic">{label}</dt>
      <dd className="text-sm text-charcoal">{value}</dd>
    </div>
  );
}

export default function RFQConfirmationCard({ confirmation }) {
  const {
    referenceNumber,
    submittedAt,
    company,
    name,
    email,
    projectType,
    timeline,
  } = confirmation;

  return (
    <article className="card print:border print:border-charcoal/20 print:shadow-none">
      <RFQReferenceBadge referenceNumber={referenceNumber} />

      <dl className="mt-8 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-5 print:border-charcoal/20">
        <DetailRow label="Submitted" value={formatSubmittedAt(submittedAt)} />
        <DetailRow label="Company" value={company} />
        <DetailRow label="Contact" value={name} />
        <DetailRow label="Email" value={email} />
        <DetailRow label="Project Type" value={projectType} />
        <DetailRow label="Timeline" value={timeline} />
      </dl>
    </article>
  );
}
