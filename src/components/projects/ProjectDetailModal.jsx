import { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import CTAButton from '../CTAButton';
import { ProjectImage } from './ProjectImage';
import { trapFocus } from '../../utils/accessibilityUtils';

export default function ProjectDetailModal({ project, open, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      trapFocus(dialogRef.current, event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !project) return null;

  const Icon = project.icon;

  return (
    <div className="project-detail-modal" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="project-detail-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="project-detail-modal__header">
          <div>
            <p className="project-showcase-card__badge">{project.category}</p>
            <h2 id="project-detail-title" className="mt-2 text-2xl font-bold text-charcoal">
              {project.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-metallic hover:bg-slate-100 hover:text-charcoal"
            aria-label="Close project details"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <ProjectImage src={project.image} alt={project.imageAlt} icon={Icon} className="project-detail-modal__media" />

        <div className="project-detail-modal__body">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Process</dt>
              <dd className="mt-1 text-sm font-medium text-charcoal">{project.process}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Material</dt>
              <dd className="mt-1 text-sm font-medium text-charcoal">{project.material}</dd>
            </div>
          </dl>

          <p className="mt-5 text-sm leading-relaxed text-metallic">{project.summary}</p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-charcoal">Project Details</h3>
          <ul className="mt-3 space-y-2">
            {project.details.map((detail) => (
              <li key={detail} className="flex items-start gap-2.5 text-sm text-charcoal">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          {project.tags?.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Project tags">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <span className="project-showcase-card__tag">{tag}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-6 text-xs text-metallic">
            Representative example only — not an actual customer project or proprietary design.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CTAButton
              to="/contact"
              className="w-full sm:w-auto"
              analyticsLabel="Request a Quote for Similar Work"
              analyticsLocation="projects_modal"
            >
              Request a Quote for Similar Work
            </CTAButton>
            <button
              type="button"
              onClick={onClose}
              className="project-showcase-card__button project-showcase-card__button--secondary w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
