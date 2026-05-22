import { Link } from 'react-router-dom';
import { Rocket, RefreshCw, ExternalLink } from 'lucide-react';
import { GO_LIVE_DOCUMENTS, PRODUCTION_URL, LAUNCH_DATE } from '../../../data/goLiveData';
import AccessibleButton from '../../AccessibleButton';
import OperationalReadinessBadge from './OperationalReadinessBadge';
import GoLiveStatusCard from './GoLiveStatusCard';
import LaunchMetricsBoard from './LaunchMetricsBoard';
import GoLiveChecklist from './GoLiveChecklist';
import RFQMonitoringQueue from './RFQMonitoringQueue';
import IssueEscalationPanel from './IssueEscalationPanel';
import GoLiveActivityFeed from './GoLiveActivityFeed';

function statusTone(status) {
  if (status === 'operational') return 'green';
  if (status === 'critical') return 'red';
  return 'yellow';
}

function formatPercent(value) {
  if (value == null) return '—';
  return `${value}%`;
}

export default function GoLiveExecutiveDashboard({
  dashboard,
  localState,
  saving,
  refreshing,
  onRefresh,
  onChecklistToggle,
  onChecklistNotesChange,
  onRfqStepToggle,
  onRfqMonitoringChange,
  onCreateIssue,
  onUpdateIssue,
  onLaunchApprovalChange,
}) {
  const { metrics, readiness, launchStatus, activity, recentRfqs, postLaunch, operations, refreshedAt } = dashboard;
  const tone = statusTone(launchStatus);
  const alerts = postLaunch?.alerts ?? operations?.alerts ?? [];
  const openIssues = postLaunch?.issues?.filter((issue) => issue.status !== 'resolved') ?? [];
  const followUpQueue = operations?.actionQueue ?? [];

  return (
    <div className="go-live-dashboard space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">Production Go-Live</p>
            <h2 className="mt-2 flex items-center gap-2 text-3xl font-bold">
              <Rocket className="h-7 w-7 text-brand-accent" aria-hidden="true" />
              Go-Live Command Center
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Execute launch validation, monitor first real RFQ submissions, and manage the first 30 days of operations.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <p>
                <span className="font-semibold text-slate-200">Launch Date:</span>{' '}
                <span className="text-slate-300">{LAUNCH_DATE}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-200">Production URL:</span>{' '}
                <a href={PRODUCTION_URL} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
                  {PRODUCTION_URL}
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3">
            <OperationalReadinessBadge label={readiness.label} tone={readiness.tone} />
            <AccessibleButton type="button" onClick={onRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 inline h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
              {refreshing ? 'Refreshing…' : 'Refresh Dashboard'}
            </AccessibleButton>
            {refreshedAt ? (
              <p className="text-xs text-slate-400">Last refreshed {new Date(refreshedAt).toLocaleString()}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Executive summary cards">
        <GoLiveStatusCard
          label="Launch Status"
          value={readiness.label}
          tone={tone}
          showBadge
          badgeLabel={readiness.label}
        />
        <GoLiveStatusCard label="RFQs Today" value={metrics.rfqsToday} />
        <GoLiveStatusCard label="Open Opportunities" value={metrics.quoteOpportunitiesOpen} />
        <GoLiveStatusCard label="Follow-Ups Due" value={metrics.followUpsDue} tone={metrics.followUpsDue > 0 ? 'yellow' : 'default'} />
        <GoLiveStatusCard label="Open Issues" value={metrics.openIssues} tone={metrics.openIssues > 0 ? 'yellow' : 'default'} />
        <GoLiveStatusCard label="Critical Alerts" value={metrics.criticalIssues} tone={metrics.criticalIssues > 0 ? 'red' : 'green'} />
      </section>

      <section aria-label="Launch status">
        <h3 className="mb-4 text-xl font-bold text-charcoal">1. Launch Status</h3>
        <label className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="checkbox"
            checked={localState.launchApproved}
            onChange={(event) => onLaunchApprovalChange({ launchApproved: event.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
          />
          <span className="text-sm font-medium text-charcoal">Launch approved by owner / operations lead</span>
        </label>
        <GoLiveChecklist
          phaseChecklists={localState.phaseChecklists}
          onToggle={onChecklistToggle}
          onNotesChange={onChecklistNotesChange}
        />
      </section>

      <section aria-label="Visitor metrics">
        <h3 className="mb-4 text-xl font-bold text-charcoal">2. Visitor Metrics</h3>
        <LaunchMetricsBoard metrics={{ visitorsToday: metrics.visitorsToday }} />
      </section>

      <section aria-label="RFQ metrics">
        <h3 className="mb-4 text-xl font-bold text-charcoal">3. RFQ Metrics</h3>
        <LaunchMetricsBoard metrics={{
          rfqsToday: metrics.rfqsToday,
          rfqsThisWeek: metrics.rfqsThisWeek,
          rfqCompletionRate: metrics.rfqCompletionRate,
          quoteOpportunitiesOpen: metrics.quoteOpportunitiesOpen,
          followUpsDue: metrics.followUpsDue,
        }} />
      </section>

      <section aria-label="Conversion metrics">
        <h3 className="mb-4 text-xl font-bold text-charcoal">4. Conversion Metrics</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-metallic">RFQ Completion Rate</p>
            <p className="mt-2 text-3xl font-bold text-charcoal">{formatPercent(metrics.rfqCompletionRate)}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Quote Opportunities Open</p>
            <p className="mt-2 text-3xl font-bold text-charcoal">{metrics.quoteOpportunitiesOpen}</p>
          </article>
        </div>
      </section>

      <section aria-label="Operational alerts">
        <h3 className="mb-4 text-xl font-bold text-charcoal">5. Operational Alerts</h3>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {!alerts.length ? (
            <p className="text-sm text-metallic">No operational alerts at this time.</p>
          ) : (
            <ul className="space-y-3">
              {alerts.slice(0, 10).map((alert) => (
                <li key={alert.id ?? alert.title} className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <p className="font-semibold">{alert.title ?? alert.alert_type}</p>
                  <p>{alert.message ?? alert.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-label="Open issues">
        <h3 className="mb-4 text-xl font-bold text-charcoal">6. Open Issues</h3>
        <IssueEscalationPanel
          issues={openIssues}
          saving={saving}
          onCreateIssue={onCreateIssue}
          onUpdateIssue={onUpdateIssue}
        />
      </section>

      <section aria-label="Follow-up queue">
        <h3 className="mb-4 text-xl font-bold text-charcoal">7. Follow-Up Queue</h3>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {!followUpQueue.length ? (
            <p className="text-sm text-metallic">No follow-ups due.</p>
          ) : (
            <ul className="space-y-3">
              {followUpQueue.slice(0, 10).map((item) => (
                <li key={item.id ?? item.reference_number ?? item.title} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-charcoal">{item.reference_number ?? item.title ?? item.alert_type}</p>
                  <p className="text-sm text-metallic">{item.message ?? item.description ?? item.company_name}</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/rfqs?tab=reminders" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
            View all reminders →
          </Link>
        </div>
      </section>

      <section aria-label="Recent RFQs">
        <h3 className="mb-4 text-xl font-bold text-charcoal">8. Recent RFQs</h3>
        <RFQMonitoringQueue
          recentRfqs={recentRfqs}
          rfqMonitoring={localState.rfqMonitoring}
          onStepToggle={onRfqStepToggle}
          onMonitoringChange={onRfqMonitoringChange}
        />
      </section>

      <section aria-label="Activity feed">
        <h3 className="mb-4 text-xl font-bold text-charcoal">9. Activity Feed</h3>
        <GoLiveActivityFeed activity={activity} />
      </section>

      <section aria-label="Runbook documents">
        <h3 className="mb-4 text-xl font-bold text-charcoal">Runbook Documents</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {GO_LIVE_DOCUMENTS.map((doc) => (
            <article key={doc.file} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-charcoal">{doc.title}</p>
              <p className="mt-1 text-xs text-metallic">docs/{doc.file}</p>
              <a
                href={`/docs/${doc.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                Open document
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
