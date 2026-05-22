export default function ApprovalPreviewPanel({ subject, body }) {
  if (!subject && !body) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-metallic" aria-live="polite">
        Generate a draft to preview the email content here.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="approval-preview-heading">
      <h3 id="approval-preview-heading" className="text-sm font-bold uppercase tracking-wider text-metallic">
        Email Preview
      </h3>
      <dl className="mt-4 space-y-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Subject</dt>
          <dd className="mt-1 text-sm font-semibold text-charcoal">{subject}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Body</dt>
          <dd className="mt-1 whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-charcoal">
            {body}
          </dd>
        </div>
      </dl>
    </section>
  );
}
