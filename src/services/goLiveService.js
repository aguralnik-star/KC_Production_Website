import {
  buildDefaultPhaseChecklists,
  buildDefaultRfqMonitoring,
  GO_LIVE_PHASES,
} from '../data/goLiveData';
import { getRFQRequests } from './adminRfqService';
import {
  createPostLaunchIssue,
  getPostLaunchDashboardData,
  updatePostLaunchIssue,
} from './postLaunchMonitoringService';
import { getCommandCenterData } from './rfqOperationsService';

const STORAGE_KEY = 'kc_go_live_v1';

function defaultState() {
  return {
    phaseChecklists: buildDefaultPhaseChecklists(),
    rfqMonitoring: {},
    manualActivity: [],
    launchApproved: false,
    launchNotes: '',
    updatedAt: new Date().toISOString(),
  };
}

function mergeState(saved) {
  const defaults = defaultState();
  const phaseChecklists = { ...defaults.phaseChecklists };

  GO_LIVE_PHASES.forEach((phase) => {
    phaseChecklists[phase.id] = {
      ...defaults.phaseChecklists[phase.id],
      ...(saved?.phaseChecklists?.[phase.id] ?? {}),
    };
  });

  return {
    ...defaults,
    ...saved,
    phaseChecklists,
    rfqMonitoring: { ...defaults.rfqMonitoring, ...(saved?.rfqMonitoring ?? {}) },
    manualActivity: Array.isArray(saved?.manualActivity) ? saved.manualActivity : [],
    launchApproved: saved?.launchApproved ?? false,
    launchNotes: saved?.launchNotes ?? '',
  };
}

export function loadGoLiveState() {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function saveGoLiveState(state) {
  const payload = { ...state, updatedAt: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
  return payload;
}

export function computeLaunchStatus(operations, postLaunch, localState) {
  const criticalIssues = Number(postLaunch?.kpi?.critical_issues ?? 0);
  const failedEmails = Number(operations?.summary?.failed_customer_emails ?? 0)
    + Number(operations?.summary?.failed_status_emails ?? 0);
  const healthState = operations?.healthState ?? 'healthy';

  if (healthState === 'critical' || criticalIssues > 0 || failedEmails > 0) {
    return 'critical';
  }
  if (healthState === 'attention' || Number(postLaunch?.kpi?.open_issues ?? 0) > 0) {
    return 'attention';
  }

  const totalItems = GO_LIVE_PHASES.reduce((sum, phase) => sum + phase.items.length, 0);
  const completedItems = GO_LIVE_PHASES.reduce((sum, phase) => {
    const checklist = localState.phaseChecklists?.[phase.id] ?? {};
    return sum + phase.items.filter((item) => checklist[item.id]?.completed).length;
  }, 0);

  if (completedItems >= totalItems * 0.9) return 'operational';
  return 'attention';
}

export function buildLaunchMetrics(operations, postLaunch) {
  const summary = operations?.summary ?? {};
  const kpi = postLaunch?.kpi ?? {};
  const funnel = postLaunch?.funnel ?? {};
  const rfqMetrics = postLaunch?.rfqMetrics ?? {};

  return {
    visitorsToday: Number(funnel.visitors ?? 0) || null,
    rfqsToday: Number(summary.new_rfqs_today ?? kpi.rfqs_today ?? 0),
    rfqsThisWeek: Number(kpi.rfqs_last_7_days ?? 0),
    rfqCompletionRate: rfqMetrics.completionRate,
    quoteOpportunitiesOpen: Number(summary.open_rfqs ?? funnel.opportunities_open ?? 0),
    followUpsDue: Number(summary.overdue_followups ?? 0) + Number(summary.followups_due_today ?? 0),
    failedEmails:
      Number(summary.failed_customer_emails ?? 0)
      + Number(summary.failed_status_emails ?? 0)
      + Number(summary.failed_additional_info_requests ?? 0)
      + Number(kpi.failed_emails ?? 0),
    failedUploads: null,
    openIssues: Number(kpi.open_issues ?? 0),
    criticalIssues: Number(kpi.critical_issues ?? 0),
  };
}

export function deriveReadinessBadge(status) {
  if (status === 'operational') return { label: 'Operational', tone: 'green' };
  if (status === 'critical') return { label: 'Immediate Action Required', tone: 'red' };
  return { label: 'Attention Needed', tone: 'yellow' };
}

export async function refreshGoLiveDashboardData(localState) {
  const [operations, postLaunch, recentRfqs] = await Promise.all([
    getCommandCenterData(),
    getPostLaunchDashboardData(),
    getRFQRequests(),
  ]);

  const launchStatus = computeLaunchStatus(operations, postLaunch, localState);
  const metrics = buildLaunchMetrics(operations, postLaunch);
  const readiness = deriveReadinessBadge(launchStatus);

  const activity = [
    ...(postLaunch.activity ?? []).map((item) => ({
      id: `${item.activity_type}-${item.activity_at}`,
      type: item.activity_type,
      summary: item.activity_summary,
      referenceNumber: item.reference_number,
      company: item.company,
      at: item.activity_at,
      source: 'system',
    })),
    ...(operations.activity ?? []).slice(0, 15).map((item) => ({
      id: `ops-${item.activity_type}-${item.activity_at}`,
      type: item.activity_type,
      summary: item.activity_summary ?? item.activity_type,
      referenceNumber: item.reference_number,
      company: item.company,
      at: item.activity_at,
      source: 'operations',
    })),
    ...(localState.manualActivity ?? []).map((item) => ({
      ...item,
      source: 'manual',
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 40);

  return {
    operations,
    postLaunch,
    recentRfqs: recentRfqs.slice(0, 20),
    launchStatus,
    metrics,
    readiness,
    activity,
    refreshedAt: new Date().toISOString(),
  };
}

export function updatePhaseChecklistItem(state, phaseId, itemId, updates) {
  return {
    ...state,
    phaseChecklists: {
      ...state.phaseChecklists,
      [phaseId]: {
        ...state.phaseChecklists[phaseId],
        [itemId]: { ...state.phaseChecklists[phaseId][itemId], ...updates },
      },
    },
  };
}

export function updateRfqMonitoring(state, rfqId, updates) {
  const existing = state.rfqMonitoring[rfqId] ?? buildDefaultRfqMonitoring(rfqId);
  return {
    ...state,
    rfqMonitoring: {
      ...state.rfqMonitoring,
      [rfqId]: { ...existing, ...updates, updatedAt: new Date().toISOString() },
    },
  };
}

export function addManualActivity(state, { type, summary, referenceNumber = '' }) {
  const entry = {
    id: crypto.randomUUID?.() ?? `manual-${Date.now()}`,
    type,
    summary,
    referenceNumber,
    at: new Date().toISOString(),
    source: 'manual',
  };
  return {
    ...state,
    manualActivity: [entry, ...(state.manualActivity ?? [])].slice(0, 50),
  };
}

export { createPostLaunchIssue, updatePostLaunchIssue };
