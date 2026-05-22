import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { AlertCircle, Loader2, Save } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import AccessibleButton from '../components/AccessibleButton';
import CaseStudyBuilderDashboard from '../components/admin/caseStudies/CaseStudyBuilderDashboard';
import CaseStudyEditor from '../components/admin/caseStudies/CaseStudyEditor';
import CaseStudyConfidentialityChecklist from '../components/admin/caseStudies/CaseStudyConfidentialityChecklist';
import CaseStudyPhotoUploader from '../components/admin/caseStudies/CaseStudyPhotoUploader';
import CaseStudyPhotoReviewGrid from '../components/admin/caseStudies/CaseStudyPhotoReviewGrid';
import CaseStudyApprovalChecklist from '../components/admin/caseStudies/CaseStudyApprovalChecklist';
import CaseStudyPreview, { CaseStudyPublishPanel } from '../components/admin/caseStudies/CaseStudyPublishPanel';
import {
  archiveCaseStudy,
  createCaseStudy,
  getApprovalChecklist,
  getCaseStudies,
  getCaseStudyById,
  getPublishReadiness,
  publishCaseStudy,
  updateCaseStudy,
  updateChecklistItem,
} from '../services/caseStudyService';
import {
  approveCaseStudyPhoto,
  createSignedPhotoUrl,
  deleteOrArchivePhoto,
  getCaseStudyPhotos,
  rejectCaseStudyPhoto,
  uploadCaseStudyPhoto,
} from '../services/caseStudyPhotoService';

export default function AdminCaseStudyBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, handleSignOut } = useOutletContext();

  const [list, setList] = useState([]);
  const [caseStudy, setCaseStudy] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [signedUrls, setSignedUrls] = useState({});
  const [publishReadiness, setPublishReadiness] = useState({ canPublish: false, missing: [] });
  const [loading, setLoading] = useState(Boolean(id));
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');

  const activePhotos = useMemo(
    () => photos.filter((p) => p.status !== 'archived'),
    [photos],
  );

  const loadList = useCallback(async () => {
    setError('');
    try {
      const data = await getCaseStudies();
      setList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load case studies.');
    }
  }, []);

  const loadDetail = useCallback(async (caseStudyId) => {
    setLoading(true);
    setError('');
    try {
      const [study, photoRows, checklistRows, readiness] = await Promise.all([
        getCaseStudyById(caseStudyId),
        getCaseStudyPhotos(caseStudyId),
        getApprovalChecklist(caseStudyId),
        getPublishReadiness(caseStudyId),
      ]);
      setCaseStudy(study);
      setPhotos(photoRows);
      setChecklist(checklistRows);
      setPublishReadiness(readiness);

      const urlMap = {};
      await Promise.all(
        photoRows.map(async (photo) => {
          try {
            urlMap[photo.id] = await createSignedPhotoUrl(photo.file_path);
          } catch {
            urlMap[photo.id] = null;
          }
        }),
      );
      setSignedUrls(urlMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load case study.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) loadDetail(id);
    else loadList();
  }, [id, loadDetail, loadList]);

  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const created = await createCaseStudy({ title: 'New K&C Case Study' });
      navigate(`/admin/case-studies/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create case study.');
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    if (!caseStudy) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateCaseStudy(caseStudy.id, caseStudy);
      setCaseStudy(updated);
      const readiness = await getPublishReadiness(caseStudy.id);
      setPublishReadiness(readiness);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save case study.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (updates) => {
    setCaseStudy((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const handleUpload = async (file, metadata) => {
    if (!caseStudy) return;
    setUploading(true);
    setError('');
    try {
      await uploadCaseStudyPhoto(caseStudy.id, file, metadata);
      await loadDetail(caseStudy.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleChecklistUpdate = async (itemId, updates) => {
    setSaving(true);
    setError('');
    try {
      await updateChecklistItem(itemId, updates);
      if (caseStudy) await loadDetail(caseStudy.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update checklist.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!caseStudy) return;
    setPublishing(true);
    setError('');
    try {
      await handleSave();
      const published = await publishCaseStudy(caseStudy.id);
      setCaseStudy(published);
      await loadDetail(caseStudy.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish case study.');
    } finally {
      setPublishing(false);
    }
  };

  const handleArchive = async () => {
    if (!caseStudy) return;
    setSaving(true);
    try {
      await archiveCaseStudy(caseStudy.id);
      navigate('/admin/case-studies');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to archive case study.');
    } finally {
      setSaving(false);
    }
  };

  if (id && (loading || !caseStudy)) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Case Study Builder">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading case study builder" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead title="Case Study Builder | K&C Design and Manufacturing" description="Build and publish customer-approved case studies." noindex />

      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Case Study Builder">
        {error ? (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        ) : null}

        {!id ? (
          <CaseStudyBuilderDashboard caseStudies={list} onCreate={handleCreate} creating={creating} />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link to="/admin/case-studies" className="text-sm font-semibold text-accent hover:underline">← All case studies</Link>
              <AccessibleButton type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
                <Save className="h-4 w-4" aria-hidden="true" />
                {saving ? 'Saving…' : 'Save Changes'}
              </AccessibleButton>
            </div>

            <CaseStudyEditor caseStudy={caseStudy} onChange={handleChange} />
            <CaseStudyConfidentialityChecklist caseStudy={caseStudy} onChange={handleChange} />
            <CaseStudyPhotoUploader caseStudyId={caseStudy.id} photoCount={activePhotos.length} onUpload={handleUpload} uploading={uploading} />
            <CaseStudyPhotoReviewGrid
              photos={activePhotos}
              signedUrls={signedUrls}
              saving={saving}
              onApprove={async (photoId) => { await approveCaseStudyPhoto(photoId); await loadDetail(caseStudy.id); }}
              onReject={async (photoId) => { await rejectCaseStudyPhoto(photoId); await loadDetail(caseStudy.id); }}
              onArchive={async (photoId) => { await deleteOrArchivePhoto(photoId); await loadDetail(caseStudy.id); }}
            />
            <CaseStudyApprovalChecklist checklist={checklist} onUpdate={handleChecklistUpdate} saving={saving} />
            <CaseStudyPreview caseStudy={caseStudy} photos={activePhotos} signedUrls={signedUrls} />
            <CaseStudyPublishPanel
              caseStudy={caseStudy}
              publishReadiness={publishReadiness}
              publishing={publishing}
              onPublish={handlePublish}
              onArchive={handleArchive}
            />
          </div>
        )}
      </AdminLayout>
    </>
  );
}
