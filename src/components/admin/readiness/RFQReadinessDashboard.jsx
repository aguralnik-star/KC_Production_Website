import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Award,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Loader2,
  PlayCircle,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import RFQReadinessCategoryCard from './RFQReadinessCategoryCard';
import RFQReadinessChecklist from './RFQReadinessChecklist';
import RFQReadinessSummary from './RFQReadinessSummary';
import RFQReadinessStatusBadge, { ProductionReadyBadge } from './RFQReadinessStatusBadge';
import {
  generateAuditSummary,
  getCheckStats,
  groupChecksByCategory,
} from '../../../services/rfqProductionReadinessService';

const STAT_CARDS = [
  { key: 'total', label: 'Total Checks', icon: ClipboardCheck, accent: 'text-charcoal bg-slate-100' },
  { key: 'passed', label: 'Passed', icon: CheckCircle2, accent: 'text-emerald-700 bg-emerald-50' },
  { key: 'failed', label: 'Failed', icon: XCircle, accent: 'text-red-700 bg-red-50' },
  { key: 'pending', label: 'Pending', icon: Clock3, accent: 'text-amber-700 bg-amber-50' },
];

export default function RFQReadinessDashboard({
  audit,
  checks,
  summary,
  loading,
  creating,
  finalizing,
  updatingId,
  error,
  onCreateAudit,
  onFinalizeAudit,
  onUpdateStatus,
  onSaveEvidence,
  reviewer,
}) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const stats = useMemo(() => getCheckStats(checks), [checks]);
  const groupedChecks = useMemo(() => groupChecksByCategory(checks), [checks]);
  const liveSummary = useMemo(
    () => (audit ? generateAuditSummary(audit, checks, reviewer) : null),
    [audit, checks, reviewer],
  );
  const displaySummary = summary ?? liveSummary;

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading readiness dashboard" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <ShieldCheck className="mx-auto h-12 w-12 text-accent" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-bold text-charcoal">RFQ Production Readiness Audit</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-metallic">
          Initialize the final operational validation checklist before production launch. This audit covers public website readiness,
          RFQ workflows, customer re-uploads, admin operations, analytics, security, email delivery, and operational controls.
        </p>
        <button
          type="button"
          onClick={onCreateAudit}
          disabled={creating}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
          Run Production Readiness Review
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Executive QA Dashboard</p>
            <h2 className="mt-1 text-2xl font-bold text-charcoal">{audit.audit_name}</h2>
            <p className="mt-2 text-sm text-metallic">
              Version {audit.audit_version} · Created {new Date(audit.created_at).toLocaleString()}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RFQReadinessStatusBadge status={audit.overall_status} />
              <ProductionReadyBadge
                productionReady={displaySummary?.production_ready}
                completionPercentage={stats.completion_percentage}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCreateAudit}
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
              New Review
            </button>
            <button
              type="button"
              onClick={onFinalizeAudit}
              disabled={finalizing}
              className="inline-flex items-center gap-2 rounded-lg bg-charcoal px-4 py-2.5 text-sm font-semibold text-white hover:bg-charcoal-light disabled:opacity-50"
            >
              {finalizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
              Finalize Review
            </button>
            <button
              type="button"
              onClick={() => setShowCertificate(true)}
              disabled={!displaySummary}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
            >
              <Award className="h-4 w-4" />
              Generate Certificate
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {STAT_CARDS.map(({ key, label, icon: Icon, accent }) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-metallic">{label}</p>
                <p className="mt-2 text-3xl font-bold text-charcoal">{stats[key] ?? 0}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-metallic">Completion</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{stats.completion_percentage}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                stats.completion_percentage >= 95 ? 'bg-emerald-500' : stats.completion_percentage >= 80 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(stats.completion_percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <section>
        <h3 className="mb-4 text-lg font-bold text-charcoal">Category Progress</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(groupedChecks).map(([category, categoryChecks]) => (
            <RFQReadinessCategoryCard
              key={category}
              category={category}
              checks={categoryChecks}
              expanded={expandedCategory === category}
              onToggle={() => setExpandedCategory((current) => (current === category ? null : category))}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-charcoal">Checklist</h3>
        <RFQReadinessChecklist
          checks={checks}
          updatingId={updatingId}
          onUpdateStatus={onUpdateStatus}
          onSaveEvidence={onSaveEvidence}
        />
      </section>

      <RFQReadinessSummary summary={displaySummary} />

      {showCertificate && displaySummary && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/50 px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-charcoal shadow-sm"
              >
                Close Certificate
              </button>
            </div>
            <RFQReadinessSummary summary={displaySummary} certificateMode />
          </div>
        </div>
      )}
    </div>
  );
}
