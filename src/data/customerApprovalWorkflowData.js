import { DISPLAY_MODES } from './testimonialWorkflowData';

export const TEMPLATE_TYPES = [
  { value: 'testimonial_request', label: 'Testimonial Request' },
  { value: 'testimonial_approval', label: 'Testimonial Final Approval' },
  { value: 'case_study_request', label: 'Case Study Request' },
  { value: 'case_study_approval', label: 'Case Study Final Approval' },
  { value: 'photo_approval', label: 'Project Photo Approval' },
  { value: 'final_publication_confirmation', label: 'Final Publication Confirmation' },
];

export const REQUEST_TYPES = [
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'photo', label: 'Photo' },
  { value: 'publication_confirmation', label: 'Publication Confirmation' },
];

export const REQUEST_STATUSES = [
  'draft',
  'copied',
  'sent_manually',
  'awaiting_response',
  'approved',
  'declined',
  'archived',
];

export const TEMPLATE_TYPE_TO_REQUEST_TYPE = {
  testimonial_request: 'testimonial',
  testimonial_approval: 'testimonial',
  case_study_request: 'case_study',
  case_study_approval: 'case_study',
  photo_approval: 'photo',
  final_publication_confirmation: 'publication_confirmation',
};

export function getDisplayModeLabel(mode) {
  return DISPLAY_MODES.find((item) => item.value === mode)?.label ?? mode ?? 'Anonymous';
}

export function fillApprovalTemplate(text, data = {}) {
  const replacements = {
    customer_name: data.customer_name || '[Customer Name]',
    customer_company: data.customer_company || '[Customer Company]',
    customer_email: data.customer_email || '[Customer Email]',
    testimonial_text: data.testimonial_text || '[Testimonial Text]',
    display_format: data.display_format || '[Display Format]',
    project_title: data.project_title || '[Project Title]',
    case_study_summary: data.case_study_summary || '[Case Study Summary]',
    publication_mode: data.publication_mode || '[Publication Mode]',
    approved_usage: data.approved_usage || '[Approved Usage]',
  };

  return String(text ?? '').replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? `[${key}]`);
}

export function generateDraftFromTemplate(template, context = {}) {
  const subject = fillApprovalTemplate(template?.subject ?? '', context);
  const body = fillApprovalTemplate(template?.body ?? '', context);
  return { subject, body };
}

export function buildContextFromRelatedContent({ testimonial, caseStudy, form = {} }) {
  const context = {
    customer_name: form.customer_name || testimonial?.customer_name || caseStudy?.customer_name || '',
    customer_company: form.customer_company || testimonial?.customer_company || caseStudy?.customer_company || '',
    customer_email: form.customer_email || '',
    testimonial_text: form.testimonial_text || testimonial?.quote || '',
    display_format: form.display_format || getDisplayModeLabel(testimonial?.display_mode),
    project_title: form.project_title || caseStudy?.title || '',
    case_study_summary: form.case_study_summary || caseStudy?.public_summary || '',
    publication_mode: form.publication_mode || getDisplayModeLabel(caseStudy?.customer_display_mode),
    approved_usage: form.approved_usage || (testimonial?.allowed_usage ?? caseStudy?.allowed_usage ?? ['website']).join(', '),
  };
  return context;
}

export function computeDashboardStats(requests = [], testimonials = [], caseStudies = []) {
  const byStatus = (status) => requests.filter((r) => r.status === status).length;

  return {
    draftRequests: byStatus('draft') + byStatus('copied'),
    awaitingResponse: byStatus('awaiting_response') + byStatus('sent_manually'),
    approved: byStatus('approved'),
    declined: byStatus('declined'),
    publishedContent:
      testimonials.filter((t) => t.status === 'published').length +
      caseStudies.filter((c) => c.status === 'published').length,
    pendingReviews: requests.filter((r) =>
      ['draft', 'copied', 'sent_manually', 'awaiting_response'].includes(r.status)
    ).length,
  };
}
