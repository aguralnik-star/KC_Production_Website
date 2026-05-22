export const APPROVAL_STATUSES = [
  'draft',
  'pending_customer_approval',
  'approved',
  'needs_revision',
  'rejected',
  'published',
  'archived',
];

export const RISK_LEVELS = ['low', 'medium', 'high', 'critical'];

export const ALLOWED_USAGE_OPTIONS = [
  'website',
  'sales materials',
  'proposals',
  'social media',
  'anonymous only',
];

export const REPLACEMENT_QUEUE = [
  { id: 'q-homepage-testimonials', priority: 1, label: 'Homepage testimonials', type: 'testimonial', target: 'homepage' },
  { id: 'q-project-showcase', priority: 2, label: 'Project showcase images', type: 'photo', target: 'projects' },
  { id: 'q-project-case-studies', priority: 3, label: 'Project detail case studies', type: 'case_study', target: 'projects' },
  { id: 'q-industries-proof', priority: 4, label: 'Industries page proof points', type: 'case_study', target: 'industries' },
  { id: 'q-service-examples', priority: 5, label: 'Service page examples', type: 'photo', target: 'services' },
  { id: 'q-sales-support', priority: 6, label: 'Sales/quote support content', type: 'mixed', target: 'sales' },
];

export const TESTIMONIAL_SAFETY_CHECKLIST = [
  { id: 'quote_approved', label: 'Customer approved quote' },
  { id: 'name_approved', label: 'Customer approved name usage' },
  { id: 'company_approved', label: 'Customer approved company usage' },
  { id: 'no_confidential', label: 'No confidential project details' },
  { id: 'no_pricing', label: 'No pricing details' },
  { id: 'no_unsupported', label: 'No unsupported claims' },
  { id: 'final_wording', label: 'Final wording approved' },
];

export const PHOTO_SAFETY_CHECKLIST = [
  { id: 'no_drawings', label: 'No customer drawings visible' },
  { id: 'no_part_numbers', label: 'No customer part numbers visible' },
  { id: 'no_proprietary_labels', label: 'No proprietary labels visible' },
  { id: 'no_confidential_fixtures', label: 'No confidential fixtures visible' },
  { id: 'no_employee_pii', label: 'No employee personal info visible' },
  { id: 'public_use_approved', label: 'Image approved for public use' },
  { id: 'web_optimized', label: 'Image optimized for web' },
];

export const CASE_STUDY_SAFETY_CHECKLIST = [
  { id: 'publication_approved', label: 'Customer approved publication' },
  { id: 'no_dimensions', label: 'No confidential dimensions' },
  { id: 'no_drawings', label: 'No protected drawings' },
  { id: 'no_pricing', label: 'No pricing' },
  { id: 'no_secrets', label: 'No customer secrets' },
  { id: 'no_unsupported', label: 'No unsupported performance claims' },
  { id: 'photos_approved', label: 'Photos approved' },
  { id: 'quote_approved', label: 'Quote approved' },
];

export const CONFIDENTIALITY_REVIEW_ITEMS = [
  { id: 'no_drawings', label: 'No customer drawings' },
  { id: 'no_part_numbers', label: 'No part numbers' },
  { id: 'no_proprietary_geometry', label: 'No proprietary geometry if restricted' },
  { id: 'no_pricing', label: 'No pricing' },
  { id: 'no_secrets', label: 'No customer secrets' },
  { id: 'no_employee_pii', label: 'No employee private information' },
  { id: 'no_unsupported', label: 'No unsupported claims' },
  { id: 'approval_documented', label: 'Approval documented' },
];

export const REPLACEMENT_DOCUMENTS = [
  { file: 'REAL_CONTENT_REPLACEMENT_SYSTEM.md', title: 'Real Content Replacement System' },
  { file: 'CUSTOMER_TESTIMONIAL_APPROVAL_GUIDE.md', title: 'Customer Testimonial Approval Guide' },
  { file: 'PROJECT_PHOTO_APPROVAL_GUIDE.md', title: 'Project Photo Approval Guide' },
  { file: 'CASE_STUDY_APPROVAL_TEMPLATE.md', title: 'Case Study Approval Template' },
  { file: 'CONTENT_CONFIDENTIALITY_REVIEW_CHECKLIST.md', title: 'Content Confidentiality Review Checklist' },
];

function buildChecklistDefaults(items) {
  return items.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});
}

export function buildDefaultTestimonial(id = `test-${Date.now()}`) {
  return {
    id,
    customerName: '',
    customerCompany: '',
    customerRole: '',
    testimonialQuote: '',
    permissionReceived: false,
    approvalDate: '',
    approvedDisplayName: '',
    approvedCompanyDisplay: '',
    allowedUsage: [],
    status: 'draft',
    riskLevel: 'medium',
    notes: '',
    safetyChecklist: buildChecklistDefaults(TESTIMONIAL_SAFETY_CHECKLIST),
    confidentialityReviewed: false,
    isCustomerApproved: false,
    publishReady: false,
    sourceType: 'real',
    createdAt: new Date().toISOString(),
  };
}

export function buildDefaultPhoto(id = `photo-${Date.now()}`) {
  return {
    id,
    photoTitle: '',
    category: '',
    imageFilename: '',
    relatedCapability: '',
    relatedProject: '',
    customerApprovalRequired: true,
    approvalReceived: false,
    approvedUsage: [],
    status: 'draft',
    riskLevel: 'high',
    notes: '',
    safetyChecklist: buildChecklistDefaults(PHOTO_SAFETY_CHECKLIST),
    confidentialityReviewed: false,
    isCustomerApproved: false,
    publishReady: false,
    sourceType: 'real',
    createdAt: new Date().toISOString(),
  };
}

export function buildDefaultCaseStudy(id = `case-${Date.now()}`) {
  return {
    id,
    caseStudyTitle: '',
    customerApprovedName: '',
    anonymousOrNamed: 'anonymous',
    industry: '',
    capability: '',
    material: '',
    challenge: '',
    solution: '',
    result: '',
    projectPhotos: '',
    approvalStatus: 'draft',
    publicationStatus: 'draft',
    riskLevel: 'high',
    notes: '',
    safetyChecklist: buildChecklistDefaults(CASE_STUDY_SAFETY_CHECKLIST),
    confidentialityReviewed: false,
    isCustomerApproved: false,
    publishReady: false,
    sourceType: 'real',
    createdAt: new Date().toISOString(),
  };
}

export function buildDefaultQueueState() {
  return REPLACEMENT_QUEUE.reduce((acc, item) => {
    acc[item.id] = { status: 'pending', notes: '', assignedTo: '' };
    return acc;
  }, {});
}

export function buildDefaultConfidentialityReview() {
  return buildChecklistDefaults(CONFIDENTIALITY_REVIEW_ITEMS);
}
