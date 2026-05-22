import AccessibleButton from '../../AccessibleButton';

export default function ContentEvidenceNotes({ notes, onChange, onSave, saving = false }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Evidence Notes</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Content QA Evidence & Sign-Off</h3>
        <p className="mt-1 text-sm text-metallic">
          Record page review notes, claim verification evidence, replacement language decisions, and final approval.
        </p>
      </div>

      <textarea
        value={notes}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
        placeholder="Example: Verified equipment list against shop floor inventory. Medical/Military pages reviewed — industry served only, no certification claims."
      />

      <div className="mt-4 flex justify-end">
        <AccessibleButton type="button" onClick={onSave} disabled={saving}>
          Save Notes
        </AccessibleButton>
      </div>
    </section>
  );
}
