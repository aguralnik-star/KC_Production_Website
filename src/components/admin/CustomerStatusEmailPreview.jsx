import CopyToClipboardButton from './CopyToClipboardButton';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export default function CustomerStatusEmailPreview({
  draft,
  onChange,
  onSave,
  onMarkReady,
  saving,
  markingReady,
}) {
  if (!draft?.subject && !draft?.body) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-metallic">
        Generate a status update email draft to preview and edit it here.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-charcoal">Email Preview</h3>

      <div className="mt-4">
        <label htmlFor="status-draft-subject" className="block text-xs font-medium text-metallic">Subject</label>
        <input
          id="status-draft-subject"
          type="text"
          value={draft.subject}
          onChange={(e) => onChange?.({ ...draft, subject: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="status-draft-body" className="block text-xs font-medium text-metallic">Body</label>
        <textarea
          id="status-draft-body"
          rows={16}
          value={draft.body}
          onChange={(e) => onChange?.({ ...draft, body: e.target.value })}
          className={`${inputClass} font-mono text-[13px] leading-relaxed`}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CopyToClipboardButton text={draft.subject} label="Copy Subject" />
        <CopyToClipboardButton text={draft.body} label="Copy Body" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-white hover:bg-charcoal-light disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {draft.id && (
          <button
            type="button"
            onClick={onMarkReady}
            disabled={markingReady}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100 disabled:opacity-50"
          >
            {markingReady ? 'Updating…' : 'Mark Ready'}
          </button>
        )}
      </div>
    </div>
  );
}
