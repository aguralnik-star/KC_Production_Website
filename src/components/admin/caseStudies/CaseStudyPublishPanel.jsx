import { getCustomerDisplayLabel } from '../../../data/caseStudyData';
import AccessibleButton from '../../AccessibleButton';

export default function CaseStudyPreview({ caseStudy, photos, signedUrls }) {
  const customerLabel = getCustomerDisplayLabel(caseStudy);
  const heroPhoto = photos.find((p) => signedUrls[p.id]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm" aria-label="Case study preview">
      <h3 className="text-lg font-bold text-charcoal">6. Preview</h3>
      <article className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {heroPhoto && signedUrls[heroPhoto.id] ? (
          <img
            src={signedUrls[heroPhoto.id]}
            alt={heroPhoto.alt_text}
            className="aspect-[21/9] w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[21/9] items-center justify-center bg-charcoal text-sm text-slate-300">
            Industrial hero placeholder
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {caseStudy.industry ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{caseStudy.industry}</span> : null}
            {caseStudy.capability ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{caseStudy.capability}</span> : null}
          </div>
          <h4 className="mt-4 text-2xl font-bold text-charcoal">{caseStudy.title}</h4>
          <p className="mt-1 text-sm text-metallic">{customerLabel}</p>
          {caseStudy.public_summary ? <p className="mt-4 text-metallic">{caseStudy.public_summary}</p> : null}
          {caseStudy.challenge ? (
            <div className="mt-4">
              <h5 className="font-bold text-charcoal">Challenge</h5>
              <p className="mt-1 text-sm text-metallic">{caseStudy.challenge}</p>
            </div>
          ) : null}
        </div>
      </article>
    </section>
  );
}

export function CaseStudyPublishPanel({ publishReadiness, onPublish, onArchive, publishing, caseStudy }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Publish panel">
      <h3 className="text-lg font-bold text-charcoal">7. Publish</h3>
      {caseStudy.status === 'published' ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Published {caseStudy.published_at ? new Date(caseStudy.published_at).toLocaleString() : ''} · Public route: /projects/{caseStudy.slug}
        </p>
      ) : null}

      {!publishReadiness.canPublish ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3" role="alert">
          <p className="text-sm font-semibold text-amber-900">Publish blocked — missing requirements:</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
            {publishReadiness.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-sm text-emerald-700">All publish requirements met.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <AccessibleButton
          type="button"
          disabled={!publishReadiness.canPublish || publishing || caseStudy.status === 'published'}
          onClick={onPublish}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {publishing ? 'Publishing…' : 'Publish Case Study'}
        </AccessibleButton>
        <AccessibleButton
          type="button"
          disabled={publishing}
          onClick={onArchive}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal"
        >
          Archive
        </AccessibleButton>
      </div>
    </section>
  );
}
