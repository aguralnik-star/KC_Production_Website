import { useState } from 'react';
import { Camera, FileText, Image, MessageSquareQuote, Shield, ExternalLink } from 'lucide-react';
import { REPLACEMENT_DOCUMENTS } from '../../../data/realContentReplacementData';
import { REAL_TESTIMONIALS, REPRESENTATIVE_TESTIMONIALS } from '../../../data/testimonialsData';
import { REAL_CASE_STUDIES, SHOWCASE_PROJECTS } from '../../../data/projectsData';
import { REAL_PHOTOS } from '../../../data/photoLibraryConfig';
import TestimonialApprovalTracker from './TestimonialApprovalTracker';
import ProjectPhotoApprovalTracker from './ProjectPhotoApprovalTracker';
import CaseStudyApprovalTracker from './CaseStudyApprovalTracker';
import ContentReplacementQueue from './ContentReplacementQueue';
import ContentRiskChecklist from './ContentRiskChecklist';

const TABS = [
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { id: 'photos', label: 'Photos', icon: Camera },
  { id: 'case-studies', label: 'Case Studies', icon: FileText },
  { id: 'queue', label: 'Replacement Queue', icon: Image },
  { id: 'confidentiality', label: 'Confidentiality Review', icon: Shield },
];

function SummaryCard({ label, value, tone = 'default' }) {
  const tones = {
    default: 'border-slate-200 bg-white text-charcoal',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    danger: 'border-red-200 bg-red-50 text-red-900',
  };
  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${tones[tone] ?? tones.default}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </article>
  );
}

export default function RealContentDashboard({
  state,
  summary,
  saving,
  onAddTestimonial,
  onAddPhoto,
  onAddCaseStudy,
  onUpdateTestimonial,
  onUpdatePhoto,
  onUpdateCaseStudy,
  onRemoveTestimonial,
  onRemovePhoto,
  onRemoveCaseStudy,
  onUpdateQueue,
  onConfidentialityToggle,
}) {
  const [activeTab, setActiveTab] = useState('testimonials');

  const staticRepresentativeCount =
    REPRESENTATIVE_TESTIMONIALS.length + SHOWCASE_PROJECTS.length + 2;

  return (
    <div className="real-content-dashboard space-y-8 print:text-charcoal">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white shadow-sm print:border-slate-300 print:bg-white print:text-charcoal">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent print:text-accent">Content Governance</p>
        <h2 className="mt-2 text-3xl font-bold">Real Content Replacement System</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 print:text-metallic">
          Track customer-approved testimonials, project photography, and case studies. Representative content remains
          visible until real approved content is ready for publication.
        </p>
        {saving ? <p className="mt-3 text-xs text-slate-400">Saving…</p> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Content summary cards">
        <SummaryCard label="Representative Items (Public)" value={staticRepresentativeCount} />
        <SummaryCard label="Real Content Drafts" value={summary.realDrafts} />
        <SummaryCard label="Pending Approvals" value={summary.pendingApprovals} tone={summary.pendingApprovals > 0 ? 'warning' : 'default'} />
        <SummaryCard label="Approved Items" value={summary.approvedItems} />
        <SummaryCard label="Published Items" value={summary.publishedItems + REAL_TESTIMONIALS.length + REAL_CASE_STUDIES.length + REAL_PHOTOS.length} />
        <SummaryCard label="High-Risk Items" value={summary.highRiskItems} tone={summary.highRiskItems > 0 ? 'danger' : 'default'} />
      </section>

      <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-2" aria-label="Real content tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === id
                ? 'border-accent bg-accent text-white'
                : 'border-slate-200 text-charcoal hover:border-accent hover:text-accent'
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'testimonials' ? (
        <TestimonialApprovalTracker
          testimonials={state.testimonials}
          onAdd={onAddTestimonial}
          onUpdate={onUpdateTestimonial}
          onRemove={onRemoveTestimonial}
        />
      ) : null}

      {activeTab === 'photos' ? (
        <ProjectPhotoApprovalTracker
          photos={state.photos}
          onAdd={onAddPhoto}
          onUpdate={onUpdatePhoto}
          onRemove={onRemovePhoto}
        />
      ) : null}

      {activeTab === 'case-studies' ? (
        <CaseStudyApprovalTracker
          caseStudies={state.caseStudies}
          onAdd={onAddCaseStudy}
          onUpdate={onUpdateCaseStudy}
          onRemove={onRemoveCaseStudy}
        />
      ) : null}

      {activeTab === 'queue' ? (
        <ContentReplacementQueue
          queueProgress={summary.queueProgress}
          state={state}
          onUpdateQueue={onUpdateQueue}
        />
      ) : null}

      {activeTab === 'confidentiality' ? (
        <ContentRiskChecklist
          title="Global Confidentiality Review"
          checklist={state.confidentialityReview}
          onToggle={onConfidentialityToggle}
          printFriendly
        />
      ) : null}

      <section aria-label="Documentation links">
        <h3 className="mb-4 text-lg font-bold text-charcoal">Documentation</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {REPLACEMENT_DOCUMENTS.map((doc) => (
            <article key={doc.file} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-charcoal">{doc.title}</p>
              <p className="mt-1 text-xs text-metallic">docs/{doc.file}</p>
              <a
                href={`/docs/${doc.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                Open document
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
