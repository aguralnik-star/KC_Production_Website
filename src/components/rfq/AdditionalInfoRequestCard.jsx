function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function DetailBlock({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">{label}</dt>
      <dd className="mt-1 text-sm text-charcoal whitespace-pre-wrap">{children}</dd>
    </div>
  );
}

export default function AdditionalInfoRequestCard({ requestData }) {
  if (!requestData) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">RFQ Reference</p>
        <p className="mt-1 text-lg font-bold text-charcoal">{requestData.reference_number}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <DetailBlock label="Expiration Date">{formatDate(requestData.expires_at)}</DetailBlock>
        <DetailBlock label="Project Type">{requestData.project_type || '—'}</DetailBlock>
        <DetailBlock label="Material">{requestData.material || '—'}</DetailBlock>
        <DetailBlock label="Quantity">{requestData.quantity || '—'}</DetailBlock>
        <DetailBlock label="Timeline">{requestData.timeline || '—'}</DetailBlock>
      </dl>

      {requestData.requested_items && (
        <div className="mt-4">
          <DetailBlock label="Requested Items">{requestData.requested_items}</DetailBlock>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Message from K&amp;C</p>
        <p className="mt-2 text-sm leading-relaxed text-charcoal whitespace-pre-wrap">{requestData.message}</p>
      </div>
    </section>
  );
}
