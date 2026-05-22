import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Mail, X } from 'lucide-react';
import AccessibleButton from '../../AccessibleButton';
import ApprovalPreviewPanel from './ApprovalPreviewPanel';
import ApprovalStatusBadge from './ApprovalStatusBadge';
import {
  TEMPLATE_TYPE_TO_REQUEST_TYPE,
  TEMPLATE_TYPES,
  buildContextFromRelatedContent,
  generateDraftFromTemplate,
} from '../../../data/customerApprovalWorkflowData';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function ApprovalRequestBuilder({
  templates,
  testimonials,
  caseStudies,
  customerReferences = [],
  onCreateCustomerReference,
  activeRequest,
  onGenerate,
  onSaveRequest,
  onMarkCopied,
  onMarkSent,
  onMarkAwaiting,
  onMarkApproved,
  onMarkDeclined,
  saving,
}) {
  const defaultTemplate = useMemo(
    () => templates.find((t) => t.is_default && t.template_type === 'testimonial_request') ?? templates[0],
    [templates]
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplate?.id ?? '');
  const [form, setForm] = useState({
    customer_reference_id: '',
    customer_name: '',
    customer_company: '',
    customer_email: '',
    related_testimonial_id: '',
    related_case_study_id: '',
    testimonial_text: '',
    display_format: '',
    project_title: '',
    case_study_summary: '',
    publication_mode: '',
    approved_usage: 'website',
    internal_notes: '',
  });
  const [draft, setDraft] = useState(null);
  const [activeRequestId, setActiveRequestId] = useState(activeRequest?.id ?? null);
  const [approvalNotes, setApprovalNotes] = useState('');

  useEffect(() => {
    if (activeRequest?.id) {
      setActiveRequestId(activeRequest.id);
      setDraft({ subject: activeRequest.subject, body: activeRequest.body });
      setForm((f) => ({
        ...f,
        customer_name: activeRequest.customer_name ?? f.customer_name,
        customer_company: activeRequest.customer_company ?? f.customer_company,
        customer_email: activeRequest.customer_email ?? f.customer_email,
        customer_reference_id: activeRequest.customer_reference_id ?? f.customer_reference_id,
        related_testimonial_id: activeRequest.related_testimonial_id ?? f.related_testimonial_id,
        related_case_study_id: activeRequest.related_case_study_id ?? f.related_case_study_id,
        internal_notes: activeRequest.internal_notes ?? f.internal_notes,
      }));
      setApprovalNotes(activeRequest.approval_notes ?? '');
    }
  }, [activeRequest]);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? defaultTemplate;

  const selectedReference = customerReferences.find((r) => r.id === form.customer_reference_id);

  const applyReference = (refId) => {
    const ref = customerReferences.find((r) => r.id === refId);
    setForm((f) => ({
      ...f,
      customer_reference_id: refId,
      customer_name: ref?.customer_name ?? f.customer_name,
      customer_company: ref?.customer_company ?? f.customer_company,
      customer_email: ref?.customer_email ?? f.customer_email,
    }));
  };

  const relatedTestimonial = testimonials.find((t) => t.id === form.related_testimonial_id);
  const relatedCaseStudy = caseStudies.find((c) => c.id === form.related_case_study_id);

  const buildDraft = () => {
    const context = buildContextFromRelatedContent({
      testimonial: relatedTestimonial,
      caseStudy: relatedCaseStudy,
      form,
    });
    return generateDraftFromTemplate(selectedTemplate, context);
  };

  const handleGenerate = () => {
    const result = buildDraft();
    setDraft(result);
  };

  const handleSave = async () => {
    const result = draft ?? buildDraft();
    const requestType = TEMPLATE_TYPE_TO_REQUEST_TYPE[selectedTemplate?.template_type] ?? 'testimonial';
    const saved = await onSaveRequest({
      request_type: requestType,
      customer_name: form.customer_name,
      customer_company: form.customer_company,
      customer_email: form.customer_email,
      related_testimonial_id: form.related_testimonial_id || null,
      related_case_study_id: form.related_case_study_id || null,
      customer_reference_id: form.customer_reference_id || null,
      subject: result.subject,
      body: result.body,
      internal_notes: form.internal_notes,
    });
    setDraft({ subject: saved.subject, body: saved.body });
    setActiveRequestId(saved.id);
  };

  const handleCopy = async () => {
    const result = draft ?? buildDraft();
    const text = `Subject: ${result.subject}\n\n${result.body}`;
    await navigator.clipboard.writeText(text);
    if (activeRequestId) await onMarkCopied(activeRequestId);
  };

  const handleCopyAndSave = async () => {
    const result = buildDraft();
    setDraft(result);
    const requestType = TEMPLATE_TYPE_TO_REQUEST_TYPE[selectedTemplate?.template_type] ?? 'testimonial';
    const saved = await onSaveRequest({
      request_type: requestType,
      customer_name: form.customer_name,
      customer_company: form.customer_company,
      customer_email: form.customer_email,
      related_testimonial_id: form.related_testimonial_id || null,
      related_case_study_id: form.related_case_study_id || null,
      customer_reference_id: form.customer_reference_id || null,
      subject: result.subject,
      body: result.body,
      internal_notes: form.internal_notes,
    });
    setActiveRequestId(saved.id);
    const text = `Subject: ${result.subject}\n\n${result.body}`;
    await navigator.clipboard.writeText(text);
    await onMarkCopied(saved.id);
  };

  const showTestimonialFields = ['testimonial_request', 'testimonial_approval'].includes(selectedTemplate?.template_type);
  const showCaseStudyFields = ['case_study_request', 'case_study_approval'].includes(selectedTemplate?.template_type);
  const showPublicationFields = selectedTemplate?.template_type === 'final_publication_confirmation';

  return (
    <section className="space-y-6" aria-labelledby="request-builder-heading">
      <div>
        <h3 id="request-builder-heading" className="text-lg font-bold text-charcoal">
          Request Builder
        </h3>
        <p className="mt-1 text-sm text-metallic">
          Select a template, link related content, generate a draft, and record the manual send workflow.
        </p>
      </div>

      {activeRequest ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <span className="font-semibold text-charcoal">Active request:</span>
          <ApprovalStatusBadge status={activeRequest.status} />
          <span className="text-metallic">{activeRequest.customer_name || 'Unnamed customer'}</span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
            Template
            <select
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                setDraft(null);
              }}
              className={`mt-1 ${inputClass}`}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {TEMPLATE_TYPES.find((t) => t.value === template.template_type)?.label ?? template.template_name}
                  {template.is_default ? ' (Default)' : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-metallic md:col-span-2">
            Customer Reference
            <div className="mt-1 flex flex-wrap gap-2">
              <select
                value={form.customer_reference_id}
                onChange={(e) => applyReference(e.target.value)}
                className={`flex-1 ${inputClass}`}
              >
                <option value="">None — enter customer manually</option>
                {customerReferences.map((ref) => (
                  <option key={ref.id} value={ref.id}>
                    {ref.customer_company || ref.customer_name || ref.id}
                    {ref.do_not_contact ? ' (DNC)' : ''}
                  </option>
                ))}
              </select>
              {onCreateCustomerReference ? (
                <AccessibleButton
                  type="button"
                  onClick={async () => {
                    const created = await onCreateCustomerReference({
                      customer_name: form.customer_name,
                      customer_company: form.customer_company,
                      customer_email: form.customer_email,
                    });
                    if (created?.id) applyReference(created.id);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-charcoal"
                >
                  New Reference
                </AccessibleButton>
              ) : null}
            </div>
            {selectedReference?.do_not_contact ? (
              <p className="mt-1 text-xs text-red-700" role="alert">This customer reference is marked do not contact.</p>
            ) : null}
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
            Customer Name
            <input
              type="text"
              id="approval-customer-name"
              value={form.customer_name}
              onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
            Customer Company
            <input
              type="text"
              id="approval-customer-company"
              value={form.customer_company}
              onChange={(e) => setForm((f) => ({ ...f, customer_company: e.target.value }))}
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
            Customer Email
            <input
              type="email"
              id="approval-customer-email"
              value={form.customer_email}
              onChange={(e) => setForm((f) => ({ ...f, customer_email: e.target.value }))}
              className={`mt-1 ${inputClass}`}
            />
          </label>

          {(showTestimonialFields || selectedTemplate?.template_type === 'photo_approval') ? (
            <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Related Testimonial
              <select
                value={form.related_testimonial_id}
                onChange={(e) => setForm((f) => ({ ...f, related_testimonial_id: e.target.value }))}
                className={`mt-1 ${inputClass}`}
              >
                <option value="">None</option>
                {testimonials.map((t) => (
                  <option key={t.id} value={t.id}>
                    {(t.customer_name || t.quote?.slice(0, 40) || 'Draft testimonial').trim()}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {(showCaseStudyFields || selectedTemplate?.template_type === 'photo_approval') ? (
            <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Related Case Study
              <select
                value={form.related_case_study_id}
                onChange={(e) => setForm((f) => ({ ...f, related_case_study_id: e.target.value }))}
                className={`mt-1 ${inputClass}`}
              >
                <option value="">None</option>
                {caseStudies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title || 'Untitled case study'}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {showTestimonialFields ? (
            <>
              <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                Testimonial Text
                <textarea
                  rows={3}
                  value={form.testimonial_text}
                  onChange={(e) => setForm((f) => ({ ...f, testimonial_text: e.target.value }))}
                  className={`mt-1 ${inputClass}`}
                />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                Display Format
                <input
                  type="text"
                  value={form.display_format}
                  onChange={(e) => setForm((f) => ({ ...f, display_format: e.target.value }))}
                  className={`mt-1 ${inputClass}`}
                  placeholder="e.g. Anonymous testimonial"
                />
              </label>
            </>
          ) : null}

          {showCaseStudyFields ? (
            <>
              <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                Project Title
                <input
                  type="text"
                  value={form.project_title}
                  onChange={(e) => setForm((f) => ({ ...f, project_title: e.target.value }))}
                  className={`mt-1 ${inputClass}`}
                />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                Case Study Summary
                <textarea
                  rows={3}
                  value={form.case_study_summary}
                  onChange={(e) => setForm((f) => ({ ...f, case_study_summary: e.target.value }))}
                  className={`mt-1 ${inputClass}`}
                />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
                Publication Mode
                <input
                  type="text"
                  value={form.publication_mode}
                  onChange={(e) => setForm((f) => ({ ...f, publication_mode: e.target.value }))}
                  className={`mt-1 ${inputClass}`}
                  placeholder="e.g. Anonymous publication"
                />
              </label>
            </>
          ) : null}

          {showPublicationFields ? (
            <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
              Approved Usage
              <input
                type="text"
                value={form.approved_usage}
                onChange={(e) => setForm((f) => ({ ...f, approved_usage: e.target.value }))}
                className={`mt-1 ${inputClass}`}
              />
            </label>
          ) : null}

          <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
            Internal Notes
            <textarea
              rows={2}
              value={form.internal_notes}
              onChange={(e) => setForm((f) => ({ ...f, internal_notes: e.target.value }))}
              className={`mt-1 ${inputClass}`}
            />
          </label>
        </div>

        <ApprovalPreviewPanel subject={draft?.subject} body={draft?.body} />
      </div>

      <div className="flex flex-wrap gap-2">
        <AccessibleButton
          type="button"
          onClick={handleGenerate}
          disabled={saving}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Generate Draft
        </AccessibleButton>
        <AccessibleButton
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal"
        >
          Save Request Record
        </AccessibleButton>
        <AccessibleButton
          type="button"
          onClick={handleCopy}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal"
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
          Copy Email
        </AccessibleButton>
        <AccessibleButton
          type="button"
          onClick={handleCopyAndSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal"
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
          Save &amp; Copy
        </AccessibleButton>
      </div>

      {activeRequestId ? (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-sm font-bold text-charcoal">Workflow Actions</h4>
          <p className="text-sm text-metallic">
            Record each step after manual email handling. No emails are sent from this system.
          </p>
          <div className="flex flex-wrap gap-2">
            <AccessibleButton
              type="button"
              onClick={() => onMarkSent(activeRequestId)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Mark Sent Manually
            </AccessibleButton>
            <AccessibleButton
              type="button"
              onClick={() => onMarkAwaiting(activeRequestId)}
              disabled={saving}
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800"
            >
              Mark Awaiting Response
            </AccessibleButton>
          </div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
            Approval / Decline Notes
            <textarea
              rows={2}
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <AccessibleButton
              type="button"
              onClick={() => onMarkApproved(activeRequestId, approvalNotes)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Record Approval
            </AccessibleButton>
            <AccessibleButton
              type="button"
              onClick={() => onMarkDeclined(activeRequestId, approvalNotes)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Record Declined
            </AccessibleButton>
          </div>
        </div>
      ) : null}
    </section>
  );
}
