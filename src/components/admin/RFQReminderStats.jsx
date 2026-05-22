import { AlertTriangle, Calendar, CalendarClock, CalendarDays, Inbox, ShieldAlert } from 'lucide-react';

const statCards = [
  { key: 'overdue', label: 'Overdue Follow-Ups', icon: AlertTriangle, accent: 'text-red-700 bg-red-50' },
  { key: 'dueToday', label: 'Due Today', icon: Calendar, accent: 'text-amber-700 bg-amber-50' },
  { key: 'upcomingThisWeek', label: 'Upcoming This Week', icon: CalendarDays, accent: 'text-blue-700 bg-blue-50' },
  { key: 'noFollowUp', label: 'RFQs With No Follow-Up', icon: CalendarClock, accent: 'text-slate-700 bg-slate-100' },
  { key: 'criticalAlerts', label: 'Critical Alerts', icon: ShieldAlert, accent: 'text-red-700 bg-red-50 ring-1 ring-red-100' },
  { key: 'staleRfqs', label: 'Stale RFQs', icon: Inbox, accent: 'text-orange-700 bg-orange-50' },
];

export default function RFQReminderStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {statCards.map(({ key, label, icon: Icon, accent }) => (
        <div
          key={key}
          className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${key === 'criticalAlerts' && stats?.[key] > 0 ? 'border-red-200' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-metallic">{label}</p>
              <p className={`mt-2 text-3xl font-bold ${key === 'criticalAlerts' && stats?.[key] > 0 ? 'text-red-700' : 'text-charcoal'}`}>
                {stats?.[key] ?? 0}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
