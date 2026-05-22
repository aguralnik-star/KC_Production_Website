import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import CTAButton from '../CTAButton';
import { ACCEPTED_FILE_INPUT, MAX_FILES } from '../../utils/rfqFileUtils';

export default function RFQDragDropUpload({
  files,
  onAddFiles,
  disabled = false,
  fileErrors = [],
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const atLimit = files.length >= MAX_FILES;

  const handleFiles = (incoming) => {
    if (!incoming?.length || disabled || atLimit) return;
    onAddFiles(Array.from(incoming));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div>
      <div
        className={`rfq-upload-zone ${dragActive ? 'rfq-upload-zone--active' : ''} ${atLimit ? 'rfq-upload-zone--disabled' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && !atLimit) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled || atLimit ? -1 : 0}
        aria-label="Upload drawings and project files"
        aria-disabled={disabled || atLimit}
        aria-describedby="rfq-upload-help rfq-upload-types"
      >
        <Upload className="h-8 w-8 text-brand-accent" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold text-charcoal">
          Drop drawings, CAD files, or project documents here
        </p>
        <p id="rfq-upload-types" className="mt-1 text-center text-xs text-metallic">
          PDF, PNG, JPG, DWG, DXF, STEP, STP, X_T, SLDPRT, SLDASM, ZIP — max 20 MB each
        </p>
        <input
          ref={inputRef}
          id="rfq-files"
          type="file"
          className="sr-only"
          multiple
          accept={ACCEPTED_FILE_INPUT}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = '';
          }}
          disabled={disabled || atLimit}
          aria-describedby="rfq-upload-help"
        />
        <CTAButton
          type="button"
          variant="secondary"
          className="mt-4 min-h-[44px]"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || atLimit}
        >
          Browse Files
        </CTAButton>
      </div>

      <p id="rfq-upload-help" className="mt-3 text-sm leading-relaxed text-metallic">
        Upload drawings, models, prints, or zipped project files. If you do not have files ready, you can still
        submit the RFQ and describe your project.
      </p>

      {atLimit ? (
        <p className="mt-2 text-sm text-amber-700" role="status">
          Maximum of {MAX_FILES} files reached. Remove a file to add another.
        </p>
      ) : null}

      {fileErrors.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-red-700" role="alert">
          {fileErrors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
