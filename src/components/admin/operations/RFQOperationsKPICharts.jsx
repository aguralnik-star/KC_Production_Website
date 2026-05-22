import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function EmptyChart({ title, message }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
      <div>
        <p className="font-semibold text-charcoal">{title}</p>
        <p className="mt-1 text-sm text-metallic">{message}</p>
      </div>
    </div>
  );
}

function hasSeriesData(series = []) {
  return series.some((item) => Number(item.count ?? item.value ?? 0) > 0);
}

export default function RFQOperationsKPICharts({ charts }) {
  const rfqsReceived = charts?.rfqsReceived ?? [];
  const quotesSent = charts?.quotesSent ?? [];
  const wonLost = charts?.wonLost ?? { won: 0, lost: 0 };
  const followUps = charts?.followUps ?? { overdue: 0, completed: 0 };

  const wonLostData = [
    { name: 'Won', value: wonLost.won ?? 0 },
    { name: 'Lost', value: wonLost.lost ?? 0 },
  ];

  const followUpData = [
    { name: 'Overdue', value: followUps.overdue ?? 0 },
    { name: 'Completed', value: followUps.completed ?? 0 },
  ];

  return (
    <section id="analytics" className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Analytics</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">RFQ Conversion KPIs</h3>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-sm font-semibold text-charcoal">RFQs Received — Last 30 Days</h4>
          {hasSeriesData(rfqsReceived) ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={rfqsReceived}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} hide={rfqsReceived.length > 14} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart title="No RFQ trend data yet" message="RFQ submissions will populate this chart after launch activity begins." />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-sm font-semibold text-charcoal">Quotes Sent — Last 30 Days</h4>
          {hasSeriesData(quotesSent) ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={quotesSent}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} hide={quotesSent.length > 14} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart title="No quote send trend data yet" message="Manual quote send events will appear here once quoting activity begins." />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-sm font-semibold text-charcoal">Won vs Lost — This Month</h4>
          {(wonLost.won ?? 0) + (wonLost.lost ?? 0) > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={wonLostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart title="No won/lost outcomes yet" message="Closed outcomes for the current month will display here." />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-sm font-semibold text-charcoal">Follow-Ups — Overdue vs Completed</h4>
          {(followUps.overdue ?? 0) + (followUps.completed ?? 0) > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={followUpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart title="No follow-up analytics yet" message="Follow-up activity will populate this chart once reminders are used." />
          )}
        </div>
      </div>
    </section>
  );
}
