import {
  buildDefaultBrowserChecks,
  buildDefaultPageReviews,
  buildDefaultViewportChecks,
  LAUNCH_BLOCKERS,
  PAGES_TO_REVIEW,
} from '../data/mobileBrowserQAData';

const STORAGE_KEY = 'kc_mobile_browser_qa_v1';

function defaultState() {
  return {
    pageReviews: buildDefaultPageReviews(),
    viewportChecks: buildDefaultViewportChecks(),
    browserChecks: buildDefaultBrowserChecks(),
    issues: [],
    evidenceNotes: '',
    updatedAt: new Date().toISOString(),
  };
}

function mergeState(saved) {
  const defaults = defaultState();
  const pageReviews = { ...defaults.pageReviews, ...(saved?.pageReviews ?? {}) };
  PAGES_TO_REVIEW.forEach((page) => {
    if (!pageReviews[page.path]) {
      pageReviews[page.path] = defaults.pageReviews[page.path];
    } else {
      pageReviews[page.path] = { ...defaults.pageReviews[page.path], ...pageReviews[page.path] };
    }
  });

  return {
    ...defaults,
    ...saved,
    pageReviews,
    viewportChecks: { ...defaults.viewportChecks, ...(saved?.viewportChecks ?? {}) },
    browserChecks: { ...defaults.browserChecks, ...(saved?.browserChecks ?? {}) },
    issues: Array.isArray(saved?.issues) ? saved.issues : [],
    evidenceNotes: saved?.evidenceNotes ?? '',
  };
}

export function loadMobileBrowserQAState() {
  if (typeof window === 'undefined') return defaultState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function saveMobileBrowserQAState(state) {
  const payload = {
    ...state,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  return payload;
}

export function computeQASummary(state) {
  const reviews = Object.values(state.pageReviews ?? {});
  const issues = state.issues ?? [];

  const pagesReviewed = reviews.filter(
    (review) =>
      review.mobileStatus !== 'pending'
      || review.tabletStatus !== 'pending'
      || review.desktopStatus !== 'pending'
      || review.browserStatus !== 'pending',
  ).length;

  const mobileIssues = issues.filter((issue) => issue.viewport?.startsWith('mobile') || issue.viewport === 'mobile').length;
  const tabletIssues = issues.filter((issue) => issue.viewport?.startsWith('tablet') || issue.viewport === 'tablet').length;
  const desktopIssues = issues.filter((issue) => issue.viewport?.startsWith('desktop') || issue.viewport === 'desktop').length;
  const browserIssues = issues.filter((issue) => issue.browser).length;
  const criticalIssues = issues.filter((issue) => issue.severity === 'critical' && issue.status !== 'resolved').length;

  const openBlockers = issues.filter((issue) =>
    issue.status !== 'resolved'
    && (issue.severity === 'critical' || LAUNCH_BLOCKERS.some((blocker) => issue.title?.includes(blocker))),
  ).length;

  const blockedReviews = reviews.filter((review) =>
    ['blocked', 'needs_fix'].includes(review.decision)
    || review.mobileStatus === 'blocked'
    || review.tabletStatus === 'blocked'
    || review.desktopStatus === 'blocked'
    || review.browserStatus === 'blocked',
  ).length;

  const readyForLaunch = criticalIssues === 0 && openBlockers === 0 && blockedReviews === 0;

  return {
    pagesReviewed,
    totalPages: reviews.length,
    mobileIssues,
    tabletIssues,
    desktopIssues,
    browserIssues,
    criticalIssues,
    openBlockers,
    readyForLaunch,
  };
}

export function createIssue(payload) {
  return {
    id: crypto.randomUUID?.() ?? `issue-${Date.now()}`,
    title: payload.title?.trim() ?? '',
    page: payload.page ?? '',
    viewport: payload.viewport ?? '',
    browser: payload.browser ?? '',
    severity: payload.severity ?? 'medium',
    status: payload.status ?? 'open',
    notes: payload.notes ?? '',
    resolution: payload.resolution ?? '',
    createdAt: new Date().toISOString(),
  };
}
