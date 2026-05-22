import {
  PUBLIC_DISPLAY_MODES,
  REFERENCE_STATUSES,
  RELATIONSHIP_TYPES,
} from '../../../data/customerReferencePermissionData';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function CustomerReferenceEditor({ reference, onChange, onSave, onSetDoNotContact, saving }) {
  if (!reference) {
    return <p className="text-sm text-metallic">Select a customer reference to edit.</p>;
  }

  const set = (field, value) => onChange({ ...reference, [field]: value });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="reference-editor-heading">
      <h3 id="reference-editor-heading" className="text-lg font-bold text-charcoal">Customer Profile</h3>
      <form
        className="mt-4 grid gap-4 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Customer Name
          <input type="text" value={reference.customer_name ?? ''} onChange={(e) => set('customer_name', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Company
          <input type="text" value={reference.customer_company ?? ''} onChange={(e) => set('customer_company', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Email
          <input type="email" value={reference.customer_email ?? ''} onChange={(e) => set('customer_email', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Phone
          <input type="tel" value={reference.customer_phone ?? ''} onChange={(e) => set('customer_phone', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Role
          <input type="text" value={reference.customer_role ?? ''} onChange={(e) => set('customer_role', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Industry
          <input type="text" value={reference.industry ?? ''} onChange={(e) => set('industry', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Relationship Type
          <select value={reference.relationship_type} onChange={(e) => set('relationship_type', e.target.value)} className={`mt-1 ${inputClass}`}>
            {RELATIONSHIP_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Reference Status
          <select value={reference.reference_status} onChange={(e) => set('reference_status', e.target.value)} className={`mt-1 ${inputClass}`}>
            {REFERENCE_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic md:col-span-2">
          Public Display Mode
          <select value={reference.public_display_mode} onChange={(e) => set('public_display_mode', e.target.value)} className={`mt-1 ${inputClass}`}>
            {PUBLIC_DISPLAY_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Approved Display Name
          <input type="text" value={reference.approved_display_name ?? ''} onChange={(e) => set('approved_display_name', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Approved Company Display
          <input type="text" value={reference.approved_company_display ?? ''} onChange={(e) => set('approved_company_display', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic md:col-span-2">
          Approved Role Display
          <input type="text" value={reference.approved_role_display ?? ''} onChange={(e) => set('approved_role_display', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic md:col-span-2">
          Internal Notes
          <textarea rows={3} value={reference.internal_notes ?? ''} onChange={(e) => set('internal_notes', e.target.value)} className={`mt-1 ${inputClass}`} />
        </label>
        <div className="flex flex-wrap items-center gap-4 md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={Boolean(reference.do_not_contact)}
              onChange={(e) => onSetDoNotContact(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
            />
            Do not contact
          </label>
          <button type="submit" disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </section>
  );
}
