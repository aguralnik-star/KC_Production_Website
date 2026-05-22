import AccessibleButton from '../../AccessibleButton';

export default function TestimonialPublishPanel({ testimonial, publishReadiness, onPublish, onApprove, onArchive, publishing, saving }) {
  if (!testimonial) {
    return <p className="text-sm text-metallic">Select a testimonial to review publishing requirements.</p>;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Publishing panel">
      <h3 className="text-lg font-bold text-charcoal">Publishing</h3>

      {testimonial.status === 'published' ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Published {testimonial.published_at ? new Date(testimonial.published_at).toLocaleString() : ''}
        </p>
      ) : null}

      {!publishReadiness.canPublish ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3" role="alert">
          <p className="text-sm font-semibold text-amber-900">Publish blocked — missing requirements:</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
            {publishReadiness.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-sm text-emerald-700">All publish requirements met.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <AccessibleButton type="button" disabled={saving} onClick={onApprove} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal">
          Mark Approved
        </AccessibleButton>
        <AccessibleButton
          type="button"
          disabled={!publishReadiness.canPublish || publishing || testimonial.status === 'published'}
          onClick={onPublish}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {publishing ? 'Publishing…' : 'Publish Testimonial'}
        </AccessibleButton>
        <AccessibleButton type="button" disabled={saving} onClick={onArchive} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">
          Archive
        </AccessibleButton>
      </div>
    </section>
  );
}
