import { AlertTriangle, CheckCircle2, FileSearch, ShieldAlert } from 'lucide-react';
import { ALLOWED_FACTS, REPLACEMENT_LANGUAGE, RISKY_SEARCH_TERMS } from '../../../data/contentQAAuditData';
import QAStatusBadge from '../mobileQA/QAStatusBadge';
import ContentPageReviewTable from './ContentPageReviewTable';
import ContentQAChecklist from './ContentQAChecklist';
import UnsupportedClaimsChecklist from './UnsupportedClaimsChecklist';
import ContentEvidenceNotes from './ContentEvidenceNotes';

function SummaryCard({ label, value, tone = 'default' }) {
  const tones = {
    default: 'border-slate-200 bg-white text-charcoal',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    danger: 'border-red-200 bg-red-50 text-red-900',
  };

  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${tones[tone] ?? tones.default}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </article>
  );
}

export default function ContentQADashboard({
  summary,
  state,
  saving,
  onUpdateReview,
  onUpdateClaim,
  onUpdateCategory,
  onNotesChange,
  onSaveNotes,
}) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">Pre-Launch Audit</p>
            <h2 className="mt-2 text-3xl font-bold">Production Content QA</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Review public website content for accuracy, credibility, legal safety, SEO quality, and consistency with
              verified K&amp;C business information.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {summary.readyForLaunch ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                <QAStatusBadge status="passed" className="!border-emerald-300 !bg-emerald-100 !text-emerald-900" />
                <span className="text-sm font-semibold text-emerald-100">Content Approved</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-300" aria-hidden="true" />
                <QAStatusBadge status="needs_fix" />
                <span className="text-sm font-semibold text-amber-100">Review Required</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Content QA summary cards">
        <SummaryCard label="Pages Reviewed" value={`${summary.pagesReviewed}/${summary.totalPages}`} />
        <SummaryCard label="Claims Flagged" value={summary.claimsFlagged} tone={summary.claimsFlagged ? 'danger' : 'success'} />
        <SummaryCard label="High-Risk Claims" value={summary.highRiskClaims} tone={summary.highRiskClaims ? 'danger' : 'success'} />
        <SummaryCard label="Medium-Risk Claims" value={summary.mediumRiskClaims} tone={summary.mediumRiskClaims ? 'warning' : 'default'} />
        <SummaryCard label="Approved Pages" value={summary.approvedPages} tone={summary.approvedPages === summary.totalPages ? 'success' : 'default'} />
        <SummaryCard label="Remaining Fixes" value={summary.remainingFixes} tone={summary.remainingFixes ? 'warning' : 'success'} />
      </section>

      <ContentPageReviewTable pageReviews={state.pageReviews} onUpdateReview={onUpdateReview} />

      <ContentQAChecklist categoryChecks={state.categoryChecks} onUpdateCategory={onUpdateCategory} />

      <UnsupportedClaimsChecklist claimChecks={state.claimChecks} onUpdateClaim={onUpdateClaim} />

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-accent" aria-hidden="true" />
            <h3 className="text-lg font-bold text-charcoal">Verified Facts Reference</h3>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-charcoal">Company</dt>
              <dd className="text-metallic">{ALLOWED_FACTS.company.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-charcoal">Address</dt>
              <dd className="text-metallic">
                {ALLOWED_FACTS.company.address}, {ALLOWED_FACTS.company.city}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-charcoal">Contact</dt>
              <dd className="text-metallic">
                {ALLOWED_FACTS.company.phone} • {ALLOWED_FACTS.company.email}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-charcoal">Founded</dt>
              <dd className="text-metallic">
                {ALLOWED_FACTS.company.founded} by {ALLOWED_FACTS.company.founder}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" aria-hidden="true" />
            <h3 className="text-lg font-bold text-red-900">Risky Terms to Search</h3>
          </div>
          <p className="mb-3 text-sm text-red-800">
            Grep public content for these terms. Remove unsupported claims or soften language using approved replacements.
          </p>
          <div className="flex flex-wrap gap-2">
            {RISKY_SEARCH_TERMS.map((term) => (
              <span key={term} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-900">
                {term}
              </span>
            ))}
          </div>
        </article>
      </section>

      <ContentEvidenceNotes
        notes={state.evidenceNotes}
        onChange={onNotesChange}
        onSave={onSaveNotes}
        saving={saving}
      />

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-metallic">
        <p>
          Categories reviewed: {summary.categoriesComplete}/{summary.totalCategories}
        </p>
        {state.updatedAt ? <p className="mt-1">Last saved: {new Date(state.updatedAt).toLocaleString()}</p> : null}
        <p className="mt-2 text-xs">
          Replacement examples: {REPLACEMENT_LANGUAGE[0].use}; {REPLACEMENT_LANGUAGE[1].use}
        </p>
      </section>
    </div>
  );
}
