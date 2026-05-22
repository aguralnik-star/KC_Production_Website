import { useMemo, useState } from 'react';
import { AlertCircle, Loader2, Upload, X } from 'lucide-react';
import {
  ALLOWED_EXTENSIONS,
  MAX_FILES,
  MAX_FILE_SIZE_BYTES,
  submitAdditionalInfo,
  validateAdditionalInfoSubmission,
} from '../../services/additionalInfoService';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdditionalInfoUploadForm({ requestToken, requestData, onSuccess }) {
  const [name, setName] = useState(requestData.customer_name || '');
  const [email, setEmail] = useState(requestData.customer_email || '');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [progress, setProgress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const allowedTypesLabel = useMemo(
    () => Array.from(ALLOWED_EXTENSIONS).join(', '),
    [],
  );

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files ?? []);
    setFiles((current) => [...current, ...selected].slice(0, MAX_FILES));
    event.target.value = '';
  };

  const removeFile = (index) => {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateAdditionalInfoSubmission(
      { name, email, notes },
      files,
      requestData.customer_email,
    );
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setSubmitting(true);
    setProgress('Starting submission…');
    setErrors([]);
    try {
      await submitAdditionalInfo(
        requestToken,
        { name, email, notes, expectedEmail: requestData.customer_email },
        files,
        setProgress,
      );
      onSuccess?.();
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Unable to submit additional information.']);
    } finally {
      setSubmitting(false);
      setProgress('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <ul className="space-y-1">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="additional-info-name" className="block text-sm font-semibold text-charcoal">
            Name
          </label>
          <input
            id="additional-info-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <label htmlFor="additional-info-email" className="block text-sm font-semibold text-charcoal">
            Email
          </label>
          <input
            id="additional-info-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <p className="mt-1 text-xs text-metallic">
            Must match the email used for your original RFQ submission.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="additional-info-notes" className="block text-sm font-semibold text-charcoal">
          Notes
        </label>
        <textarea
          id="additional-info-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={6}
          maxLength={5000}
          placeholder="Provide any clarifications, revision details, or additional project notes."
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <p className="mt-1 text-xs text-metallic">{notes.length}/5000 characters</p>
      </div>

      <div>
        <label htmlFor="additional-info-files" className="block text-sm font-semibold text-charcoal">
          Upload Files
        </label>
        <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <label
            htmlFor="additional-info-files"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"
          >
            <Upload className="h-8 w-8 text-accent" aria-hidden="true" />
            <span className="text-sm font-semibold text-charcoal">Choose files to upload</span>
            <span className="text-xs text-metallic">
              Up to {MAX_FILES} files, {formatFileSize(MAX_FILE_SIZE_BYTES)} each
            </span>
            <span className="text-xs text-metallic">Allowed: {allowedTypesLabel}</span>
          </label>
          <input
            id="additional-info-files"
            type="file"
            multiple
            accept={Array.from(ALLOWED_EXTENSIONS).map((ext) => `.${ext}`).join(',')}
            onChange={handleFileChange}
            disabled={files.length >= MAX_FILES || submitting}
            className="sr-only"
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal">{file.name}</p>
                  <p className="text-xs text-metallic">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={submitting}
                  className="rounded-lg p-2 text-metallic hover:bg-slate-100 hover:text-charcoal disabled:opacity-50"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {progress && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-charcoal">
          <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden="true" />
          {progress}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50 sm:w-auto"
      >
        {submitting ? 'Submitting…' : 'Submit Additional Information'}
      </button>
    </form>
  );
}
