import { OWNER_ACTION_ITEMS } from '../../../data/ownerHandoffData';

export default function OwnerActionChecklist({ items = {}, onToggle, onNotesChange }) {
  return (
    <section className="handoff-owner-checklist rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Owner Actions</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Pre-Launch Owner Checklist</h3>
        <p className="mt-1 text-sm text-metallic">
          Complete these items before final production launch approval.
        </p>
      </div>

      <ul className="space-y-3">
        {OWNER_ACTION_ITEMS.map((item) => {
          const state = items[item.id] ?? { completed: false, notes: '' };

          return (
            <li key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={state.completed}
                  onChange={(event) => onToggle(item.id, event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                />
                <span className="text-sm font-medium text-charcoal">{item.label}</span>
              </label>
              <input
                type="text"
                value={state.notes}
                onChange={(event) => onNotesChange(item.id, event.target.value)}
                className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Optional notes"
                aria-label={`Notes for ${item.label}`}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
