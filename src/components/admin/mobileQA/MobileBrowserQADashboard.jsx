import { AlertTriangle, CheckCircle2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { QA_CATEGORIES, LAUNCH_BLOCKERS, COMMON_ISSUES } from '../../../data/mobileBrowserQAData';
import QAStatusBadge from './QAStatusBadge';
import ViewportChecklist from './ViewportChecklist';
import CrossBrowserChecklist from './CrossBrowserChecklist';
import ResponsivePageReviewTable from './ResponsivePageReviewTable';
import MobileIssueTracker from './MobileIssueTracker';
import QAEvidenceNotes from './QAEvidenceNotes';

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

export default function MobileBrowserQADashboard({
  summary,
  state,
  saving,
  onViewportChange,
  onBrowserChange,
  onUpdateReview,
  onCreateIssue,
  onUpdateIssue,
  onNotesChange,
  onSaveNotes,
}) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">Final QA</p>
            <h2 className="mt-2 text-3xl font-bold">Mobile & Cross-Browser QA</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Verify responsive layout, navigation, RFQ workflows, and browser compatibility before production launch.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {summary.readyForLaunch ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                <QAStatusBadge status="passed" className="!border-emerald-300 !bg-emerald-100 !text-emerald-900" />
                <span className="text-sm font-semibold text-emerald-100">Ready for Launch</span>
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="QA summary cards">
        <SummaryCard label="Pages Reviewed" value={`${summary.pagesReviewed}/${summary.totalPages}`} />
        <SummaryCard label="Mobile Issues" value={summary.mobileIssues} tone={summary.mobileIssues ? 'warning' : 'default'} />
        <SummaryCard label="Tablet Issues" value={summary.tabletIssues} tone={summary.tabletIssues ? 'warning' : 'default'} />
        <SummaryCard label="Desktop Issues" value={summary.desktopIssues} tone={summary.desktopIssues ? 'warning' : 'default'} />
        <SummaryCard label="Browser Issues" value={summary.browserIssues} tone={summary.browserIssues ? 'warning' : 'default'} />
        <SummaryCard label="Critical Issues" value={summary.criticalIssues} tone={summary.criticalIssues ? 'danger' : 'success'} />
        <SummaryCard
          label="Ready for Launch"
          value={summary.readyForLaunch ? 'Yes' : 'No'}
          tone={summary.readyForLaunch ? 'success' : 'danger'}
        />
        <SummaryCard label="Open Blockers" value={summary.openBlockers} tone={summary.openBlockers ? 'danger' : 'success'} />
      </section>

      <ResponsivePageReviewTable pageReviews={state.pageReviews} onUpdateReview={onUpdateReview} />

      <div className="grid gap-6 xl:grid-cols-2">
        <ViewportChecklist checks={state.viewportChecks} onChange={onViewportChange} />
        <CrossBrowserChecklist checks={state.browserChecks} onChange={onBrowserChange} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-accent" aria-hidden="true" />
          <h3 className="text-lg font-bold text-charcoal">Mobile QA Categories</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {QA_CATEGORIES.map((category) => (
            <article key={category.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <h4 className="font-semibold text-charcoal">{category.title}</h4>
              <ul className="mt-3 space-y-1.5">
                {category.checks.map((check) => (
                  <li key={check} className="flex items-start gap-2 text-sm text-metallic">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" aria-hidden="true" />
                    {check}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
            <h3 className="text-lg font-bold text-red-900">Launch Blockers</h3>
          </div>
          <ul className="space-y-2">
            {LAUNCH_BLOCKERS.map((item) => (
              <li key={item} className="text-sm text-red-800">• {item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Monitor className="h-5 w-5 text-accent" aria-hidden="true" />
            <h3 className="text-lg font-bold text-charcoal">Common Issues to Watch</h3>
          </div>
          <ul className="space-y-2">
            {COMMON_ISSUES.map((item) => (
              <li key={item} className="text-sm text-metallic">• {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <MobileIssueTracker
        issues={state.issues}
        onCreateIssue={onCreateIssue}
        onUpdateIssue={onUpdateIssue}
        saving={saving}
      />

      <QAEvidenceNotes
        notes={state.evidenceNotes}
        onChange={onNotesChange}
        onSave={onSaveNotes}
        saving={saving}
      />

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-metallic">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2"><Smartphone className="h-4 w-4" /> Mobile QA</span>
          <span className="inline-flex items-center gap-2"><Tablet className="h-4 w-4" /> Tablet QA</span>
          <span className="inline-flex items-center gap-2"><Monitor className="h-4 w-4" /> Desktop QA</span>
          {state.updatedAt ? <span>Last saved: {new Date(state.updatedAt).toLocaleString()}</span> : null}
        </div>
      </section>
    </div>
  );
}
