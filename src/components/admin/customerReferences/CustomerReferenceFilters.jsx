import { REFERENCE_STATUSES, RELATIONSHIP_TYPES } from '../../../data/customerReferencePermissionData';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function CustomerReferenceFilters({ filters, onChange, onCreate, creating }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Customer reference filters">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic xl:col-span-2">
          Search
          <input
            type="search"
            value={filters.search ?? ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Name, company, or email"
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Reference Status
          <select
            value={filters.reference_status ?? ''}
            onChange={(e) => onChange({ ...filters, reference_status: e.target.value || undefined })}
            className={`mt-1 ${inputClass}`}
          >
            <option value="">All</option>
            {REFERENCE_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Relationship
          <select
            value={filters.relationship_type ?? ''}
            onChange={(e) => onChange({ ...filters, relationship_type: e.target.value || undefined })}
            className={`mt-1 ${inputClass}`}
          >
            <option value="">All</option>
            {RELATIONSHIP_TYPES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Industry
          <input
            type="text"
            value={filters.industry ?? ''}
            onChange={(e) => onChange({ ...filters, industry: e.target.value || undefined })}
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Do Not Contact
          <select
            value={filters.do_not_contact ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                ...filters,
                do_not_contact: val === '' ? undefined : val === 'true',
              });
            }}
            className={`mt-1 ${inputClass}`}
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onCreate}
          disabled={creating}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {creating ? 'Creating…' : 'New Customer Reference'}
        </button>
      </div>
    </section>
  );
}
