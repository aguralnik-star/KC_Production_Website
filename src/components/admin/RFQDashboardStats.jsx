import { Inbox, Sparkles, Search, FileCheck, CheckCircle2 } from 'lucide-react';

const statCards = [
  { key: 'total', label: 'Total RFQs', icon: Inbox, accent: 'text-charcoal bg-slate-100' },
  { key: 'new', label: 'New', icon: Sparkles, accent: 'text-blue-700 bg-blue-50' },
  { key: 'in_review', label: 'In Review', icon: Search, accent: 'text-amber-700 bg-amber-50' },
  { key: 'quoted', label: 'Quoted', icon: FileCheck, accent: 'text-emerald-700 bg-emerald-50' },
  { key: 'closed', label: 'Closed', icon: CheckCircle2, accent: 'text-slate-700 bg-slate-100' },
];

export default function RFQDashboardStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map(({ key, label, icon: Icon, accent }) => (
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
    </div>
  );
}
