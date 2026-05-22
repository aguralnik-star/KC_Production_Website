import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import AccessibleButton from '../../AccessibleButton';
import ApprovalStatusBadge from '../realContent/ApprovalStatusBadge';

export default function CaseStudyBuilderDashboard({ caseStudies, onCreate, creating }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">Case Study Builder</h2>
          <p className="mt-1 text-sm text-metallic">
            Build customer-approved case studies. Do not publish without documented approval and confidentiality review.
          </p>
        </div>
        <AccessibleButton
          type="button"
          onClick={onCreate}
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {creating ? 'Creating…' : 'New Case Study'}
        </AccessibleButton>
      </div>

      {!caseStudies.length ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-metallic">
          No case studies yet. Create the first real K&amp;C case study template to begin.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {caseStudies.map((study) => (
            <li key={study.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="font-bold text-charcoal">{study.title}</h3>
                </div>
                <ApprovalStatusBadge status={study.status} />
              </div>
              <p className="mt-2 text-sm text-metallic">{study.public_summary || 'No public summary yet.'}</p>
              <p className="mt-2 text-xs text-metallic">/{study.slug}</p>
              <Link
                to={`/admin/case-studies/${study.id}`}
                className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
              >
                Open builder →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
