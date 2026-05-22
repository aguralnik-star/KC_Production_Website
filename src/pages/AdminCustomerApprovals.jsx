import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import CustomerApprovalDashboard from '../components/admin/approvals/CustomerApprovalDashboard';
import ApprovalRequestBuilder from '../components/admin/approvals/ApprovalRequestBuilder';
import ApprovalTemplateManager from '../components/admin/approvals/ApprovalTemplateManager';
import ApprovalRequestHistory from '../components/admin/approvals/ApprovalRequestHistory';
import { computeDashboardStats } from '../data/customerApprovalWorkflowData';
import { getCaseStudies } from '../services/caseStudyService';
import { createCustomerReference, getCustomerReferences } from '../services/customerReferenceService';
import {
  createRequest,
  getRequests,
  markApproved,
  markAwaitingResponse,
  markCopied,
  markDeclined,
  markSentManually,
} from '../services/customerApprovalRequestService';
import {
  createTemplate,
  getTemplates,
  updateTemplate,
} from '../services/customerApprovalTemplateService';
import { getTestimonials } from '../services/testimonialService';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'builder', label: 'Request Builder' },
  { id: 'templates', label: 'Templates' },
  { id: 'history', label: 'History' },
];

export default function AdminCustomerApprovals() {
  const { session, handleSignOut } = useOutletContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [templates, setTemplates] = useState([]);
  const [requests, setRequests] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [customerReferences, setCustomerReferences] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const stats = useMemo(
    () => computeDashboardStats(requests, testimonials, caseStudies),
    [requests, testimonials, caseStudies]
  );

  const loadAll = useCallback(async () => {
    const [tmpl, reqs, tRows, cRows, refs] = await Promise.all([
      getTemplates(),
      getRequests(),
      getTestimonials(),
      getCaseStudies(),
      getCustomerReferences(),
    ]);
    setTemplates(tmpl);
    setRequests(reqs);
    setTestimonials(tRows);
    setCaseStudies(cRows);
    setCustomerReferences(refs);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    loadAll()
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load customer approvals.'))
      .finally(() => setLoading(false));
  }, [loadAll]);

  const handleSaveRequest = async (payload) => {
    setSaving(true);
    try {
      const saved = await createRequest(payload);
      await loadAll();
      setSelectedRequest(saved);
      return saved;
    } finally {
      setSaving(false);
    }
  };

  const withRefresh = (fn) => async (...args) => {
    setSaving(true);
    try {
      const result = await fn(...args);
      await loadAll();
      if (selectedRequest) {
        const updated = (await getRequests()).find((r) => r.id === selectedRequest.id);
        if (updated) setSelectedRequest(updated);
      }
      return result;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Customer Approvals">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading customer approvals admin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead
        title="Customer Approvals | K&C Admin"
        description="Customer approval request email templates and manual-send workflow."
        noindex
      />
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Customer Approvals">
        {error ? (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        ) : null}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white">
          <h2 className="text-2xl font-bold">Customer Approval Workflow</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Generate approval request email drafts for manual review and sending. Never publish testimonials, case studies, or project photos without documented customer approval. Respect anonymous publication requests.
          </p>
        </div>

        <nav className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2" aria-label="Customer approval sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                activeTab === tab.id ? 'border-accent bg-accent text-white' : 'border-slate-200 text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'dashboard' ? <CustomerApprovalDashboard stats={stats} /> : null}

        {activeTab === 'builder' ? (
          <ApprovalRequestBuilder
            templates={templates}
            testimonials={testimonials}
            caseStudies={caseStudies}
            customerReferences={customerReferences}
            onCreateCustomerReference={async (data) => {
              const created = await createCustomerReference(data);
              await loadAll();
              return created;
            }}
            activeRequest={selectedRequest}
            saving={saving}
            onSaveRequest={handleSaveRequest}
            onMarkCopied={withRefresh(markCopied)}
            onMarkSent={withRefresh(markSentManually)}
            onMarkAwaiting={withRefresh(markAwaitingResponse)}
            onMarkApproved={withRefresh(markApproved)}
            onMarkDeclined={withRefresh(markDeclined)}
          />
        ) : null}

        {activeTab === 'templates' ? (
          <ApprovalTemplateManager
            templates={templates}
            saving={saving}
            onCreate={async (payload) => {
              await createTemplate(payload);
              await loadAll();
            }}
            onUpdate={async (id, payload) => {
              await updateTemplate(id, payload);
              await loadAll();
            }}
          />
        ) : null}

        {activeTab === 'history' ? (
          <ApprovalRequestHistory
            requests={requests}
            onSelect={(request) => {
              setSelectedRequest(request);
              setActiveTab('builder');
            }}
          />
        ) : null}
      </AdminLayout>
    </>
  );
}
