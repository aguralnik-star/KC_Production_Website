import {
  LAUNCH_STATUS_AREAS,
  OWNER_ACTION_ITEMS,
  POST_LAUNCH_SUPPORT_ITEMS,
  SIGNOFF_CHECKLIST_ITEMS,
  buildDefaultAreaStatuses,
  buildDefaultChecklistState,
} from '../data/ownerHandoffData';

const STORAGE_KEY = 'kc_owner_handoff_v1';

function defaultState() {
  return {
    areaStatuses: buildDefaultAreaStatuses(),
    ownerActions: buildDefaultChecklistState(OWNER_ACTION_ITEMS),
    postLaunchItems: buildDefaultChecklistState(POST_LAUNCH_SUPPORT_ITEMS),
    signoffChecklist: buildDefaultChecklistState(SIGNOFF_CHECKLIST_ITEMS),
    finalSignoff: {
      ownerName: '',
      signoffDate: '',
      launchDecision: 'conditional',
      notes: '',
    },
    remainingIssues: '',
    updatedAt: new Date().toISOString(),
  };
}

function mergeState(saved) {
  const defaults = defaultState();

  return {
    ...defaults,
    ...saved,
    areaStatuses: { ...defaults.areaStatuses, ...(saved?.areaStatuses ?? {}) },
    ownerActions: { ...defaults.ownerActions, ...(saved?.ownerActions ?? {}) },
    postLaunchItems: { ...defaults.postLaunchItems, ...(saved?.postLaunchItems ?? {}) },
    signoffChecklist: { ...defaults.signoffChecklist, ...(saved?.signoffChecklist ?? {}) },
    finalSignoff: { ...defaults.finalSignoff, ...(saved?.finalSignoff ?? {}) },
    remainingIssues: saved?.remainingIssues ?? '',
  };
}

export function loadOwnerHandoffState() {
  if (typeof window === 'undefined') return defaultState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function saveOwnerHandoffState(state) {
  const payload = {
    ...state,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  return payload;
}

export function computeHandoffSummary(state) {
  const ownerCompleted = Object.values(state.ownerActions).filter((item) => item.completed).length;
  const postLaunchCompleted = Object.values(state.postLaunchItems).filter((item) => item.completed).length;
  const signoffCompleted = Object.values(state.signoffChecklist).filter((item) => item.completed).length;

  const areaStatuses = Object.values(state.areaStatuses ?? {});
  const readyAreas = areaStatuses.filter((status) => status === 'ready').length;
  const notReadyAreas = areaStatuses.filter((status) => status === 'not_ready').length;

  const overallLaunchStatus =
    notReadyAreas > 0 ? 'not_ready' : readyAreas === LAUNCH_STATUS_AREAS.length ? 'ready' : 'conditional';

  return {
    ownerCompleted,
    ownerTotal: OWNER_ACTION_ITEMS.length,
    postLaunchCompleted,
    postLaunchTotal: POST_LAUNCH_SUPPORT_ITEMS.length,
    signoffCompleted,
    signoffTotal: SIGNOFF_CHECKLIST_ITEMS.length,
    readyAreas,
    totalAreas: LAUNCH_STATUS_AREAS.length,
    overallLaunchStatus,
    launchApproved: state.finalSignoff?.launchDecision === 'approved',
  };
}
