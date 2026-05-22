import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import AdditionalInfoRequestDraft from './AdditionalInfoRequestDraft';
import AdditionalInfoRequestHistory from './AdditionalInfoRequestHistory';
import CustomerReuploadFilesList from './CustomerReuploadFilesList';
import {
  getAdditionalInfoRequests,
  getCustomerInfoSubmissions,
  getCustomerUploadedFiles,
} from '../../services/additionalInfoAdminService';
import { getRFQRequestById } from '../../services/adminRfqService';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AdditionalInfoRequestPanel({ request, onRequestUpdated }) {
  const [requests, setRequests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeDraft, setActiveDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    if (!request?.id) return;
    setLoading(true);
    setError('');
    try {
      const [requestList, submissionList, fileList] = await Promise.all([
        getAdditionalInfoRequests(request.id),
        getCustomerInfoSubmissions(request.id),
        getCustomerUploadedFiles(request.id),
      ]);
      setRequests(requestList);
      setSubmissions(submissionList);
      setFiles(fileList);

      const editableDraft = requestList.find((item) => ['draft', 'failed'].includes(item.status));
      setActiveDraft(editableDraft ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load additional info data.');
    } finally {
      setLoading(false);
    }
  }, [request?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshRequest = async () => {
    if (!request?.id) return;
    const refreshed = await getRFQRequestById(request.id);
    onRequestUpdated?.(refreshed);
  };

  const handleSent = async () => {
    await loadData();
    await refreshRequest();
  };

  const handleSaved = async () => {
    await loadData();
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-metallic">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading additional information workflow…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <AdditionalInfoRequestDraft
        request={request}
        activeDraft={activeDraft}
        onDraftChange={setActiveDraft}
        onCreated={(draft) => {
          setActiveDraft(draft);
          loadData();
        }}
        onSaved={handleSaved}
        onSent={handleSent}
        onCanceled={() => {
          setActiveDraft(null);
          loadData();
        }}
      />

      <section>
        <h3 className="mb-3 text-sm font-semibold text-charcoal">Request History</h3>
        <AdditionalInfoRequestHistory requests={requests} />
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-charcoal">Customer Submissions</h3>
        {submissions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-metallic">
            No customer submissions yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {submissions.map((submission) => (
              <li key={submission.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-medium text-charcoal">
                  {submission.customer_name || 'Customer'} · {submission.customer_email}
                </p>
                <p className="mt-1 text-xs text-metallic">Submitted {formatDate(submission.created_at)}</p>
                {submission.notes && (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-charcoal">{submission.notes}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-charcoal">Customer Re-uploaded Files</h3>
        <CustomerReuploadFilesList files={files} />
      </section>
    </div>
  );
}
