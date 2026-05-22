import CustomerReferenceStatusBadge from './CustomerReferenceStatusBadge';
import DoNotContactBadge from './DoNotContactBadge';
import { PUBLIC_DISPLAY_MODES, summarizePermissionState } from '../../../data/customerReferencePermissionData';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function displayModeLabel(mode) {
  return PUBLIC_DISPLAY_MODES.find((m) => m.value === mode)?.label ?? mode;
}

export default function CustomerReferenceTable({ references, permissionsByRef, linkedCounts, lastActivity, onSelect, selectedId }) {
  if (!references.length) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-metallic">No customer references match the current filters.</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label="Customer references table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-metallic">
            <tr>
              <th scope="col" className="px-4 py-3">Customer</th>
              <th scope="col" className="px-4 py-3">Company</th>
              <th scope="col" className="px-4 py-3">Role</th>
              <th scope="col" className="px-4 py-3">Industry</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Display Mode</th>
              <th scope="col" className="px-4 py-3">Permissions</th>
              <th scope="col" className="px-4 py-3">Linked</th>
              <th scope="col" className="px-4 py-3">DNC</th>
              <th scope="col" className="px-4 py-3">Last Activity</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {references.map((ref) => {
              const perms = permissionsByRef[ref.id] ?? [];
              const summary = summarizePermissionState(perms);
              const linked = linkedCounts[ref.id] ?? { testimonials: 0, caseStudies: 0, photos: 0 };
              return (
                <tr
                  key={ref.id}
                  className={`border-b border-slate-100 ${selectedId === ref.id ? 'bg-accent/5' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-4 py-3 font-medium text-charcoal">{ref.customer_name || '—'}</td>
                  <td className="px-4 py-3 text-charcoal">{ref.customer_company || '—'}</td>
                  <td className="px-4 py-3 text-charcoal">{ref.customer_role || '—'}</td>
                  <td className="px-4 py-3 text-charcoal">{ref.industry || '—'}</td>
                  <td className="px-4 py-3"><CustomerReferenceStatusBadge status={ref.reference_status} /></td>
                  <td className="px-4 py-3 text-charcoal">{displayModeLabel(ref.public_display_mode)}</td>
                  <td className="px-4 py-3 text-xs font-medium text-charcoal">{summary}</td>
                  <td className="px-4 py-3 text-xs text-charcoal">
                    {linked.testimonials}T · {linked.caseStudies}CS · {linked.photos}P
                  </td>
                  <td className="px-4 py-3"><DoNotContactBadge active={ref.do_not_contact} /></td>
                  <td className="px-4 py-3 text-charcoal">{formatDate(lastActivity[ref.id])}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSelect(ref.id)}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-charcoal hover:border-accent"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
