import RFQAlertBadge from './RFQAlertBadge';
import RFQFollowUpQuickActions from './RFQFollowUpQuickActions';
import RFQStatusBadge from './RFQStatusBadge';

const BUCKET_LABELS = {
  overdue: 'Overdue',
  due_today: 'Due Today',
  upcoming: 'Upcoming',
  no_follow_up: 'No Follow-Up Scheduled',
};

const BUCKET_EMPTY = {
  overdue: 'No overdue follow-ups.',
  due_today: 'No follow-ups due today.',
  upcoming: 'No upcoming follow-ups.',
  no_follow_up: 'All active RFQs have follow-ups scheduled.',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function QueueTable({ items, onOpenRfq, onScheduleFollowUp, onMarkComplete, onDismissUntil, onIncreasePriority, actionBusyId }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">Company</th>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">Contact</th>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">RFQ Status</th>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">Project Type</th>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">Quote Sent</th>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">Next Follow-Up</th>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">Days Overdue</th>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">Priority</th>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">Alert Level</th>
            <th className="px-4 py-3 text-left font-semibold text-charcoal">Quick Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id} className="align-top hover:bg-slate-50/80">
              <td className="px-4 py-3 font-medium text-charcoal">{item.company || '—'}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-charcoal">{item.name}</div>
                <div className="text-xs text-metallic">{item.email}</div>
              </td>
              <td className="px-4 py-3"><RFQStatusBadge status={item.status} /></td>
              <td className="px-4 py-3 capitalize text-charcoal">{item.project_type?.replace('_', ' ') || '—'}</td>
              <td className="px-4 py-3 text-charcoal">{formatDate(item.quote_sent_at)}</td>
              <td className="px-4 py-3 text-charcoal">{formatDate(item.next_follow_up_at)}</td>
              <td className="px-4 py-3">
                {item.days_overdue > 0 ? (
                  <span className="font-semibold text-red-700">{item.days_overdue}</span>
                ) : (
                  '—'
                )}
              </td>
              <td className="px-4 py-3 capitalize text-charcoal">{item.follow_up_priority || 'normal'}</td>
              <td className="px-4 py-3">
                <RFQAlertBadge level={item.overdue_alert_level || 'none'} />
              </td>
              <td className="px-4 py-3 min-w-[220px]">
                <RFQFollowUpQuickActions
                  item={item}
                  onOpenRfq={onOpenRfq}
                  onScheduleFollowUp={onScheduleFollowUp}
                  onMarkComplete={onMarkComplete}
                  onDismissUntil={onDismissUntil}
                  onIncreasePriority={onIncreasePriority}
                  busy={actionBusyId === item.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RFQReminderQueue({
  groups,
  onOpenRfq,
  onScheduleFollowUp,
  onMarkComplete,
  onDismissUntil,
  onIncreasePriority,
  actionBusyId,
}) {
  const hasAnyItems = groups.some(({ items }) => items.length > 0);

  if (!hasAnyItems) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-metallic">
        No follow-up items match the current filters.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map(({ bucket, items }) => (
        <section key={bucket}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-charcoal">{BUCKET_LABELS[bucket]}</h3>
            <span className="text-sm text-metallic">{items.length}</span>
          </div>
          {items.length === 0 ? (
            <p className="rounded-lg border border-slate-100 bg-white px-4 py-6 text-sm text-metallic">
              {BUCKET_EMPTY[bucket]}
            </p>
          ) : (
            <QueueTable
              items={items}
              onOpenRfq={onOpenRfq}
              onScheduleFollowUp={onScheduleFollowUp}
              onMarkComplete={onMarkComplete}
              onDismissUntil={onDismissUntil}
              onIncreasePriority={onIncreasePriority}
              actionBusyId={actionBusyId}
            />
          )}
        </section>
      ))}
    </div>
  );
}
