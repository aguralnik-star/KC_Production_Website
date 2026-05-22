import { AlertCircle } from 'lucide-react';
import RFQPublicStatusBadge from './RFQPublicStatusBadge';

const TIMELINE_STEPS = [
  { key: 'received', label: 'Received' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'quote_in_progress', label: 'Quote In Progress' },
  { key: 'quote_sent', label: 'Quote Sent' },
  { key: 'completed', label: 'Completed' },
];

const STATUS_RANK = {
  received: 0,
  under_review: 1,
  additional_info_needed: 1,
  quote_in_progress: 2,
  quote_sent: 3,
  completed: 4,
  closed: 4,
};

export default function RFQStatusTimeline({ publicStatus }) {
  if (publicStatus === 'closed') {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-charcoal">
        This RFQ has been closed. Contact K&amp;C if you have questions.
      </div>
    );
  }

  const currentRank = STATUS_RANK[publicStatus] ?? 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-charcoal">Status Progress</h3>
      <ol className="mt-4 grid gap-3 sm:grid-cols-5">
        {TIMELINE_STEPS.map((step, index) => {
          const stepRank = STATUS_RANK[step.key];
          const isComplete = currentRank > stepRank;
          const isCurrent = publicStatus === step.key
            || (publicStatus === 'additional_info_needed' && step.key === 'under_review');

          return (
            <li key={step.key} className="relative">
              <div className={`rounded-lg border px-3 py-3 text-center ${
                isCurrent
                  ? 'border-accent bg-accent/5'
                  : isComplete
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-slate-200 bg-slate-50'
              }`}>
                <p className={`text-xs font-semibold ${
                  isCurrent ? 'text-accent' : isComplete ? 'text-emerald-800' : 'text-metallic'
                }`}>
                  {index + 1}. {step.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {publicStatus === 'additional_info_needed' && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Additional information may be needed. Please check your email or contact K&amp;C.
        </div>
      )}
    </div>
  );
}
