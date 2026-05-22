import { CUSTOMER_DISPLAY_MODES, slugifyTitle } from '../../../data/caseStudyData';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function CaseStudyEditor({ caseStudy, onChange }) {
  const handleTitleChange = (title) => {
    onChange({
      title,
      slug: caseStudy.slug || slugifyTitle(title),
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Case study details">
      <h3 className="text-lg font-bold text-charcoal">1. Case Study Details</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input type="text" value={caseStudy.title ?? ''} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Slug">
          <input type="text" value={caseStudy.slug ?? ''} onChange={(e) => onChange({ slug: slugifyTitle(e.target.value) })} className={inputClass} />
        </Field>
        <Field label="Customer Display Mode">
          <select value={caseStudy.customer_display_mode ?? 'anonymous'} onChange={(e) => onChange({ customer_display_mode: e.target.value })} className={inputClass}>
            {CUSTOMER_DISPLAY_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Industry">
          <input type="text" value={caseStudy.industry ?? ''} onChange={(e) => onChange({ industry: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Capability">
          <input type="text" value={caseStudy.capability ?? ''} onChange={(e) => onChange({ capability: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Material">
          <input type="text" value={caseStudy.material ?? ''} onChange={(e) => onChange({ material: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Process">
          <input type="text" value={caseStudy.process ?? ''} onChange={(e) => onChange({ process: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Public Summary">
          <textarea value={caseStudy.public_summary ?? ''} onChange={(e) => onChange({ public_summary: e.target.value })} rows={3} className={inputClass} />
        </Field>
      </div>

      <h4 className="mt-6 text-base font-bold text-charcoal">Customer Fields (Internal — Not Published Directly)</h4>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <Field label="Customer Name">
          <input type="text" value={caseStudy.customer_name ?? ''} onChange={(e) => onChange({ customer_name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Customer Company">
          <input type="text" value={caseStudy.customer_company ?? ''} onChange={(e) => onChange({ customer_company: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Approved Public Display Name">
          <input type="text" value={caseStudy.approved_customer_display_name ?? ''} onChange={(e) => onChange({ approved_customer_display_name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Approved Public Company Name">
          <input type="text" value={caseStudy.approved_company_display_name ?? ''} onChange={(e) => onChange({ approved_company_display_name: e.target.value })} className={inputClass} />
        </Field>
      </div>

      <h4 className="mt-6 text-base font-bold text-charcoal">2. Challenge / Solution / Result</h4>
      <div className="mt-3 grid gap-4">
        <Field label="Challenge">
          <textarea value={caseStudy.challenge ?? ''} onChange={(e) => onChange({ challenge: e.target.value })} rows={4} className={inputClass} />
        </Field>
        <Field label="Solution">
          <textarea value={caseStudy.solution ?? ''} onChange={(e) => onChange({ solution: e.target.value })} rows={4} className={inputClass} />
        </Field>
        <Field label="Result">
          <textarea value={caseStudy.result ?? ''} onChange={(e) => onChange({ result: e.target.value })} rows={4} className={inputClass} />
        </Field>
        <Field label="Internal Notes">
          <textarea value={caseStudy.internal_notes ?? ''} onChange={(e) => onChange({ internal_notes: e.target.value })} rows={3} className={inputClass} />
        </Field>
      </div>
    </section>
  );
}
