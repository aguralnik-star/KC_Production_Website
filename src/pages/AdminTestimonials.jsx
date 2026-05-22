import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, Loader2, Save } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import AccessibleButton from '../components/AccessibleButton';
import TestimonialDashboard from '../components/admin/testimonials/TestimonialDashboard';
import TestimonialEditor from '../components/admin/testimonials/TestimonialEditor';
import TestimonialRequestBuilder from '../components/admin/testimonials/TestimonialRequestBuilder';
import TestimonialApprovalChecklist from '../components/admin/testimonials/TestimonialApprovalChecklist';
import TestimonialPreview from '../components/admin/testimonials/TestimonialPreview';
import TestimonialPublishPanel from '../components/admin/testimonials/TestimonialPublishPanel';
import {
  approveTestimonial,
  archiveTestimonial,
  createTestimonial,
  getPublishReadiness,
  getTestimonialApprovalChecklist,
  getTestimonialById,
  getTestimonials,
  publishTestimonial,
  updateChecklistItem,
  updateTestimonial,
} from '../services/testimonialService';
import {
  createRequestLog,
  generateTestimonialRequestDraft,
  getRequestLogs,
  getRequestTemplates,
  markRequestCopied,
  markRequestReceived,
  markRequestSentManually,
} from '../services/testimonialRequestService';

const TABS = [
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'request', label: 'Request Builder' },
  { id: 'checklist', label: 'Approval Checklist' },
  { id: 'preview', label: 'Preview' },
  { id: 'publishing', label: 'Publishing' },
];

export default function AdminTestimonials() {
  const { session, handleSignOut } = useOutletContext();
  const [activeTab, setActiveTab] = useState('testimonials');
  const [testimonials, setTestimonials] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [testimonial, setTestimonial] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [requestLogs, setRequestLogs] = useState([]);
  const [publishReadiness, setPublishReadiness] = useState({ canPublish: false, missing: [] });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');

  const loadList = useCallback(async () => {
    const [rows, logs, tmpl] = await Promise.all([
      getTestimonials(),
      getRequestLogs(),
      getRequestTemplates(),
    ]);
    setTestimonials(rows);
    setRequestLogs(logs);
    setTemplates(tmpl);
  }, []);

  const loadDetail = useCallback(async (id) => {
    const [row, checklistRows, readiness] = await Promise.all([
      getTestimonialById(id),
      getTestimonialApprovalChecklist(id),
      getPublishReadiness(id),
    ]);
    setTestimonial(row);
    setChecklist(checklistRows);
    setPublishReadiness(readiness);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    loadList()
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load testimonials.'))
      .finally(() => setLoading(false));
  }, [loadList]);

  useEffect(() => {
    if (!selectedId) {
      setTestimonial(null);
      setChecklist([]);
      return;
    }
    loadDetail(selectedId).catch((err) => setError(err instanceof Error ? err.message : 'Unable to load testimonial.'));
  }, [selectedId, loadDetail]);

  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const created = await createTestimonial();
      await loadList();
      setSelectedId(created.id);
      setActiveTab('testimonials');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create testimonial.');
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    if (!testimonial) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateTestimonial(testimonial.id, testimonial);
      setTestimonial(updated);
      await loadList();
      const readiness = await getPublishReadiness(testimonial.id);
      setPublishReadiness(readiness);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleChecklistUpdate = async (itemId, updates) => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await updateChecklistItem(itemId, updates);
      await loadDetail(selectedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update checklist.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateRequest = async (form, template, shouldCreateLog = false) => {
    const draft = await generateTestimonialRequestDraft(form, template);
    if (!shouldCreateLog) return draft;
    const log = await createRequestLog({
      customer_name: form.customer_name,
      customer_company: form.customer_company,
      customer_email: form.customer_email,
      subject: draft.subject,
      request_body: draft.body,
      notes: form.custom_note,
    });
    await loadList();
    return { id: log.id, subject: draft.subject, body: draft.body };
  };

  if (loading) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Testimonials">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading testimonials admin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead title="Testimonials | K&C Admin" description="Approved testimonial capture and publishing workflow." noindex />
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Testimonials">
        {error ? (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        ) : null}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white">
          <h2 className="text-2xl font-bold">Approved Testimonial Workflow</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Do not publish testimonials without documented customer approval. Representative testimonials remain labeled on the public site until real approved testimonials are published.
          </p>
        </div>

        <nav className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${activeTab === tab.id ? 'border-accent bg-accent text-white' : 'border-slate-200 text-charcoal'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'testimonials' ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <TestimonialDashboard
              testimonials={testimonials}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onCreate={handleCreate}
              creating={creating}
            />
            <div className="space-y-4">
              {testimonial ? (
                <AccessibleButton type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
                  <Save className="h-4 w-4" aria-hidden="true" />
                  {saving ? 'Saving…' : 'Save Changes'}
                </AccessibleButton>
              ) : null}
              <TestimonialEditor testimonial={testimonial} onChange={(updates) => setTestimonial((prev) => (prev ? { ...prev, ...updates } : prev))} />
            </div>
          </div>
        ) : null}

        {activeTab === 'request' ? (
          <TestimonialRequestBuilder
            templates={templates}
            requestLogs={requestLogs}
            saving={saving}
            onGenerate={handleGenerateRequest}
            onCopy={markRequestCopied}
            onMarkCopied={markRequestCopied}
            onMarkSent={async (id) => { await markRequestSentManually(id); await loadList(); }}
            onMarkReceived={async (id) => { await markRequestReceived(id); await loadList(); }}
          />
        ) : null}

        {activeTab === 'checklist' ? (
          <TestimonialApprovalChecklist checklist={checklist} onUpdate={handleChecklistUpdate} saving={saving} />
        ) : null}

        {activeTab === 'preview' ? <TestimonialPreview testimonial={testimonial} /> : null}

        {activeTab === 'publishing' ? (
          <TestimonialPublishPanel
            testimonial={testimonial}
            publishReadiness={publishReadiness}
            publishing={publishing}
            saving={saving}
            onApprove={async () => {
              if (!testimonial) return;
              await approveTestimonial(testimonial.id);
              await loadDetail(testimonial.id);
              await loadList();
            }}
            onPublish={async () => {
              if (!testimonial) return;
              setPublishing(true);
              try {
                await handleSave();
                await publishTestimonial(testimonial.id);
                await loadDetail(testimonial.id);
                await loadList();
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Unable to publish testimonial.');
              } finally {
                setPublishing(false);
              }
            }}
            onArchive={async () => {
              if (!testimonial) return;
              await archiveTestimonial(testimonial.id);
              setSelectedId(null);
              await loadList();
            }}
          />
        ) : null}
      </AdminLayout>
    </>
  );
}
