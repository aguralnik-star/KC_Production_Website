import {
  AUDIT_CATEGORIES,
  PUBLIC_PAGES,
  buildDefaultCategoryChecks,
  buildDefaultClaimChecks,
  buildDefaultPageReviews,
} from '../data/contentQAAuditData';

const STORAGE_KEY = 'kc_content_qa_audit_v1';

function defaultState() {
  return {
    pageReviews: buildDefaultPageReviews(),
    claimChecks: buildDefaultClaimChecks(),
    categoryChecks: buildDefaultCategoryChecks(),
    evidenceNotes: '',
    updatedAt: new Date().toISOString(),
  };
}

function mergeState(saved) {
  const defaults = defaultState();
  const pageReviews = { ...defaults.pageReviews, ...(saved?.pageReviews ?? {}) };

  PUBLIC_PAGES.forEach((page) => {
    pageReviews[page.path] = {
      ...defaults.pageReviews[page.path],
      ...(pageReviews[page.path] ?? {}),
    };
  });

  return {
    ...defaults,
    ...saved,
    pageReviews,
    claimChecks: { ...defaults.claimChecks, ...(saved?.claimChecks ?? {}) },
    categoryChecks: { ...defaults.categoryChecks, ...(saved?.categoryChecks ?? {}) },
    evidenceNotes: saved?.evidenceNotes ?? '',
  };
}

export function loadContentQAAuditState() {
  if (typeof window === 'undefined') return defaultState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function saveContentQAAuditState(state) {
  const payload = {
    ...state,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  return payload;
}

export function computeContentQASummary(state) {
  const reviews = Object.values(state.pageReviews ?? {});
  const claims = Object.values(state.claimChecks ?? {});

  const pagesReviewed = reviews.filter((review) => review.status !== 'pending' || review.decision !== 'pending').length;
  const approvedPages = reviews.filter((review) => review.decision === 'approved').length;
  const claimsFlagged = claims.filter((claim) => claim.status === 'issue_found').length;
  const highRiskClaims = claims.filter(
    (claim) => claim.status === 'issue_found' && (claim.risk === 'high' || claim.risk === 'critical'),
  ).length;
  const mediumRiskClaims = claims.filter((claim) => claim.status === 'issue_found' && claim.risk === 'medium').length;
  const remainingFixes =
    reviews.filter((review) => ['needs_revision', 'blocked'].includes(review.decision)).length
    + claims.filter((claim) => claim.status === 'issue_found').length;

  const categoriesComplete = AUDIT_CATEGORIES.filter(
    (category) => state.categoryChecks?.[category.id]?.status === 'reviewed',
  ).length;

  const readyForLaunch =
    claimsFlagged === 0
    && reviews.every((review) => review.decision === 'approved')
    && categoriesComplete === AUDIT_CATEGORIES.length;

  return {
    pagesReviewed,
    totalPages: reviews.length,
    claimsFlagged,
    highRiskClaims,
    mediumRiskClaims,
    approvedPages,
    remainingFixes,
    categoriesComplete,
    totalCategories: AUDIT_CATEGORIES.length,
    readyForLaunch,
  };
}
