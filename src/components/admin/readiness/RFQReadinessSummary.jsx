import { AlertTriangle, Award, CheckCircle2, ClipboardList, XCircle } from 'lucide-react';
import { ProductionReadyBadge } from './RFQReadinessStatusBadge';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function RFQReadinessSummary({ summary, certificateMode = false }) {
  if (!summary) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <ClipboardList className="mx-auto h-10 w-10 text-metallic" aria-hidden="true" />
        <p className="mt-4 text-lg font-semibold text-charcoal">No readiness summary yet</p>
        <p className="mt-2 text-sm text-metallic">
          Complete checklist items and run a production readiness review to generate a summary.
        </p>
      </div>
    );
  }

  return (
    <section className={`rounded-2xl border bg-white shadow-sm ${
      summary.production_ready ? 'border-emerald-200' : 'border-slate-200'
    }`}>
      <div className={`rounded-t-2xl px-6 py-5 ${
        summary.production_ready ? 'bg-emerald-50' : 'bg-slate-50'
      }`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-metallic">
              {certificateMode ? 'Production Readiness Certificate' : 'Readiness Summary'}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-charcoal">{summary.audit_name}</h2>
            <p className="mt-1 text-sm text-metallic">Audit date: {formatDate(summary.audit_date)}</p>
          </div>
          <ProductionReadyBadge
            productionReady={summary.production_ready}
            completionPercentage={summary.completion_percentage}
          />
        </div>
      </div>

      <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-metallic">Completion</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{summary.completion_percentage}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-metallic">Passed Checks</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">{summary.passed_checks}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-metallic">Failed Checks</p>
          <p className="mt-2 text-3xl font-bold text-red-700">{summary.failed_checks}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-metallic">Total Checks</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{summary.total_checks}</p>
        </div>
      </div>

      <div className="grid gap-6 border-t border-slate-100 px-6 py-6 lg:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Passed Checks
          </h3>
          <p className="mt-2 text-sm text-metallic">
            {summary.passed_checks} of {summary.total_checks} checklist items passed.
          </p>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
            <XCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
            Failed Checks
          </h3>
          <p className="mt-2 text-sm text-metallic">
            {summary.failed_checks} failed item(s) require resolution before launch.
          </p>
        </div>
      </div>

      {summary.open_issues?.length > 0 && (
        <div className="border-t border-slate-100 px-6 py-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
            <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
            Open Issues
          </h3>
          <ul className="mt-3 space-y-2">
            {summary.open_issues.map((issue) => (
              <li key={`${issue.category}-${issue.check_name}`} className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                <span className="font-semibold">{issue.category}:</span> {issue.check_name}
                {issue.evidence ? ` — ${issue.evidence}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.recommended_actions?.length > 0 && (
        <div className="border-t border-slate-100 px-6 py-6">
          <h3 className="text-sm font-semibold text-charcoal">Recommended Actions</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-charcoal">
            {summary.recommended_actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={`border-t px-6 py-6 ${summary.production_ready ? 'border-emerald-100 bg-emerald-50/40' : 'border-slate-100'}`}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
          <Award className="h-4 w-4 text-accent" aria-hidden="true" />
          Final Recommendation
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal">{summary.final_recommendation}</p>
        {certificateMode && (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-metallic">Reviewer</dt>
              <dd className="text-charcoal">{summary.reviewer}</dd>
            </div>
            <div>
              <dt className="font-semibold text-metallic">Audit Version</dt>
              <dd className="text-charcoal">{summary.audit_version}</dd>
            </div>
            <div>
              <dt className="font-semibold text-metallic">Production Ready</dt>
              <dd className="text-charcoal">{summary.production_ready ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-metallic">Outstanding Risks</dt>
              <dd className="text-charcoal">
                {summary.outstanding_risks?.length ? summary.outstanding_risks.join('; ') : 'None'}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}
