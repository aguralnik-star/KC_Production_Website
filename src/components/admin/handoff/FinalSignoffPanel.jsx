import { LAUNCH_DECISION_OPTIONS, SIGNOFF_CHECKLIST_ITEMS } from '../../../data/ownerHandoffData';
import AccessibleButton from '../../AccessibleButton';

export default function FinalSignoffPanel({
  signoffChecklist = {},
  finalSignoff = {},
  onChecklistToggle,
  onSignoffChange,
  onSave,
  saving = false,
}) {
  return (
    <section className="handoff-final-signoff rounded-2xl border border-charcoal bg-charcoal p-6 text-white shadow-sm print:border-slate-300 print:bg-white print:text-charcoal">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">Executive Sign-Off</p>
        <h3 className="mt-1 text-xl font-bold">Final Launch Signoff</h3>
        <p className="mt-2 text-sm text-slate-300 print:text-metallic">
          Complete the checklist and record owner approval for production launch.
        </p>
      </div>

      <ul className="mb-6 grid gap-2 sm:grid-cols-2">
        {SIGNOFF_CHECKLIST_ITEMS.map((item) => {
          const state = signoffChecklist[item.id] ?? { completed: false };

          return (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm print:border print:border-slate-200 print:bg-white">
                <input
                  type="checkbox"
                  checked={state.completed}
                  onChange={(event) => onChecklistToggle(item.id, event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                />
                {item.label}
              </label>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="owner-name" className="text-sm font-semibold">
            Owner Name
          </label>
          <input
            id="owner-name"
            type="text"
            value={finalSignoff.ownerName ?? ''}
            onChange={(event) => onSignoffChange({ ownerName: event.target.value })}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 print:border-slate-200 print:bg-white print:text-charcoal"
            placeholder="Authorized owner or manager"
          />
        </div>
        <div>
          <label htmlFor="signoff-date" className="text-sm font-semibold">
            Signoff Date
          </label>
          <input
            id="signoff-date"
            type="date"
            value={finalSignoff.signoffDate ?? ''}
            onChange={(event) => onSignoffChange({ signoffDate: event.target.value })}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white print:border-slate-200 print:bg-white print:text-charcoal"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="launch-decision" className="text-sm font-semibold">
            Launch Decision
          </label>
          <select
            id="launch-decision"
            value={finalSignoff.launchDecision ?? 'conditional'}
            onChange={(event) => onSignoffChange({ launchDecision: event.target.value })}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white print:border-slate-200 print:bg-white print:text-charcoal"
          >
            {LAUNCH_DECISION_OPTIONS.map((option) => (
              <option key={option} value={option} className="text-charcoal">
                {option.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="signoff-notes" className="text-sm font-semibold">
            Notes
          </label>
          <textarea
            id="signoff-notes"
            value={finalSignoff.notes ?? ''}
            onChange={(event) => onSignoffChange({ notes: event.target.value })}
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 print:border-slate-200 print:bg-white print:text-charcoal"
            placeholder="Conditions, training notes, or launch approval comments."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <AccessibleButton type="button" onClick={onSave} disabled={saving}>
          Save Signoff
        </AccessibleButton>
        <AccessibleButton type="button" variant="secondary" onClick={() => window.print()}>
          Print Signoff
        </AccessibleButton>
      </div>
    </section>
  );
}
