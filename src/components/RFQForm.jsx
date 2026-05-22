import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, RotateCcw, X } from 'lucide-react';
import CTAButton from './CTAButton';
import AccessibleFormField from './AccessibleFormField';
import RFQProgressSteps, { RFQ_PROGRESS_STEPS } from './rfq/RFQProgressSteps';
import RFQFormSection from './rfq/RFQFormSection';
import RFQDragDropUpload from './rfq/RFQDragDropUpload';
import RFQFilePreviewList from './rfq/RFQFilePreviewList';
import RFQErrorSummary from './rfq/RFQErrorSummary';
import RFQSuccessPreview from './rfq/RFQSuccessPreview';
import RFQFieldHelpText from './rfq/RFQFieldHelpText';
import { submitRFQ } from '../services/rfqService';
import { useRFQDraftAutosave } from '../hooks/useRFQDraftAutosave';
import { useConversionTracking } from '../hooks/useConversionTracking';
import { validateIncomingFiles } from '../utils/rfqFileUtils';
import {
  FIELD_LABELS,
  PROJECT_TYPES,
  TIMELINES,
  getRecommendedWarnings,
  isContactStepComplete,
  isFilesStepComplete,
  isProjectStepComplete,
  isStepComplete,
  validateRFQInput,
} from '../utils/rfqValidation';

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

const SCROLL_SECTIONS = [
  { stepId: 'contact', refKey: 'contact' },
  { stepId: 'project', refKey: 'project' },
  { stepId: 'project', refKey: 'notes' },
  { stepId: 'files', refKey: 'files' },
  { stepId: 'submit', refKey: 'submit' },
];

const inputClass =
  'mt-1.5 w-full min-h-[44px] rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:bg-slate-50';

export default function RFQForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [fileErrors, setFileErrors] = useState([]);
  const [activeStep, setActiveStep] = useState('contact');
  const [successPreview, setSuccessPreview] = useState(null);

  const fieldRefs = useRef({});
  const sectionRefs = useRef({});
  const contactTrackedRef = useRef(false);
  const projectTrackedRef = useRef(false);

  const {
    trackFormStart,
    trackStepContactCompleted,
    trackStepProjectCompleted,
    trackFileAdded,
    trackFileRemoved,
    trackFileError,
    trackSubmitAttempt,
    trackSubmitSuccess,
    trackSubmitError,
    trackDraftRestored,
    trackDraftCleared,
  } = useConversionTracking();

  const { draftRestored, clearDraft, dismissDraftNotice } = useRFQDraftAutosave(form, setForm);

  useEffect(() => {
    if (draftRestored) trackDraftRestored();
  }, [draftRestored, trackDraftRestored]);

  useEffect(() => {
    const observers = [];

    SCROLL_SECTIONS.forEach(({ stepId, refKey }) => {
      const node = sectionRefs.current[refKey];
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
              setActiveStep(stepId);
            }
          });
        },
        { rootMargin: '-20% 0px -55% 0px', threshold: [0.35, 0.6] },
      );

      observer.observe(node);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  useEffect(() => {
    if (isContactStepComplete(form) && !contactTrackedRef.current) {
      contactTrackedRef.current = true;
      trackStepContactCompleted();
    }
    if (isProjectStepComplete(form) && !projectTrackedRef.current) {
      projectTrackedRef.current = true;
      trackStepProjectCompleted();
    }
  }, [form, trackStepContactCompleted, trackStepProjectCompleted]);

  const stepStatus = useMemo(
    () =>
      RFQ_PROGRESS_STEPS.reduce((status, step) => {
        status[step.id] = isStepComplete(step.id, form, files);
        return status;
      }, {}),
    [form, files],
  );

  const recommendedWarnings = useMemo(() => getRecommendedWarnings(form, files), [form, files]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    trackFormStart();
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const focusField = useCallback((fieldName) => {
    fieldRefs.current[fieldName]?.focus?.();
    sectionRefs.current[
      ['name', 'email', 'company', 'phone'].includes(fieldName) ? 'contact' : 'project'
    ]?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, []);

  const addFiles = useCallback(
    (incomingFiles) => {
      trackFormStart();
      const { errors, validFiles } = validateIncomingFiles(incomingFiles, files);

      if (errors.length) {
        setFileErrors(errors);
        trackFileError('file_validation');
        return;
      }

      if (!validFiles.length) return;

      setFiles((prev) => {
        const next = [...prev, ...validFiles].slice(0, 5);
        trackFileAdded(next.length);
        return next;
      });
      setFileErrors([]);
    },
    [files, trackFileAdded, trackFileError, trackFormStart],
  );

  const removeFile = (index) => {
    setFiles((prev) => {
      const next = prev.filter((_, itemIndex) => itemIndex !== index);
      trackFileRemoved(next.length);
      return next;
    });
    setFileErrors([]);
  };

  const handleClearDraft = () => {
    setForm(initialForm);
    clearDraft();
    trackDraftCleared();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setFieldErrors({});
    setFileErrors([]);

    const validation = validateRFQInput(form, files);
    if (validation.messages.length > 0) {
      setFieldErrors(validation.fieldErrors);
      setFileErrors(validation.fileErrors);
      trackSubmitError('validation');

      const firstInvalidField = Object.keys(validation.fieldErrors)[0];
      if (firstInvalidField) focusField(firstInvalidField);
      return;
    }

    trackSubmitAttempt();
    setSubmitting(true);

    try {
      const result = await submitRFQ(form, files);
      trackSubmitSuccess(result.reference_number);
      clearDraft();
      setSuccessPreview(result.reference_number);

      window.setTimeout(() => {
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
      }, 900);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to submit your RFQ. Please try again.';
      setSubmitError(message);
      trackSubmitError('submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (successPreview) {
    return <RFQSuccessPreview referenceNumber={successPreview} />;
  }

  return (
    <form onSubmit={handleSubmit} className="rfq-form-card" aria-label="Request for quote form" noValidate>
      <RFQProgressSteps activeStep={activeStep} stepStatus={stepStatus} />

      {draftRestored ? (
        <div className="rfq-draft-banner" role="status">
          <p>Draft restored from this browser.</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleClearDraft} className="rfq-draft-banner__action">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Clear draft
            </button>
            <button type="button" onClick={dismissDraftNotice} className="rfq-draft-banner__dismiss" aria-label="Dismiss draft notice">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      <RFQErrorSummary
        submitError={submitError}
        requiredMessages={Object.values(fieldErrors).filter(Boolean)}
        fileErrors={fileErrors}
      />

      <RFQFormSection
        id="rfq-section-contact"
        sectionRef={(node) => {
          sectionRefs.current.contact = node;
        }}
        title="Contact Information"
        description="Tell us who to contact about this RFQ."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <AccessibleFormField id="name" label="Name" required error={fieldErrors.name}>
            {({ id, describedBy, invalid, errorId }) => (
              <input
                ref={(node) => {
                  fieldRefs.current.name = node;
                }}
                type="text"
                id={id}
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                onFocus={trackFormStart}
                className={inputClass}
                placeholder="Your full name"
                disabled={submitting}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                aria-errormessage={errorId}
              />
            )}
          </AccessibleFormField>

          <AccessibleFormField id="company" label="Company" error={fieldErrors.company}>
            {({ id, describedBy, invalid, errorId }) => (
              <input
                type="text"
                id={id}
                name="company"
                value={form.company}
                onChange={handleChange}
                onFocus={trackFormStart}
                className={inputClass}
                placeholder="Company name"
                disabled={submitting}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                aria-errormessage={errorId}
              />
            )}
          </AccessibleFormField>

          <AccessibleFormField id="email" label="Email" required error={fieldErrors.email}>
            {({ id, describedBy, invalid, errorId }) => (
              <input
                ref={(node) => {
                  fieldRefs.current.email = node;
                }}
                type="email"
                id={id}
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                onFocus={trackFormStart}
                className={inputClass}
                placeholder="you@company.com"
                disabled={submitting}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                aria-errormessage={errorId}
              />
            )}
          </AccessibleFormField>

          <AccessibleFormField id="phone" label="Phone">
            {({ id, describedBy }) => (
              <input
                type="tel"
                id={id}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onFocus={trackFormStart}
                className={inputClass}
                placeholder="(630) 543-3386"
                disabled={submitting}
                aria-describedby={describedBy}
              />
            )}
          </AccessibleFormField>
        </div>
      </RFQFormSection>

      <RFQFormSection
        id="rfq-section-project"
        sectionRef={(node) => {
          sectionRefs.current.project = node;
        }}
        title="Project Details"
        description="Share as much detail as you can to help K&C review your requirements."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <AccessibleFormField id="projectType" label="Project Type">
            {({ id, describedBy }) => (
              <>
                <select
                  id={id}
                  name="projectType"
                  value={form.projectType}
                  onChange={handleChange}
                  onFocus={trackFormStart}
                  className={`${inputClass} bg-white`}
                  disabled={submitting}
                  aria-describedby={describedBy}
                >
                  <option value="">Select project type</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {recommendedWarnings.find((item) => item.field === 'projectType') ? (
                  <RFQFieldHelpText variant="warning">
                    {recommendedWarnings.find((item) => item.field === 'projectType')?.message}
                  </RFQFieldHelpText>
                ) : null}
              </>
            )}
          </AccessibleFormField>

          <AccessibleFormField id="material" label="Material">
            {({ id, describedBy }) => (
              <>
                <input
                  type="text"
                  id={id}
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  onFocus={trackFormStart}
                  className={inputClass}
                  placeholder="Examples: Aluminum, stainless steel, tool steel, brass, plastic"
                  disabled={submitting}
                  aria-describedby={describedBy}
                />
                {recommendedWarnings.find((item) => item.field === 'material') ? (
                  <RFQFieldHelpText variant="warning">
                    {recommendedWarnings.find((item) => item.field === 'material')?.message}
                  </RFQFieldHelpText>
                ) : null}
              </>
            )}
          </AccessibleFormField>

          <AccessibleFormField id="quantity" label="Quantity">
            {({ id, describedBy }) => (
              <>
                <input
                  type="text"
                  id={id}
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  onFocus={trackFormStart}
                  className={inputClass}
                  placeholder="Example: 1 prototype, 25 pieces, 100 pieces"
                  disabled={submitting}
                  aria-describedby={describedBy}
                />
                {recommendedWarnings.find((item) => item.field === 'quantity') ? (
                  <RFQFieldHelpText variant="warning">
                    {recommendedWarnings.find((item) => item.field === 'quantity')?.message}
                  </RFQFieldHelpText>
                ) : null}
              </>
            )}
          </AccessibleFormField>

          <AccessibleFormField id="timeline" label="Timeline">
            {({ id, describedBy }) => (
              <>
                <select
                  id={id}
                  name="timeline"
                  value={form.timeline}
                  onChange={handleChange}
                  onFocus={trackFormStart}
                  className={`${inputClass} bg-white`}
                  disabled={submitting}
                  aria-describedby={describedBy}
                >
                  <option value="">Select timeline</option>
                  {TIMELINES.map((timeline) => (
                    <option key={timeline} value={timeline}>
                      {timeline}
                    </option>
                  ))}
                </select>
                {recommendedWarnings.find((item) => item.field === 'timeline') ? (
                  <RFQFieldHelpText variant="warning">
                    {recommendedWarnings.find((item) => item.field === 'timeline')?.message}
                  </RFQFieldHelpText>
                ) : null}
              </>
            )}
          </AccessibleFormField>
        </div>
      </RFQFormSection>

      <RFQFormSection
        id="rfq-section-notes"
        sectionRef={(node) => {
          sectionRefs.current.notes = node;
        }}
        title="Project Notes"
        description="Optional details that help K&C understand tolerances, finish, delivery, and special requirements."
      >
        <AccessibleFormField
          id="notes"
          label="Notes / Requirements"
          helpText="Optional details about tolerances, finish, delivery, revision level, or special manufacturing needs."
        >
          {({ id, describedBy, helpId }) => (
            <textarea
              id={id}
              name="notes"
              rows={5}
              value={form.notes}
              onChange={handleChange}
              onFocus={trackFormStart}
              className={inputClass}
              placeholder="Tell us about tolerances, finish requirements, delivery needs, revision level, or any special manufacturing considerations."
              disabled={submitting}
              aria-describedby={describedBy || helpId}
            />
          )}
        </AccessibleFormField>
      </RFQFormSection>

      <RFQFormSection
        id="rfq-section-files"
        sectionRef={(node) => {
          sectionRefs.current.files = node;
        }}
        title="Drawings & Files"
        description="Attach prints, CAD files, or zipped project documents if available."
      >
        <RFQDragDropUpload files={files} onAddFiles={addFiles} disabled={submitting} fileErrors={fileErrors} />
        <RFQFilePreviewList files={files} onRemove={removeFile} disabled={submitting} />
        {recommendedWarnings.find((item) => item.field === 'files') ? (
          <RFQFieldHelpText variant="warning">
            {recommendedWarnings.find((item) => item.field === 'files')?.message}
          </RFQFieldHelpText>
        ) : null}
      </RFQFormSection>

      <RFQFormSection
        id="rfq-section-submit"
        sectionRef={(node) => {
          sectionRefs.current.submit = node;
        }}
        title="Review & Submit"
        description="Confirm your details, then submit your RFQ for review."
      >
        <div className="rfq-review-summary" aria-label="RFQ summary preview">
          <dl className="rfq-review-summary__grid">
            <div>
              <dt>Contact</dt>
              <dd>{form.name || '—'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{form.email || '—'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{form.phone || '—'}</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>{form.company || '—'}</dd>
            </div>
            <div>
              <dt>Project Type</dt>
              <dd>{form.projectType || '—'}</dd>
            </div>
            <div>
              <dt>Material</dt>
              <dd>{form.material || '—'}</dd>
            </div>
            <div>
              <dt>Quantity</dt>
              <dd>{form.quantity || '—'}</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>{form.timeline || '—'}</dd>
            </div>
            <div>
              <dt>Files attached</dt>
              <dd>{files.length ? `${files.length} file${files.length === 1 ? '' : 's'}` : 'None'}</dd>
            </div>
          </dl>
          {form.notes ? (
            <div className="rfq-review-summary__notes">
              <p className="font-medium text-charcoal">Notes</p>
              <p className="mt-1 text-sm text-metallic">{form.notes}</p>
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-sm text-metallic">
          Required: {FIELD_LABELS.name}, {FIELD_LABELS.email}. Other fields are recommended and help K&amp;C quote
          more accurately.
        </p>

        <CTAButton
          type="submit"
          className="rfq-form-submit mt-6 w-full min-h-[48px] sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting RFQ...
            </>
          ) : (
            'Submit RFQ'
          )}
        </CTAButton>
      </RFQFormSection>
    </form>
  );
}
