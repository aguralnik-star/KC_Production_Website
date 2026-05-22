import { CheckCircle2, AlertTriangle, Rocket, BookOpen } from 'lucide-react';
import { HANDOFF_DOCUMENTS, PRODUCTION_URL } from '../../../data/ownerHandoffData';
import { COMPANY } from '../../../data/company';
import QAStatusBadge from '../mobileQA/QAStatusBadge';
import HandoffDocumentCard from './HandoffDocumentCard';
import LaunchReadinessSummary from './LaunchReadinessSummary';
import OwnerActionChecklist from './OwnerActionChecklist';
import PostLaunchSupportChecklist from './PostLaunchSupportChecklist';
import FinalSignoffPanel from './FinalSignoffPanel';

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
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </article>
  );
}

const LAUNCH_BADGE = {
  ready: 'passed',
  conditional: 'needs_fix',
  not_ready: 'blocked',
};

export default function OwnerHandoffDashboard({
  summary,
  state,
  saving,
  onAreaStatusChange,
  onRemainingIssuesChange,
  onOwnerToggle,
  onOwnerNotesChange,
  onPostLaunchToggle,
  onPostLaunchNotesChange,
  onSignoffChecklistToggle,
  onFinalSignoffChange,
  onSave,
}) {
  return (
    <div className="owner-handoff-dashboard space-y-8">
      <section className="handoff-hero rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white shadow-sm print:border-slate-300 print:bg-white print:text-charcoal">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">Production Launch</p>
            <h2 className="mt-2 text-3xl font-bold">Owner Handoff & Launch Package</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300 print:text-metallic">
              Executive dashboard for K&amp;C Design and Manufacturing website launch approval, owner training, and
              post-launch support planning.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <p>
                <span className="font-semibold text-slate-200 print:text-charcoal">Production URL:</span>{' '}
                <span className="text-slate-300 print:text-metallic">{PRODUCTION_URL}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-200 print:text-charcoal">Support:</span>{' '}
                <span className="text-slate-300 print:text-metallic">
                  {COMPANY.email} · {COMPANY.phone}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {summary.overallLaunchStatus === 'ready' ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-300 print:text-emerald-600" aria-hidden="true" />
                <QAStatusBadge status="passed" />
                <span className="text-sm font-semibold text-emerald-100 print:text-emerald-800">Ready for Launch</span>
              </>
            ) : summary.overallLaunchStatus === 'not_ready' ? (
              <>
                <AlertTriangle className="h-5 w-5 text-red-300 print:text-red-600" aria-hidden="true" />
                <QAStatusBadge status="blocked" />
                <span className="text-sm font-semibold text-red-100 print:text-red-800">Not Ready</span>
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5 text-amber-300 print:text-amber-600" aria-hidden="true" />
                <QAStatusBadge status="needs_fix" />
                <span className="text-sm font-semibold text-amber-100 print:text-amber-800">Conditional Launch</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Handoff summary cards">
        <SummaryCard
          label="Launch Status"
          value={summary.overallLaunchStatus.replace('_', ' ')}
          tone={summary.overallLaunchStatus === 'ready' ? 'success' : summary.overallLaunchStatus === 'not_ready' ? 'danger' : 'warning'}
        />
        <SummaryCard label="Ready Areas" value={`${summary.readyAreas}/${summary.totalAreas}`} />
        <SummaryCard
          label="Owner Actions"
          value={`${summary.ownerCompleted}/${summary.ownerTotal}`}
          tone={summary.ownerCompleted === summary.ownerTotal ? 'success' : 'warning'}
        />
        <SummaryCard
          label="Signoff Checklist"
          value={`${summary.signoffCompleted}/${summary.signoffTotal}`}
          tone={summary.signoffCompleted === summary.signoffTotal ? 'success' : 'default'}
        />
        <SummaryCard
          label="Post-Launch Items"
          value={`${summary.postLaunchCompleted}/${summary.postLaunchTotal}`}
        />
        <SummaryCard
          label="Launch Approved"
          value={summary.launchApproved ? 'Yes' : 'Pending'}
          tone={summary.launchApproved ? 'success' : 'warning'}
        />
      </section>

      <LaunchReadinessSummary
        areaStatuses={state.areaStatuses}
        onStatusChange={onAreaStatusChange}
        remainingIssues={state.remainingIssues}
        onRemainingIssuesChange={onRemainingIssuesChange}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" aria-hidden="true" />
          <h3 className="text-lg font-bold text-charcoal">Launch Documentation Package</h3>
        </div>
        <p className="mb-6 text-sm text-metallic">
          Owner-facing documentation in the repository <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">docs/</code> folder.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {HANDOFF_DOCUMENTS.map((document) => (
            <HandoffDocumentCard key={document.id} document={document} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <OwnerActionChecklist
          items={state.ownerActions}
          onToggle={onOwnerToggle}
          onNotesChange={onOwnerNotesChange}
        />
        <PostLaunchSupportChecklist
          items={state.postLaunchItems}
          onToggle={onPostLaunchToggle}
          onNotesChange={onPostLaunchNotesChange}
        />
      </div>

      <FinalSignoffPanel
        signoffChecklist={state.signoffChecklist}
        finalSignoff={state.finalSignoff}
        onChecklistToggle={onSignoffChecklistToggle}
        onSignoffChange={onFinalSignoffChange}
        onSave={onSave}
        saving={saving}
      />

      {state.updatedAt ? (
        <p className="text-sm text-metallic print:hidden">
          Last saved: {new Date(state.updatedAt).toLocaleString()}
        </p>
      ) : null}
    </div>
  );
}
