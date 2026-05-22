import { useState } from 'react';
import { Save } from 'lucide-react';
import AccessibleButton from '../../AccessibleButton';
import { TEMPLATE_TYPES } from '../../../data/customerApprovalWorkflowData';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

function templateTypeLabel(type) {
  return TEMPLATE_TYPES.find((item) => item.value === type)?.label ?? type;
}

export default function ApprovalTemplateManager({ templates, onCreate, onUpdate, saving }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = templates.find((t) => t.id === selectedId) ?? null;
  const [form, setForm] = useState(null);
  const [creating, setCreating] = useState(false);

  const activeForm = form ?? selected ?? {
    template_type: 'testimonial_request',
    template_name: '',
    subject: '',
    body: '',
    is_default: false,
  };

  const handleSelect = (template) => {
    setSelectedId(template.id);
    setForm(null);
    setCreating(false);
  };

  const handleNew = () => {
    setSelectedId(null);
    setCreating(true);
    setForm({
      template_type: 'testimonial_request',
      template_name: '',
      subject: '',
      body: '',
      is_default: false,
    });
  };

  const handleSave = async () => {
    if (creating || !selectedId) {
      await onCreate(activeForm);
      setCreating(false);
      setForm(null);
    } else {
      await onUpdate(selectedId, activeForm);
      setForm(null);
    }
  };

  return (
    <section className="space-y-6" aria-labelledby="template-manager-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 id="template-manager-heading" className="text-lg font-bold text-charcoal">
            Template Manager
          </h3>
          <p className="mt-1 text-sm text-metallic">
            Manage approval email templates. Emails are never sent automatically.
          </p>
        </div>
        <AccessibleButton
          type="button"
          onClick={handleNew}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal"
        >
          New Template
        </AccessibleButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <nav aria-label="Approval templates">
          <ul className="space-y-2">
            {templates.map((template) => (
              <li key={template.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(template)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                    selectedId === template.id && !creating
                      ? 'border-accent bg-accent/5 text-charcoal'
                      : 'border-slate-200 text-charcoal hover:border-accent'
                  }`}
                >
                  <span className="block font-semibold">{template.template_name}</span>
                  <span className="mt-0.5 block text-xs text-metallic">
                    {templateTypeLabel(template.template_type)}
                    {template.is_default ? ' · Default' : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {(selected || creating) ? (
          <form
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Template Type
              <select
                value={activeForm.template_type}
                onChange={(e) => setForm((f) => ({ ...(f ?? activeForm), template_type: e.target.value }))}
                className={`mt-1 ${inputClass}`}
                disabled={!creating && Boolean(selectedId)}
              >
                {TEMPLATE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Template Name
              <input
                type="text"
                required
                value={activeForm.template_name}
                onChange={(e) => setForm((f) => ({ ...(f ?? activeForm), template_name: e.target.value }))}
                className={`mt-1 ${inputClass}`}
              />
            </label>

            <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Subject
              <input
                type="text"
                required
                value={activeForm.subject}
                onChange={(e) => setForm((f) => ({ ...(f ?? activeForm), subject: e.target.value }))}
                className={`mt-1 ${inputClass}`}
              />
            </label>

            <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Body
              <textarea
                required
                rows={12}
                value={activeForm.body}
                onChange={(e) => setForm((f) => ({ ...(f ?? activeForm), body: e.target.value }))}
                className={`mt-1 ${inputClass}`}
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={Boolean(activeForm.is_default)}
                onChange={(e) => setForm((f) => ({ ...(f ?? activeForm), is_default: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
              />
              Set as default for this template type
            </label>

            <AccessibleButton
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {saving ? 'Saving…' : 'Save Template'}
            </AccessibleButton>
          </form>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-metallic">
            Select a template to edit or create a new one.
          </p>
        )}
      </div>
    </section>
  );
}
