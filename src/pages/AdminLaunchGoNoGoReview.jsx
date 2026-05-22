import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, ClipboardList, Loader2, Printer, ShieldAlert } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import AccessibleButton from '../components/AccessibleButton';
import {
  DECISION_OPTIONS,
  deriveRecommendedDecision,
  loadLaunchGoNoGoReview,
  saveLaunchGoNoGoReview,
  summarizeGoNoGoReview,
} from '../services/launchGoNoGoService';

const STATUS_STYLES = {
  pass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  fail: 'border-red-200 bg-red-50 text-red-800',
  partial: 'border-amber-200 bg-amber-50 text-amber-800',
  not_tested: 'border-slate-200 bg-slate-100 text-slate-700',
};

const DECISION_STYLES = {
  go: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  conditional_go: 'border-amber-300 bg-amber-50 text-amber-900',
  no_go: 'border-red-300 bg-red-50 text-red-900',
};

function StatusBadge({ status }) {
  const label = status.replaceAll('_', ' ');
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.not_tested}`}>
      {label}
    </span>
  );
}

function DecisionBadge({ decision }) {
  const option = DECISION_OPTIONS.find((item) => item.value === decision);
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${DECISION_STYLES[decision] ?? DECISION_STYLES.no_go}`}>
      {option?.label ?? decision}
    </span>
  );
}

export default function AdminLaunchGoNoGoReview() {
  const { session, handleSignOut } = useOutletContext();
  const [review, setReview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setReview(loadLaunchGoNoGoReview());
  }, []);

  const summary = useMemo(() => (review ? summarizeGoNoGoReview(review) : null), [review]);
  const recommended = useMemo(() => (review ? deriveRecommendedDecision(review) : 'no_go'), [review]);

  const persistReview = (nextReview) => {
    setReview(nextReview);
    setSaving(true);
    try {
      saveLaunchGoNoGoReview(nextReview);
      setSavedMessage('Review saved locally.');
    } finally {
      setSaving(false);
      window.setTimeout(() => setSavedMessage(''), 2500);
    }
  };

  const updateCriterion = (area, updates) => {
    if (!review) return;
    persistReview({
      ...review,
      criteria: review.criteria.map((row) => (row.area === area ? { ...row, ...updates } : row)),
    });
  };

  const updateDecision = (decision) => {
    if (!review) return;
    persistReview({
      ...review,
      decision,
      reviewedAt: new Date().toISOString(),
      reviewedBy: session?.user?.email ?? review.reviewedBy,
    });
  };

  const updateFinalNotes = (finalNotes) => {
    if (!review) return;
    persistReview({ ...review, finalNotes });
  };

  if (!review || !summary) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Launch Go/No-Go Review">
        <div className="flex min-h-[320px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading go/no-go review" />
        </div>
      </AdminLayout>
    );
  }

  const selectedDecision = DECISION_OPTIONS.find((item) => item.value === review.decision);

  return (
    <>
      <PageHead
        title="Launch Go/No-Go Review | K&C Design and Manufacturing"
        description="Executive launch decision review for the K&C website and RFQ platform."
        noindex
      />

      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Launch Go/No-Go Review">
        <div className="launch-go-no-go space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Executive Review</p>
                <h2 className="mt-1 text-2xl font-bold text-charcoal">Launch Go/No-Go Decision</h2>
                <p className="mt-2 max-w-3xl text-sm text-metallic">
                  Final launch decision checklist for the K&C Design and Manufacturing website and RFQ platform.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 print:hidden">
                <AccessibleButton
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-charcoal hover:border-accent hover:text-accent"
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Print / Export
                </AccessibleButton>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-metallic">Required Criteria Passed</p>
                <p className="mt-2 text-3xl font-bold text-emerald-700">{summary.pass}/{summary.totalRequired}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-metallic">Failed / Not Tested</p>
                <p className="mt-2 text-3xl font-bold text-red-700">{summary.fail + summary.notTested}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-metallic">Recommended Decision</p>
                <div className="mt-3">
                  <DecisionBadge decision={recommended} />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-metallic">Selected Decision</p>
                <div className="mt-3">
                  <DecisionBadge decision={review.decision} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
            <h3 className="text-lg font-bold text-charcoal">Launch Decision</h3>
            <p className="mt-1 text-sm text-metallic">Select the executive launch decision after reviewing all criteria.</p>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {DECISION_OPTIONS.map((option) => {
                const active = review.decision === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateDecision(option.value)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                        : 'border-slate-200 bg-slate-50 hover:border-accent/40'
                    }`}
                  >
                    <p className="font-semibold text-charcoal">{option.label}</p>
                    <p className="mt-1 text-sm text-metallic">{option.description}</p>
                  </button>
                );
              })}
            </div>
            {savedMessage && (
              <p className="mt-3 text-sm text-emerald-700" role="status">{savedMessage}</p>
            )}
            {saving && (
              <p className="mt-3 text-sm text-metallic" role="status">Saving review…</p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="text-lg font-bold text-charcoal">Final Review Table</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-metallic">
                    <th className="px-3 py-2">Area</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Evidence</th>
                    <th className="px-3 py-2">Risk</th>
                    <th className="px-3 py-2">Owner</th>
                    <th className="px-3 py-2">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {review.criteria.map((row) => (
                    <tr key={row.area} className="border-b border-slate-100 align-top">
                      <td className="px-3 py-3 font-medium text-charcoal">{row.area}</td>
                      <td className="px-3 py-3">
                        <select
                          value={row.status}
                          onChange={(event) => updateCriterion(row.area, { status: event.target.value })}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs print:hidden"
                          aria-label={`Status for ${row.area}`}
                        >
                          <option value="pass">Pass</option>
                          <option value="partial">Partial</option>
                          <option value="fail">Fail</option>
                          <option value="not_tested">Not tested</option>
                        </select>
                        <span className="hidden print:inline">
                          <StatusBadge status={row.status} />
                        </span>
                        <span className="print:hidden">
                          <div className="mt-2">
                            <StatusBadge status={row.status} />
                          </div>
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <textarea
                          value={row.evidence}
                          onChange={(event) => updateCriterion(row.area, { evidence: event.target.value })}
                          rows={2}
                          className="w-full min-w-[220px] rounded-lg border border-slate-200 px-2 py-1 text-sm print:border-none print:bg-transparent print:p-0"
                          aria-label={`Evidence for ${row.area}`}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <select
                          value={row.risk}
                          onChange={(event) => updateCriterion(row.area, { risk: event.target.value })}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs print:hidden"
                          aria-label={`Risk for ${row.area}`}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                        <span className="hidden print:inline">{row.risk}</span>
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={row.owner}
                          onChange={(event) => updateCriterion(row.area, { owner: event.target.value })}
                          className="w-full min-w-[100px] rounded-lg border border-slate-200 px-2 py-1 text-sm print:border-none print:bg-transparent print:p-0"
                          aria-label={`Owner for ${row.area}`}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <select
                          value={row.decision}
                          onChange={(event) => updateCriterion(row.area, { decision: event.target.value })}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs print:hidden"
                          aria-label={`Decision for ${row.area}`}
                        >
                          <option value="Go">Go</option>
                          <option value="Conditional Go">Conditional Go</option>
                          <option value="No-Go">No-Go</option>
                        </select>
                        <span className="hidden print:inline">{row.decision}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 text-accent" aria-hidden="true" />
              <div className="w-full">
                <h3 className="font-semibold text-charcoal">Final Decision &amp; Notes</h3>
                <p className="mt-1 text-sm text-metallic">
                  Document executive rationale, remaining issues, and required fixes before launch.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-metallic">Selected decision</p>
                  <div className="mt-2">
                    <DecisionBadge decision={review.decision} />
                  </div>
                  {selectedDecision && (
                    <p className="mt-2 text-sm text-charcoal">{selectedDecision.description}</p>
                  )}
                  {review.reviewedBy && (
                    <p className="mt-2 text-xs text-metallic">
                      Last updated by {review.reviewedBy}
                      {review.reviewedAt ? ` on ${new Date(review.reviewedAt).toLocaleString()}` : ''}
                    </p>
                  )}
                </div>
                <label htmlFor="final-decision-notes" className="mt-4 block text-sm font-medium text-charcoal">
                  Executive summary / evidence notes
                </label>
                <textarea
                  id="final-decision-notes"
                  value={review.finalNotes}
                  onChange={(event) => updateFinalNotes(event.target.value)}
                  rows={6}
                  placeholder="Summarize blockers, conditional items, sign-off notes, and post-launch monitoring owners."
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
          </section>

          {review.decision === 'no_go' && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Launch is not approved. Resolve RFQ submission, email delivery, and admin access blockers before reconsidering.
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
