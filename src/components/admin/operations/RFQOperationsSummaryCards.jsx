import {
  AlertTriangle,
  ClipboardList,
  DollarSign,
  Inbox,
  MailWarning,
  MessageSquareWarning,
  ShieldAlert,
  Trophy,
} from 'lucide-react';
import { formatCurrency } from '../../../services/rfqOperationsService';
import { ProductionReadyBadge } from '../readiness/RFQReadinessStatusBadge';

const CARDS = [
  { key: 'new_rfqs_today', label: 'New RFQs Today', icon: Inbox, accent: 'text-blue-700 bg-blue-50' },
  { key: 'open_rfqs', label: 'Open RFQs', icon: ClipboardList, accent: 'text-charcoal bg-slate-100' },
  { key: 'quotes_awaiting_response', label: 'Quotes Awaiting Response', icon: MessageSquareWarning, accent: 'text-purple-700 bg-purple-50' },
  { key: 'overdue_followups', label: 'Overdue Follow-Ups', icon: AlertTriangle, accent: 'text-amber-700 bg-amber-50' },
  { key: 'additional_info_outstanding', label: 'Additional Info Outstanding', icon: ShieldAlert, accent: 'text-orange-700 bg-orange-50' },
  { key: 'failed_emails', label: 'Failed Emails', icon: MailWarning, accent: 'text-red-700 bg-red-50', computed: true },
  { key: 'critical_alerts', label: 'Critical Alerts', icon: AlertTriangle, accent: 'text-red-700 bg-red-50', computed: true },
  { key: 'won_value_this_month', label: 'Won Value This Month', icon: Trophy, accent: 'text-emerald-700 bg-emerald-50', currency: true },
];

export default function RFQOperationsSummaryCards({ summary, health, productionReady = false }) {
  const failedEmails =
    Number(summary?.failed_customer_emails ?? 0)
    + Number(summary?.failed_status_emails ?? 0)
    + Number(summary?.failed_additional_info_requests ?? 0);

  const values = {
    ...summary,
    failed_emails: failedEmails,
    critical_alerts: Number(health?.critical_alert_count ?? 0),
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon, accent, currency }) => (
        <div key={key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-metallic">{label}</p>
              <p className="mt-2 text-3xl font-bold text-charcoal">
                {currency ? formatCurrency(values[key]) : values[key] ?? 0}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm sm:col-span-2 xl:col-span-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-metallic">Operations Posture</p>
            <p className="mt-1 text-lg font-semibold text-charcoal">
              {productionReady ? 'Platform operating within launch thresholds' : 'Operational attention recommended'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ProductionReadyBadge
              productionReady={productionReady}
              completionPercentage={summary?.open_rfqs ? 100 : 0}
            />
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-charcoal">
              <DollarSign className="h-4 w-4 text-accent" aria-hidden="true" />
              Open quote value: {formatCurrency(summary?.quoted_value_open)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
