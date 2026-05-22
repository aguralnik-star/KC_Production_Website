import { GO_LIVE_PHASES } from '../../../data/goLiveData';

function phaseProgress(phase, checklist) {
  const total = phase.items.length;
  const completed = phase.items.filter((item) => checklist?.[item.id]?.completed).length;
  return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
}

export default function GoLiveChecklist({ phaseChecklists, onToggle, onNotesChange }) {
  return (
    <section className="space-y-6" aria-label="Go-live launch checklist">
      {GO_LIVE_PHASES.map((phase) => {
        const checklist = phaseChecklists?.[phase.id] ?? {};
        const progress = phaseProgress(phase, checklist);

        return (
          <article key={phase.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-charcoal">{phase.title}</h3>
              <p className="text-sm font-semibold text-metallic">
                {progress.completed}/{progress.total} complete ({progress.percent}%)
              </p>
            </div>

            <ul className="space-y-3">
              {phase.items.map((item) => {
                const entry = checklist[item.id] ?? { completed: false, notes: '' };
                return (
                  <li key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={entry.completed}
                        onChange={(event) => onToggle(phase.id, item.id, { completed: event.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                      />
                      <span className="flex-1">
                        <span className={`block text-sm font-medium ${entry.completed ? 'text-metallic line-through' : 'text-charcoal'}`}>
                          {item.label}
                        </span>
                        <textarea
                          value={entry.notes}
                          onChange={(event) => onNotesChange(phase.id, item.id, { notes: event.target.value })}
                          placeholder="Validation notes…"
                          rows={2}
                          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </article>
        );
      })}
    </section>
  );
}
