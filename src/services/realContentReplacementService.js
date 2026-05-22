import {
  APPROVAL_STATUSES,
  buildDefaultCaseStudy,
  buildDefaultConfidentialityReview,
  buildDefaultPhoto,
  buildDefaultQueueState,
  buildDefaultTestimonial,
  REPLACEMENT_QUEUE,
} from '../data/realContentReplacementData';

const STORAGE_KEY = 'kc_real_content_v1';

function defaultState() {
  return {
    testimonials: [],
    photos: [],
    caseStudies: [],
    queue: buildDefaultQueueState(),
    confidentialityReview: buildDefaultConfidentialityReview(),
    updatedAt: new Date().toISOString(),
  };
}

function mergeState(saved) {
  const defaults = defaultState();
  return {
    ...defaults,
    ...saved,
    testimonials: Array.isArray(saved?.testimonials) ? saved.testimonials : [],
    photos: Array.isArray(saved?.photos) ? saved.photos : [],
    caseStudies: Array.isArray(saved?.caseStudies) ? saved.caseStudies : [],
    queue: { ...defaults.queue, ...(saved?.queue ?? {}) },
    confidentialityReview: { ...defaults.confidentialityReview, ...(saved?.confidentialityReview ?? {}) },
  };
}

export function loadRealContentState() {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function saveRealContentState(state) {
  const payload = { ...state, updatedAt: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
  return payload;
}

export function isPublishReadyItem(item) {
  const status = item?.status ?? item?.approvalStatus ?? item?.publicationStatus;
  return Boolean(
    item?.isCustomerApproved
    && ['approved', 'published'].includes(status)
    && item?.publishReady
    && item?.confidentialityReviewed,
  );
}

export function computeRealContentSummary(state) {
  const allItems = [
    ...state.testimonials.map((item) => ({ ...item, contentType: 'testimonial' })),
    ...state.photos.map((item) => ({ ...item, contentType: 'photo' })),
    ...state.caseStudies.map((item) => ({ ...item, contentType: 'case_study' })),
  ];

  const getStatus = (item) => item.status ?? item.approvalStatus ?? item.publicationStatus ?? 'draft';

  return {
    representativeItems: allItems.filter((item) => item.sourceType === 'representative').length,
    realDrafts: allItems.filter((item) => getStatus(item) === 'draft').length,
    pendingApprovals: allItems.filter((item) => getStatus(item) === 'pending_customer_approval').length,
    approvedItems: allItems.filter((item) => ['approved', 'published'].includes(getStatus(item))).length,
    publishedItems: allItems.filter((item) => getStatus(item) === 'published').length,
    highRiskItems: allItems.filter((item) => ['high', 'critical'].includes(item.riskLevel)).length,
    queueProgress: REPLACEMENT_QUEUE.map((entry) => ({
      ...entry,
      queueState: state.queue[entry.id] ?? { status: 'pending', notes: '', assignedTo: '' },
    })),
  };
}

export function getReplacementRecommendation(type, hasApprovedReal) {
  if (type === 'testimonial') {
    return hasApprovedReal
      ? 'Show approved real testimonial on public site.'
      : 'Show representative testimonial with "Representative Example" label.';
  }
  if (type === 'photo') {
    return hasApprovedReal
      ? 'Use approved project photo in showcase.'
      : 'Show industrial placeholder until approved photo is available.';
  }
  if (type === 'case_study') {
    return hasApprovedReal
      ? 'Show real approved case study on project detail.'
      : 'Show representative project example with disclosure label.';
  }
  return 'Review replacement queue priority and customer approval status.';
}

export function addTestimonial(state) {
  return { ...state, testimonials: [buildDefaultTestimonial(), ...state.testimonials] };
}

export function addPhoto(state) {
  return { ...state, photos: [buildDefaultPhoto(), ...state.photos] };
}

export function addCaseStudy(state) {
  return { ...state, caseStudies: [buildDefaultCaseStudy(), ...state.caseStudies] };
}

export function updateTestimonial(state, id, updates) {
  return {
    ...state,
    testimonials: state.testimonials.map((item) => (item.id === id ? { ...item, ...updates } : item)),
  };
}

export function updatePhoto(state, id, updates) {
  return {
    ...state,
    photos: state.photos.map((item) => (item.id === id ? { ...item, ...updates } : item)),
  };
}

export function updateCaseStudy(state, id, updates) {
  return {
    ...state,
    caseStudies: state.caseStudies.map((item) => (item.id === id ? { ...item, ...updates } : item)),
  };
}

export function updateQueueItem(state, queueId, updates) {
  return {
    ...state,
    queue: {
      ...state.queue,
      [queueId]: { ...state.queue[queueId], ...updates },
    },
  };
}

export function updateConfidentialityReview(state, itemId, value) {
  return {
    ...state,
    confidentialityReview: {
      ...state.confidentialityReview,
      [itemId]: value,
    },
  };
}

export function allChecklistComplete(checklist) {
  return Object.values(checklist ?? {}).every(Boolean);
}

export function deriveRiskLevel(item, checklist) {
  const incomplete = Object.values(checklist ?? {}).filter((v) => !v).length;
  if (item.customerApprovalRequired === false && incomplete === 0) return 'low';
  if (incomplete >= 3) return 'critical';
  if (incomplete >= 2) return 'high';
  if (incomplete >= 1) return 'medium';
  return 'low';
}

export { APPROVAL_STATUSES };
