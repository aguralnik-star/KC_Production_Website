export const PRODUCTION_URL = 'https://www.kcdesignmfg.com';
export const LAUNCH_DATE = '2026-05-22';

export const GO_LIVE_PHASES = [
  {
    id: 'phase1',
    title: 'PHASE 1 — Launch Validation',
    items: [
      { id: 'p1-url', label: 'Production URL accessible' },
      { id: 'p1-ssl', label: 'SSL certificate active' },
      { id: 'p1-home', label: 'Homepage verified' },
      { id: 'p1-cap', label: 'Capabilities page verified' },
      { id: 'p1-equip', label: 'Equipment page verified' },
      { id: 'p1-quality', label: 'Quality page verified' },
      { id: 'p1-ind', label: 'Industries page verified' },
      { id: 'p1-projects', label: 'Projects page verified' },
      { id: 'p1-contact', label: 'Contact page verified' },
      { id: 'p1-status', label: 'RFQ Status Lookup verified' },
      { id: 'p1-services', label: 'Service pages verified' },
      { id: 'p1-analytics', label: 'Analytics verified' },
      { id: 'p1-gsc', label: 'Search Console verified' },
      { id: 'p1-clarity', label: 'Clarity verified' },
    ],
  },
  {
    id: 'phase2',
    title: 'PHASE 2 — RFQ Workflow Validation',
    items: [
      { id: 'p2-form', label: 'RFQ form loads' },
      { id: 'p2-upload', label: 'File upload works' },
      { id: 'p2-ref', label: 'Reference number generated' },
      { id: 'p2-customer-email', label: 'Customer confirmation email received' },
      { id: 'p2-internal-email', label: 'Internal notification received' },
      { id: 'p2-admin', label: 'Admin dashboard displays RFQ' },
      { id: 'p2-download', label: 'File download works' },
      { id: 'p2-status', label: 'Status update works' },
      { id: 'p2-followup', label: 'Follow-up creation works' },
      { id: 'p2-addinfo', label: 'Additional info request works' },
      { id: 'p2-reupload', label: 'Customer re-upload works' },
      { id: 'p2-events', label: 'Analytics events recorded' },
    ],
  },
  {
    id: 'phase3',
    title: 'PHASE 3 — Go-Live Monitoring',
    items: [
      { id: 'p3-new-rfqs', label: 'New RFQs monitored daily' },
      { id: 'p3-completion', label: 'RFQ completion rate reviewed' },
      { id: 'p3-upload-fail', label: 'File upload failures monitored' },
      { id: 'p3-email-fail', label: 'Email failures monitored' },
      { id: 'p3-lookup-fail', label: 'Status lookup failures monitored' },
      { id: 'p3-addinfo-fail', label: 'Additional info workflow failures monitored' },
      { id: 'p3-public', label: 'Public page availability monitored' },
      { id: 'p3-admin-avail', label: 'Admin dashboard availability monitored' },
    ],
  },
];

export const RFQ_MONITORING_STEPS = [
  { id: 'record_created', label: 'Step 1: Confirm RFQ record created' },
  { id: 'file_upload', label: 'Step 2: Confirm file upload exists' },
  { id: 'customer_email', label: 'Step 3: Confirm customer email delivered' },
  { id: 'admin_notification', label: 'Step 4: Confirm admin notification delivered' },
  { id: 'review_owner', label: 'Step 5: Assign review owner' },
  { id: 'status_in_review', label: 'Step 6: Move status to in_review' },
  { id: 'review_note', label: 'Step 7: Add review note' },
  { id: 'quote_prep', label: 'Step 8: Track quote preparation' },
  { id: 'follow_up', label: 'Step 9: Track follow-up creation' },
  { id: 'outcome', label: 'Step 10: Record outcome' },
];

export const ACTIVITY_EVENT_TYPES = [
  'rfq_received',
  'rfq_reviewed',
  'quote_draft_generated',
  'quote_sent',
  'follow_up_scheduled',
  'follow_up_completed',
  'additional_info_requested',
  'additional_info_received',
  'rfq_won',
  'rfq_lost',
  'issue_created',
  'issue_resolved',
];

export const ISSUE_SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const ESCALATION_MATRIX = [
  { severity: 'CRITICAL', response: 'Immediate investigation' },
  { severity: 'HIGH', response: 'Resolve within same business day' },
  { severity: 'MEDIUM', response: 'Resolve within 72 hours' },
  { severity: 'LOW', response: 'Add to backlog' },
];

export const SEVERITY_EXAMPLES = {
  LOW: ['Minor styling issue'],
  MEDIUM: ['Analytics event not tracking'],
  HIGH: ['Customer email failed'],
  CRITICAL: [
    'RFQ submission failure',
    'Storage upload failure',
    'Admin access failure',
    'Production outage',
  ],
};

export const GO_LIVE_DOCUMENTS = [
  { file: 'PRODUCTION_GO_LIVE_RUNBOOK.md', title: 'Production Go-Live Runbook' },
  { file: 'FIRST_RFQ_MONITORING_PLAN.md', title: 'First RFQ Monitoring Plan' },
  { file: 'FIRST_30_DAY_OPERATIONS_PLAN.md', title: 'First 30 Day Operations Plan' },
  { file: 'GO_LIVE_ISSUE_RESPONSE_PLAYBOOK.md', title: 'Go-Live Issue Response Playbook' },
];

export function buildDefaultPhaseChecklists() {
  const checklists = {};
  GO_LIVE_PHASES.forEach((phase) => {
    checklists[phase.id] = phase.items.reduce((items, item) => {
      items[item.id] = { completed: false, notes: '' };
      return items;
    }, {});
  });
  return checklists;
}

export function buildDefaultRfqMonitoring(rfqId) {
  return {
    rfqId,
    reviewOwner: '',
    outcome: '',
    steps: RFQ_MONITORING_STEPS.reduce((steps, step) => {
      steps[step.id] = false;
      return steps;
    }, {}),
    notes: '',
    updatedAt: new Date().toISOString(),
  };
}
