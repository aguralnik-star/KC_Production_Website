import { useState } from 'react';
import { Calendar, CheckCircle2, ChevronUp, ExternalLink, Moon, X } from 'lucide-react';
import { addBusinessDays, toDateString } from '../../services/rfqReminderService';

const PRIORITY_ORDER = ['low', 'normal', 'high', 'urgent'];

export default function RFQFollowUpQuickActions({
  item,
  onOpenRfq,
  onScheduleFollowUp,
  onMarkComplete,
  onDismissUntil,
  onIncreasePriority,
  busy = false,
}) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const handleSchedule = async () => {
    if (!scheduleDate) return;
    await onScheduleFollowUp(item.id, new Date(`${scheduleDate}T09:00:00`).toISOString());
    setShowSchedule(false);
    setScheduleDate('');
  };

  const nextPriority = () => {
    const currentIndex = PRIORITY_ORDER.indexOf(item.follow_up_priority ?? 'normal');
    return PRIORITY_ORDER[Math.min(currentIndex + 1, PRIORITY_ORDER.length - 1)];
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onOpenRfq(item.id)}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-charcoal hover:bg-slate-50 disabled:opacity-50"
          title="Open RFQ Detail"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Open
        </button>
        <button
          type="button"
          onClick={() => setShowSchedule((prev) => !prev)}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-charcoal hover:bg-slate-50 disabled:opacity-50"
        >
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          Schedule
        </button>
        <button
          type="button"
          onClick={() => onMarkComplete(item.id)}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          Complete
        </button>
        <button
          type="button"
          onClick={() => onDismissUntil(item.id, toDateString(addBusinessDays(new Date(), 1)))}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-charcoal hover:bg-slate-50 disabled:opacity-50"
        >
          <Moon className="h-3.5 w-3.5" aria-hidden="true" />
          Tomorrow
        </button>
        <button
          type="button"
          onClick={() => onDismissUntil(item.id, toDateString(addBusinessDays(new Date(), 7)))}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-charcoal hover:bg-slate-50 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Next Week
        </button>
        <button
          type="button"
          onClick={() => onIncreasePriority(item.id, nextPriority())}
          disabled={busy || item.follow_up_priority === 'urgent'}
          className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"
        >
          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          Priority
        </button>
      </div>

      {showSchedule && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
          />
          <button
            type="button"
            onClick={handleSchedule}
            disabled={busy || !scheduleDate}
            className="rounded bg-accent px-2 py-1 text-xs font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
