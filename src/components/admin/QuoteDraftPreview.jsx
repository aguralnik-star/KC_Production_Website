import CopyToClipboardButton from './CopyToClipboardButton';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export default function QuoteDraftPreview({
  draft,
  onChange,
  onSave,
  onMarkCopied,
  onMarkManuallySent,
  saving,
  loadingAction,
}) {
  if (!draft?.subject && !draft?.body) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-metallic">
        Generate a draft to preview and edit the email here.
      </div>
    );
  }

  const fullEmail = `Subject: ${draft.subject}\n\n${draft.body}`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-charcoal">Draft Preview</h3>

      <div className="mt-4">
        <label htmlFor="draft-subject" className="block text-xs font-medium text-metallic">Subject</label>
        <input
          id="draft-subject"
          type="text"
          value={draft.subject}
          onChange={(e) => onChange?.({ ...draft, subject: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="draft-body" className="block text-xs font-medium text-metallic">Body</label>
        <textarea
          id="draft-body"
          rows={14}
          value={draft.body}
          onChange={(e) => onChange?.({ ...draft, body: e.target.value })}
          className={`${inputClass} font-mono text-[13px] leading-relaxed`}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CopyToClipboardButton text={draft.subject} label="Copy Subject" />
        <CopyToClipboardButton text={draft.body} label="Copy Body" />
        <CopyToClipboardButton text={fullEmail} label="Copy Full Email" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-white hover:bg-charcoal-light disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Draft'}
        </button>
        {draft.id && (
          <>
            <button
              type="button"
              onClick={onMarkCopied}
              disabled={loadingAction}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal hover:border-accent hover:text-accent disabled:opacity-50"
            >
              Mark Copied
            </button>
            <button
              type="button"
              onClick={onMarkManuallySent}
              disabled={loadingAction}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
            >
              Mark Manually Sent
            </button>
          </>
        )}
      </div>
    </div>
  );
}
