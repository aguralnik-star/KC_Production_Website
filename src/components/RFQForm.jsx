import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, X, Loader2 } from 'lucide-react';
import CTAButton from './CTAButton';
import { submitRFQ, validateRFQInput, MAX_FILES } from '../services/rfqService';

const projectTypes = [
  'Prototype',
  'Short Run Production',
  'Production Machining',
  'Fixtures & Gauges',
  'Production Tooling',
  'Custom Components',
  'Other',
];

const materials = [
  'Aluminum',
  'Stainless Steel',
  'Carbon Steel',
  'Tool Steel',
  'Brass',
  'Copper',
  'Bronze',
  'Plastic',
  'Other / Unsure',
];

const timelines = ['ASAP / Rush', '1–2 Weeks', '2–4 Weeks', '1–2 Months', 'Flexible / Planning Stage'];

const ACCEPTED_FILE_TYPES = '.pdf,.png,.jpg,.jpeg,.dwg,.dxf,.step,.stp,.x_t,.sldprt,.sldasm,.zip';

const initialForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  projectType: '',
  material: '',
  quantity: '',
  timeline: '',
  notes: '',
};

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RFQForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setFieldErrors([]);
  };

  const addFiles = (incoming) => {
    const next = [...files, ...Array.from(incoming)];
    const errors = validateRFQInput(form, next);
    if (errors.length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFiles(next.slice(0, MAX_FILES));
    setFieldErrors([]);
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFieldErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors([]);

    const errors = validateRFQInput(form, files);
    if (errors.length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitRFQ(form, files);
      navigate(`/rfq/confirmation?ref=${encodeURIComponent(result.reference_number)}`, {
        replace: true,
        state: {
          confirmation: {
            referenceNumber: result.reference_number,
            submittedAt: result.submitted_at,
            company: form.company.trim() || null,
            name: form.name.trim(),
            email: result.email,
            projectType: form.projectType || null,
            timeline: form.timeline || null,
            customerConfirmationSent: result.notification?.customer_confirmation_sent ?? false,
            customerConfirmationStatus: result.notification?.customer_confirmation_status ?? 'not_sent',
          },
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit your RFQ. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6" aria-label="Request for quote form" noValidate>
      {(error || fieldErrors.length > 0) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div>
              {error && <p>{error}</p>}
              {fieldErrors.length > 0 && (
                <ul className={error ? 'mt-2 list-disc pl-4' : ''}>
                  {fieldErrors.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-charcoal">
            Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your full name"
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-charcoal">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={form.company}
            onChange={handleChange}
            className={inputClass}
            placeholder="Company name"
            disabled={submitting}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal">
            Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@company.com"
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="(630) 543-3386"
            disabled={submitting}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-charcoal">Project Type</label>
          <select
            id="projectType"
            name="projectType"
            value={form.projectType}
            onChange={handleChange}
            className={`${inputClass} bg-white`}
            disabled={submitting}
          >
            <option value="">Select project type</option>
            {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="material" className="block text-sm font-medium text-charcoal">Material</label>
          <select
            id="material"
            name="material"
            value={form.material}
            onChange={handleChange}
            className={`${inputClass} bg-white`}
            disabled={submitting}
          >
            <option value="">Select material</option>
            {materials.map((mat) => <option key={mat} value={mat}>{mat}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-charcoal">Quantity</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. 1, 25, 500+"
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-charcoal">Timeline</label>
          <select
            id="timeline"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            className={`${inputClass} bg-white`}
            disabled={submitting}
          >
            <option value="">Select timeline</option>
            {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-charcoal">Project Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          value={form.notes}
          onChange={handleChange}
          className={inputClass}
          placeholder="Describe your project, tolerances, finish requirements, and delivery needs..."
          disabled={submitting}
        />
      </div>

      <div>
        <label htmlFor="rfq-files" className="block text-sm font-medium text-charcoal">
          File Upload <span className="font-normal text-metallic">(optional, up to {MAX_FILES} files)</span>
        </label>
        <div
          className="mt-1.5 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 transition-colors hover:border-accent/40 hover:bg-slate-100"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 text-metallic" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-charcoal">Drag and drop files here, or click to browse</p>
          <p className="mt-1 text-center text-xs text-metallic">
            PDF, PNG, JPG, DWG, DXF, STEP, STP, X_T, SLDPRT, SLDASM, ZIP — max 20 MB each
          </p>
          <input
            ref={fileInputRef}
            id="rfq-files"
            type="file"
            className="sr-only"
            multiple
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFileChange}
            disabled={submitting || files.length >= MAX_FILES}
            aria-describedby="rfq-files-help"
          />
          <CTAButton
            type="button"
            variant="secondary"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting || files.length >= MAX_FILES}
          >
            Choose Files
          </CTAButton>
          <p id="rfq-files-help" className="sr-only">
            Upload up to five drawing or model files, twenty megabytes each.
          </p>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
              >
                <span className="truncate text-charcoal">
                  {file.name} <span className="text-metallic">({formatFileSize(file.size)})</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-3 rounded p-1 text-metallic hover:bg-slate-100 hover:text-charcoal"
                  aria-label={`Remove ${file.name}`}
                  disabled={submitting}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CTAButton type="submit" className="w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          'Submit RFQ'
        )}
      </CTAButton>
    </form>
  );
}
