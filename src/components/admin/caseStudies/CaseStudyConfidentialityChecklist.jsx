const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function CaseStudyConfidentialityChecklist({ caseStudy, onChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:break-inside-avoid" aria-label="Customer approval">
      <h3 className="text-lg font-bold text-charcoal">3. Customer Approval</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={Boolean(caseStudy.customer_approval_received)}
            onChange={(e) => onChange({ customer_approval_received: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-accent"
          />
          Customer approval received
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Customer approval date
          <input
            type="date"
            value={caseStudy.customer_approval_date ?? ''}
            onChange={(e) => onChange({ customer_approval_date: e.target.value || null })}
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={Boolean(caseStudy.photo_approval_received)}
            onChange={(e) => onChange({ photo_approval_received: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-accent"
          />
          Photo approval received
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Photo approval date
          <input
            type="date"
            value={caseStudy.photo_approval_date ?? ''}
            onChange={(e) => onChange({ photo_approval_date: e.target.value || null })}
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={Boolean(caseStudy.confidentiality_review_complete)}
            onChange={(e) => onChange({ confidentiality_review_complete: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-accent"
          />
          Confidentiality review complete
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={Boolean(caseStudy.approved_for_public_use)}
            onChange={(e) => onChange({ approved_for_public_use: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-accent"
          />
          Approved for public use
        </label>
      </div>
    </section>
  );
}
