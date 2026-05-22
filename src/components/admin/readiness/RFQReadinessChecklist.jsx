import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import RFQReadinessStatusBadge from './RFQReadinessStatusBadge';
import RFQReadinessEvidenceModal from './RFQReadinessEvidenceModal';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function RFQReadinessChecklist({
  checks = [],
  updatingId = null,
  onUpdateStatus,
  onSaveEvidence,
}) {
  const [evidenceCheck, setEvidenceCheck] = useState(null);

  if (!checks.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-charcoal">No checklist items yet</p>
        <p className="mt-2 text-sm text-metallic">Run a production readiness review to initialize the QA checklist.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Category', 'Check', 'Status', 'Evidence', 'Completed Date', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-metallic"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {checks.map((check) => (
                <tr key={check.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-charcoal">{check.category}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{check.check_name}</p>
                    {check.check_description && (
                      <p className="mt-1 text-xs text-metallic">{check.check_description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <RFQReadinessStatusBadge status={check.status} />
                  </td>
                  <td className="max-w-xs px-4 py-3 text-metallic">
                    {check.evidence ? (
                      <span className="line-clamp-2">{check.evidence}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-metallic">{formatDate(check.completed_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {['passed', 'failed', 'not_applicable'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={updatingId === check.id}
                          onClick={() => onUpdateStatus(check, status)}
                          className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent disabled:opacity-50"
                        >
                          {status === 'passed' ? 'Pass' : status === 'failed' ? 'Fail' : 'N/A'}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setEvidenceCheck(check)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
                      >
                        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                        Evidence
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {checks.map((check) => (
          <article key={check.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-metallic">{check.category}</p>
                <h3 className="mt-1 font-semibold text-charcoal">{check.check_name}</h3>
              </div>
              <RFQReadinessStatusBadge status={check.status} />
            </div>
            {check.check_description && (
              <p className="mt-2 text-sm text-metallic">{check.check_description}</p>
            )}
            {check.evidence && (
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-charcoal">{check.evidence}</p>
            )}
            <p className="mt-2 text-xs text-metallic">Completed {formatDate(check.completed_at)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['passed', 'failed', 'not_applicable'].map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={updatingId === check.id}
                  onClick={() => onUpdateStatus(check, status)}
                  className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-charcoal disabled:opacity-50"
                >
                  {status === 'passed' ? 'Pass' : status === 'failed' ? 'Fail' : 'N/A'}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setEvidenceCheck(check)}
                className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-charcoal"
              >
                Evidence
              </button>
            </div>
            {updatingId === check.id && (
              <div className="mt-2 inline-flex items-center gap-2 text-xs text-metallic">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                Saving…
              </div>
            )}
          </article>
        ))}
      </div>

      <RFQReadinessEvidenceModal
        check={evidenceCheck}
        open={Boolean(evidenceCheck)}
        onClose={() => setEvidenceCheck(null)}
        onSave={async (evidence) => {
          await onSaveEvidence(evidenceCheck, evidence);
          setEvidenceCheck(null);
        }}
      />
    </>
  );
}
