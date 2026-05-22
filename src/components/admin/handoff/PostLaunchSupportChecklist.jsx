import { POST_LAUNCH_SUPPORT_ITEMS } from '../../../data/ownerHandoffData';

const PHASES = [
  { id: '24h', label: 'First 24 Hours' },
  { id: '7d', label: 'First 7 Days' },
  { id: '30d', label: 'First 30 Days' },
];

export default function PostLaunchSupportChecklist({ items = {}, onToggle, onNotesChange }) {
  return (
    <section className="handoff-post-launch-checklist rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Post-Launch Support</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Support & Monitoring Checklist</h3>
      </div>

      <div className="space-y-6">
        {PHASES.map((phase) => (
          <div key={phase.id}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">{phase.label}</h4>
            <ul className="mt-3 space-y-3">
              {POST_LAUNCH_SUPPORT_ITEMS.filter((item) => item.phase === phase.id).map((item) => {
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
                      <span className="text-sm text-charcoal">{item.label}</span>
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
          </div>
        ))}
      </div>
    </section>
  );
}
