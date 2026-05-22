import CTAButton from '../CTAButton';
import { ProjectImage } from './ProjectImage';

export default function ProjectShowcaseCard({ project, onViewDetails }) {
  const Icon = project.icon;

  return (
    <article className="project-showcase-card card flex h-full flex-col overflow-hidden p-0">
      <ProjectImage src={project.image} alt={project.imageAlt} icon={Icon} />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="project-showcase-card__badge">{project.category}</span>
        <h3 className="mt-3 text-lg font-bold text-charcoal">{project.title}</h3>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-metallic">Process:</dt>
            <dd className="text-charcoal">{project.process}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-metallic">Material:</dt>
            <dd className="text-charcoal">{project.material}</dd>
          </div>
        </dl>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-metallic">{project.summary}</p>

        {project.tags?.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Project tags">
            {project.tags.map((tag) => (
              <li key={tag}>
                <span className="project-showcase-card__tag">{tag}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onViewDetails(project)}
            className="project-showcase-card__button project-showcase-card__button--secondary"
          >
            View Details
          </button>
          <CTAButton
            to="/contact"
            variant="secondary"
            className="w-full sm:w-auto"
            analyticsLabel="Start Similar RFQ"
            analyticsLocation="projects_card"
          >
            Start Similar RFQ
          </CTAButton>
        </div>
      </div>
    </article>
  );
}
