import { Link } from 'react-router-dom';
import CTAButton from '../CTAButton';
import { getCustomerDisplayLabel } from '../../data/caseStudyData';

export default function PublishedCaseStudyCard({ caseStudy, heroUrl }) {
  return (
    <article className="project-showcase-card card flex h-full flex-col overflow-hidden p-0">
      {heroUrl ? (
        <div className="project-showcase-card__media">
          <img
            src={heroUrl}
            alt={caseStudy.title}
            className="project-showcase-card__image"
            loading="lazy"
            decoding="async"
            width={640}
            height={400}
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-charcoal text-sm text-slate-300">
          Approved case study
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="project-showcase-card__badge bg-emerald-100 text-emerald-800">Approved Case Study</span>
        <h3 className="mt-3 text-lg font-bold text-charcoal">{caseStudy.title}</h3>
        <p className="mt-1 text-xs font-medium text-metallic">{getCustomerDisplayLabel(caseStudy)}</p>
        <dl className="mt-3 space-y-1.5 text-sm">
          {caseStudy.capability ? (
            <div className="flex gap-2">
              <dt className="font-medium text-metallic">Capability:</dt>
              <dd className="text-charcoal">{caseStudy.capability}</dd>
            </div>
          ) : null}
          {caseStudy.material ? (
            <div className="flex gap-2">
              <dt className="font-medium text-metallic">Material:</dt>
              <dd className="text-charcoal">{caseStudy.material}</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-metallic">{caseStudy.public_summary}</p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            to={`/projects/${caseStudy.slug}`}
            className="project-showcase-card__button project-showcase-card__button--secondary text-center"
          >
            View Case Study
          </Link>
          <CTAButton to="/contact" variant="secondary" className="w-full sm:w-auto" analyticsLabel="Start Similar RFQ" analyticsLocation="case_study_card">
            Request a Quote
          </CTAButton>
        </div>
      </div>
    </article>
  );
}
