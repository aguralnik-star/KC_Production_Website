import { AlertCircle, CheckCircle2, FileText, X } from 'lucide-react';
import { formatFileSize, getFileTypeLabel, validateSingleFile } from '../../utils/rfqFileUtils';

export default function RFQFilePreviewList({ files, onRemove, disabled = false }) {
  if (!files.length) return null;

  return (
    <ul className="rfq-file-preview-list" aria-label="Uploaded files">
      {files.map((file, index) => {
        const validation = validateSingleFile(file);

        return (
          <li key={`${file.name}-${file.size}-${index}`} className="rfq-file-preview-list__item">
            <div className="rfq-file-preview-list__icon" aria-hidden="true">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-all text-sm font-medium text-charcoal">{file.name}</p>
              <p className="text-xs text-metallic">
                {getFileTypeLabel(file.name)} · {formatFileSize(file.size)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {validation.valid ? (
                <span className="rfq-file-preview-list__status rfq-file-preview-list__status--valid">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Valid file</span>
                </span>
              ) : (
                <span className="rfq-file-preview-list__status rfq-file-preview-list__status--invalid">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Invalid file</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rfq-file-preview-list__remove"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
