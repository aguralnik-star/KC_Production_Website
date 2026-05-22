import { useState } from 'react';
import { Download, Loader2, FileText } from 'lucide-react';
import { createSignedFileUrl } from '../../services/adminRfqService';

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RFQFileList({ files }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');

  const handleDownload = async (file) => {
    setDownloadingId(file.id);
    setError('');
    try {
      const url = await createSignedFileUrl(file.file_path);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (!files.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-metallic">
        No files uploaded with this RFQ.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <ul className="space-y-2">
        {files.map((file) => (
          <li key={file.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <p className="truncate font-medium text-charcoal">{file.file_name}</p>
                </div>
                <p className="mt-1 text-xs text-metallic">
                  {file.file_type || 'Unknown type'} · {formatFileSize(file.file_size)}
                </p>
                <p className="mt-2 break-all font-mono text-xs text-slate-500">{file.file_path}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDownload(file)}
                disabled={downloadingId === file.id}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent disabled:opacity-50"
              >
                {downloadingId === file.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                Download
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
