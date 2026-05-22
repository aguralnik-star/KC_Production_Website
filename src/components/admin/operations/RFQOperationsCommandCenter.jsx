import { lazy, Suspense } from 'react';
import { AlertCircle, Loader2, Radar } from 'lucide-react';
import RFQOperationsSummaryCards from './RFQOperationsSummaryCards';
import RFQOperationsAlertFeed from './RFQOperationsAlertFeed';
import RFQSystemHealthPanel from './RFQSystemHealthPanel';
import RFQAdminActivityFeed from './RFQAdminActivityFeed';
import RFQOperationsActionQueue from './RFQOperationsActionQueue';
import RFQOperationsRefreshControl from './RFQOperationsRefreshControl';
import LoadingState from '../../LoadingState';

const RFQOperationsKPICharts = lazy(() => import('./RFQOperationsKPICharts'));

export default function RFQOperationsCommandCenter({
  data,
  loading,
  refreshing,
  error,
  onRefresh,
  onOpenRfq,
}) {
  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading operations command center" />
      </div>
    );
  }

  const productionReady = data?.healthState === 'healthy'
    && Number(data?.summary?.failed_customer_emails ?? 0) === 0
    && Number(data?.health?.critical_alert_count ?? 0) === 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Radar className="h-3.5 w-3.5" aria-hidden="true" />
              Live Operations
            </div>
            <h2 className="mt-3 text-3xl font-bold">RFQ Operations Command Center</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-200">
              Monitor RFQ intake, customer workflows, admin activity, email delivery, follow-ups, and platform health after launch.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-100">
            <RFQOperationsRefreshControl
              refreshedAt={data?.refreshedAt}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      <RFQOperationsSummaryCards
        summary={data?.summary}
        health={data?.health}
        productionReady={productionReady}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Alert Feed</p>
              <h3 className="mt-1 text-lg font-bold text-charcoal">Operational Alerts</h3>
            </div>
            <RFQOperationsAlertFeed groupedAlerts={data?.groupedAlerts} onOpenRfq={onOpenRfq} />
          </section>

          <RFQOperationsActionQueue actionQueue={data?.actionQueue} onOpenRfq={onOpenRfq} />
        </div>

        <div className="space-y-6">
          <RFQSystemHealthPanel health={data?.health} healthState={data?.healthState} />
          <RFQAdminActivityFeed activity={data?.activity} />
        </div>
      </div>

      <Suspense fallback={<LoadingState compact message="Loading analytics charts…" />}>
        <RFQOperationsKPICharts charts={data?.charts} />
      </Suspense>
    </div>
  );
}
