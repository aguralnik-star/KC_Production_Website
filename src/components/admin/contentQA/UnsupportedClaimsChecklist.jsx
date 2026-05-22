import { CLAIM_STATUS_OPTIONS, REPLACEMENT_LANGUAGE, UNSUPPORTED_CLAIM_GROUPS } from '../../../data/contentQAAuditData';
import ContentRiskBadge from './ContentRiskBadge';
import QAStatusBadge from '../mobileQA/QAStatusBadge';

export default function UnsupportedClaimsChecklist({ claimChecks = {}, onUpdateClaim }) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Unsupported Claims Audit</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Claims to Flag or Remove</h3>
        <p className="mt-2 text-sm text-metallic">
          Mark each claim as reviewed. Flag issues found in public copy and record evidence or replacement language.
        </p>
      </div>

      {UNSUPPORTED_CLAIM_GROUPS.map((group) => (
        <article key={group.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h4 className="text-base font-bold text-charcoal">{group.title}</h4>
          </div>

          <div className="divide-y divide-slate-100">
            {group.claims.map((claim) => {
              const check = claimChecks[claim.id] ?? { status: 'pending', notes: '', evidence: '' };

              return (
                <div key={claim.id} className="grid gap-4 px-6 py-4 lg:grid-cols-[1.4fr_0.8fr_1.2fr_1.2fr] lg:items-start">
                  <div>
                    <p className="font-medium text-charcoal">{claim.label}</p>
                    {claim.searchTerms?.length ? (
                      <p className="mt-1 text-xs text-metallic">Search: {claim.searchTerms.join(', ')}</p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <ContentRiskBadge risk={claim.risk} />
                    <QAStatusBadge status={check.status} />
                  </div>

                  <select
                    value={check.status}
                    onChange={(event) => onUpdateClaim(claim.id, { status: event.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    aria-label={`${claim.label} review status`}
                  >
                    {CLAIM_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={check.evidence}
                      onChange={(event) => onUpdateClaim(claim.id, { evidence: event.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Evidence / location"
                    />
                    <textarea
                      value={check.notes}
                      onChange={(event) => onUpdateClaim(claim.id, { notes: event.target.value })}
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Notes / resolution"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      ))}

      <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h4 className="font-bold text-emerald-900">Approved Replacement Language</h4>
        <ul className="mt-4 space-y-3">
          {REPLACEMENT_LANGUAGE.map((item) => (
            <li key={item.insteadOf} className="text-sm text-emerald-900">
              <span className="font-semibold">Instead of:</span> {item.insteadOf}
              <br />
              <span className="font-semibold">Use:</span> {item.use}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
