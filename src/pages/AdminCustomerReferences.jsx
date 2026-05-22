import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import CustomerReferenceSummaryCards from '../components/admin/customerReferences/CustomerReferenceSummaryCards';
import CustomerReferenceDashboard from '../components/admin/customerReferences/CustomerReferenceDashboard';
import CustomerReferenceDetail from '../components/admin/customerReferences/CustomerReferenceDetail';
import { computeReferenceDashboardStats } from '../data/customerReferencePermissionData';
import { getCaseStudies } from '../services/caseStudyService';
import {
  approvePermission,
  declinePermission,
  getPermissionMatrix,
  requestPermission,
  revokePermission,
  updatePermission,
} from '../services/customerPermissionService';
import {
  createCustomerReference,
  getAllPermissions,
  getCustomerReferenceSummary,
  getCustomerReferences,
  linkCaseStudy,
  linkTestimonial,
  setDoNotContact,
  updateCustomerReference,
} from '../services/customerReferenceService';
import { getTestimonials } from '../services/testimonialService';

export default function AdminCustomerReferences() {
  const { session, handleSignOut } = useOutletContext();
  const [references, setReferences] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [reference, setReference] = useState(null);
  const [summary, setSummary] = useState(null);
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const loadList = useCallback(async () => {
    const [refs, perms, tRows, cRows] = await Promise.all([
      getCustomerReferences(filters),
      getAllPermissions(),
      getTestimonials(),
      getCaseStudies(),
    ]);
    setReferences(refs);
    setAllPermissions(perms);
    setTestimonials(tRows);
    setCaseStudies(cRows);
  }, [filters]);

  const loadDetail = useCallback(async (id) => {
    const [sum, matrixRows] = await Promise.all([
      getCustomerReferenceSummary(id),
      getPermissionMatrix(id),
    ]);
    setSummary(sum);
    setReference(sum.reference);
    setMatrix(matrixRows);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    loadList()
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load customer references.'))
      .finally(() => setLoading(false));
  }, [loadList]);

  useEffect(() => {
    if (!selectedId) {
      setReference(null);
      setSummary(null);
      setMatrix([]);
      return;
    }
    loadDetail(selectedId).catch((err) => setError(err instanceof Error ? err.message : 'Unable to load reference detail.'));
  }, [selectedId, loadDetail]);

  const permissionsByRef = useMemo(() => {
    const map = {};
    for (const p of allPermissions) {
      if (!map[p.customer_reference_id]) map[p.customer_reference_id] = [];
      map[p.customer_reference_id].push(p);
    }
    return map;
  }, [allPermissions]);

  const linkedCounts = useMemo(() => {
    const map = {};
    for (const t of testimonials) {
      if (!t.customer_reference_id) continue;
      if (!map[t.customer_reference_id]) map[t.customer_reference_id] = { testimonials: 0, caseStudies: 0, photos: 0 };
      map[t.customer_reference_id].testimonials += 1;
    }
    for (const c of caseStudies) {
      if (!c.customer_reference_id) continue;
      if (!map[c.customer_reference_id]) map[c.customer_reference_id] = { testimonials: 0, caseStudies: 0, photos: 0 };
      map[c.customer_reference_id].caseStudies += 1;
    }
    return map;
  }, [testimonials, caseStudies]);

  const lastActivity = useMemo(() => {
    const map = {};
    for (const ref of references) {
      map[ref.id] = ref.updated_at;
    }
    return map;
  }, [references]);

  const stats = useMemo(
    () => computeReferenceDashboardStats(references, allPermissions, testimonials, caseStudies),
    [references, allPermissions, testimonials, caseStudies]
  );

  const linkOptions = useMemo(() => ({
    testimonials: testimonials.filter((t) => !t.customer_reference_id || t.customer_reference_id === selectedId),
    caseStudies: caseStudies.filter((c) => !c.customer_reference_id || c.customer_reference_id === selectedId),
  }), [testimonials, caseStudies, selectedId]);

  const refresh = async () => {
    await loadList();
    if (selectedId) await loadDetail(selectedId);
  };

  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const created = await createCustomerReference({ customer_name: 'New Contact' });
      await refresh();
      setSelectedId(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create reference.');
    } finally {
      setCreating(false);
    }
  };

  const handleSaveReference = async () => {
    if (!reference) return;
    setSaving(true);
    try {
      await updateCustomerReference(reference.id, reference);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save reference.');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDoNotContact = async (value) => {
    if (!reference) return;
    setSaving(true);
    try {
      const updated = await setDoNotContact(reference.id, value);
      setReference(updated);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update do not contact.');
    } finally {
      setSaving(false);
    }
  };

  const permissionAction = (fn) => async (...args) => {
    setSaving(true);
    try {
      await fn(...args);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Permission action failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Customer References">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading customer references" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead title="Customer References | K&C Admin" description="Customer reference and permission tracking." noindex />
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Customer References">
        {error ? (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        ) : null}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white">
          <h2 className="text-2xl font-bold">Customer Reference Management</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Centralized permission tracking for testimonials, case studies, photos, and publication rights. Never publish customer-identifying content without documented approval.
          </p>
        </div>

        <div className="mb-6">
          <CustomerReferenceSummaryCards stats={stats} />
        </div>

        {selectedId && reference ? (
          <CustomerReferenceDetail
            summary={summary}
            reference={reference}
            matrix={matrix}
            onReferenceChange={setReference}
            onSaveReference={handleSaveReference}
            onSetDoNotContact={handleSetDoNotContact}
            onPermissionRequest={permissionAction(requestPermission)}
            onPermissionApprove={permissionAction(approvePermission)}
            onPermissionDecline={permissionAction(declinePermission)}
            onPermissionRevoke={permissionAction(revokePermission)}
            onPermissionUpdateEvidence={permissionAction(updatePermission)}
            onLinkTestimonial={permissionAction(async (tid) => linkTestimonial(selectedId, tid))}
            onLinkCaseStudy={permissionAction(async (cid) => linkCaseStudy(selectedId, cid))}
            linkOptions={linkOptions}
            onBack={() => setSelectedId(null)}
            saving={saving}
          />
        ) : (
          <CustomerReferenceDashboard
            references={references}
            permissionsByRef={permissionsByRef}
            linkedCounts={linkedCounts}
            lastActivity={lastActivity}
            filters={filters}
            onFiltersChange={setFilters}
            onCreate={handleCreate}
            onSelect={setSelectedId}
            selectedId={selectedId}
            creating={creating}
          />
        )}
      </AdminLayout>
    </>
  );
}
