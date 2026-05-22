import { useMemo, useState } from 'react';
import { Copy, Send } from 'lucide-react';
import AccessibleButton from '../../AccessibleButton';
import TestimonialRequestHistory from './TestimonialRequestHistory';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function TestimonialRequestBuilder({
  templates,
  requestLogs,
  onGenerate,
  onCopy,
  onMarkCopied,
  onMarkSent,
  onMarkReceived,
  saving,
}) {
  const defaultTemplate = useMemo(() => templates.find((t) => t.is_default) ?? templates[0], [templates]);
  const [form, setForm] = useState({
    customer_name: '',
    customer_company: '',
    customer_email: '',
    project_type: '',
    relationship_context: '',
    requested_usage: 'website',
    custom_note: '',
  });
  const [draft, setDraft] = useState(null);
  const [activeLogId, setActiveLogId] = useState(null);

  const handleGenerate = async () => {
    const result = await onGenerate(form, defaultTemplate);
    setDraft(result);
  };

  const handleCopy = async () => {
    if (!draft) return;
    const text = `Subject: ${draft.subject}\n\n${draft.body}`;
    await navigator.clipboard.writeText(text);
    if (activeLogId) await onMarkCopied(activeLogId);
  };

  const handleCreateAndCopy = async () => {
    const log = await onGenerate(form, defaultTemplate, true);
    setDraft(log);
    setActiveLogId(log.id);
    const text = `Subject: ${log.subject}\n\n${log.body}`;
    await navigator.clipboard.writeText(text);
    await onMarkCopied(log.id);
  };

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-charcoal">Testimonial Request Builder</h3>
        <p className="mt-1 text-sm text-metallic">Generate a manual-send request email. Email is not sent automatically.</p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Customer Name
          <input type="text" value={form.customer_name} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Customer Company
          <input type="text" value={form.customer_company} onChange={(e) => setForm((f) => ({ ...f, customer_company: e.target.value }))} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Customer Email
          <input type="email" value={form.customer_email} onChange={(e) => setForm((f) => ({ ...f, customer_email: e.target.value }))} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Project Type
          <input type="text" value={form.project_type} onChange={(e) => setForm((f) => ({ ...f, project_type: e.target.value }))} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic md:col-span-2">
          Relationship Context
          <input type="text" value={form.relationship_context} onChange={(e) => setForm((f) => ({ ...f, relationship_context: e.target.value }))} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
          Requested Usage
          <input type="text" value={form.requested_usage} onChange={(e) => setForm((f) => ({ ...f, requested_usage: e.target.value }))} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-metallic md:col-span-2">
          Custom Note
          <textarea value={form.custom_note} onChange={(e) => setForm((f) => ({ ...f, custom_note: e.target.value }))} rows={2} className={`mt-1 ${inputClass}`} />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <AccessibleButton type="button" onClick={handleGenerate} disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
          Generate Request Draft
        </AccessibleButton>
        <AccessibleButton type="button" onClick={handleCreateAndCopy} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal">
          <Copy className="h-4 w-4" aria-hidden="true" />
          Copy Email
        </AccessibleButton>
        {activeLogId ? (
          <>
            <AccessibleButton type="button" onClick={() => onMarkSent(activeLogId)} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal">
              <Send className="h-4 w-4" aria-hidden="true" />
              Mark Manually Sent
            </AccessibleButton>
            <AccessibleButton type="button" onClick={() => onMarkReceived(activeLogId)} disabled={saving} className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800">
              Mark Testimonial Received
            </AccessibleButton>
          </>
        ) : null}
      </div>

      {draft ? (
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Subject</p>
          <p className="mt-1 font-medium text-charcoal">{draft.subject}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-metallic">Body</p>
          <pre className="mt-2 whitespace-pre-wrap text-sm text-charcoal">{draft.body}</pre>
          <AccessibleButton type="button" onClick={handleCopy} className="mt-4 text-sm font-semibold text-accent">
            Copy to clipboard
          </AccessibleButton>
        </article>
      ) : null}

      <TestimonialRequestHistory logs={requestLogs} />
    </section>
  );
}
