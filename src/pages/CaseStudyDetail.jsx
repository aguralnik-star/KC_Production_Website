import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import LoadingState from '../components/LoadingState';
import CaseStudyGallery from '../components/projects/CaseStudyGallery';
import CaseStudyCTA from '../components/projects/CaseStudyCTA';
import { getCustomerDisplayLabel } from '../data/caseStudyData';
import { getPublishedCaseStudyBySlug } from '../services/caseStudyService';
import { getPhotoSignedUrls, getPublishedCaseStudyPhotos } from '../services/caseStudyPhotoService';

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        const study = await getPublishedCaseStudyBySlug(slug);
        if (!study) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const photoRows = await getPublishedCaseStudyPhotos(study.id);
        const withUrls = await getPhotoSignedUrls(photoRows, { requirePublished: true });
        if (!cancelled) {
          setCaseStudy(study);
          setPhotos(withUrls.filter((p) => p.signedUrl));
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <LoadingState message="Loading case study…" />;
  }

  if (notFound || !caseStudy) {
    return (
      <div className="section-container section-padding text-center">
        <h1 className="text-3xl font-bold text-charcoal">Case Study Not Found</h1>
        <p className="mt-4 text-metallic">This case study is not available or has not been published.</p>
        <Link to="/projects" className="mt-6 inline-block font-semibold text-accent hover:underline">Back to Projects</Link>
      </div>
    );
  }

  const customerLabel = getCustomerDisplayLabel(caseStudy);
  const metaDescription = caseStudy.public_summary
    || 'Read an approved K&C Design and Manufacturing case study showing representative precision machining, tooling, fixture, gauge, or production manufacturing support.';

  return (
    <>
      <SEO
        title={`${caseStudy.title} | K&C Design and Manufacturing`}
        description={metaDescription}
      />

      <div className="section-container px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: caseStudy.title }]} />
      </div>

      <header className="bg-charcoal text-white">
        <div className="section-container section-padding">
          <div className="flex flex-wrap gap-2">
            {caseStudy.industry ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{caseStudy.industry}</span> : null}
            {caseStudy.capability ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{caseStudy.capability}</span> : null}
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">Approved Case Study</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{caseStudy.title}</h1>
          <p className="mt-3 text-lg text-slate-300">{customerLabel}</p>
          {caseStudy.public_summary ? <p className="mt-4 max-w-3xl text-slate-300">{caseStudy.public_summary}</p> : null}
        </div>
      </header>

      <article className="section-container section-padding">
        {caseStudy.challenge ? (
          <section aria-labelledby="challenge-heading">
            <h2 id="challenge-heading" className="text-2xl font-bold text-charcoal">Challenge</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-metallic">{caseStudy.challenge}</p>
          </section>
        ) : null}

        {caseStudy.solution ? (
          <section className="mt-10" aria-labelledby="solution-heading">
            <h2 id="solution-heading" className="text-2xl font-bold text-charcoal">Solution</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-metallic">{caseStudy.solution}</p>
          </section>
        ) : null}

        {caseStudy.result ? (
          <section className="mt-10" aria-labelledby="result-heading">
            <h2 id="result-heading" className="text-2xl font-bold text-charcoal">Result</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-metallic">{caseStudy.result}</p>
          </section>
        ) : null}

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6" aria-labelledby="project-details-heading">
          <h2 id="project-details-heading" className="text-xl font-bold text-charcoal">Project Details</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {caseStudy.industry ? <div><dt className="text-sm font-semibold text-metallic">Industry</dt><dd className="text-charcoal">{caseStudy.industry}</dd></div> : null}
            {caseStudy.capability ? <div><dt className="text-sm font-semibold text-metallic">Capability</dt><dd className="text-charcoal">{caseStudy.capability}</dd></div> : null}
            {caseStudy.material ? <div><dt className="text-sm font-semibold text-metallic">Material</dt><dd className="text-charcoal">{caseStudy.material}</dd></div> : null}
            {caseStudy.process ? <div><dt className="text-sm font-semibold text-metallic">Process</dt><dd className="text-charcoal">{caseStudy.process}</dd></div> : null}
          </dl>
        </section>

        <CaseStudyGallery photos={photos} />
      </article>

      <CaseStudyCTA />
    </>
  );
}
