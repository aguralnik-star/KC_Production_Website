import { AlertTriangle } from 'lucide-react';

function ContentItem({ title, status, approvalLabel, published, warning }) {
  return (
    <li className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-charcoal">{title}</p>
        <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs capitalize text-charcoal">{status}</span>
      </div>
      <p className="mt-1 text-xs text-metallic">Approval: {approvalLabel}</p>
      <p className="text-xs text-metallic">Published: {published ? 'Yes' : 'No'}</p>
      {warning ? (
        <p className="mt-2 flex items-start gap-1 text-xs text-amber-800" role="alert">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          {warning}
        </p>
      ) : null}
    </li>
  );
}

export default function CustomerLinkedContent({
  testimonials,
  caseStudies,
  photos,
  approvalRequests,
  onLinkTestimonial,
  onLinkCaseStudy,
  linkOptions,
}) {
  return (
    <section className="space-y-6" aria-labelledby="linked-content-heading">
      <div>
        <h3 id="linked-content-heading" className="text-lg font-bold text-charcoal">Linked Content</h3>
        <p className="mt-1 text-sm text-metallic">Testimonials, case studies, photos, and approval requests tied to this customer reference.</p>
      </div>

      {(linkOptions?.testimonials?.length || linkOptions?.caseStudies?.length) ? (
        <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          {linkOptions?.testimonials?.length ? (
            <label className="text-xs font-semibold text-metallic">
              Link Testimonial
              <select
                className="ml-2 rounded border border-slate-200 px-2 py-1 text-sm"
                defaultValue=""
                onChange={(e) => e.target.value && onLinkTestimonial?.(e.target.value)}
              >
                <option value="">Select…</option>
                {linkOptions.testimonials.map((t) => (
                  <option key={t.id} value={t.id}>{t.customer_name || t.quote?.slice(0, 40) || t.id}</option>
                ))}
              </select>
            </label>
          ) : null}
          {linkOptions?.caseStudies?.length ? (
            <label className="text-xs font-semibold text-metallic">
              Link Case Study
              <select
                className="ml-2 rounded border border-slate-200 px-2 py-1 text-sm"
                defaultValue=""
                onChange={(e) => e.target.value && onLinkCaseStudy?.(e.target.value)}
              >
                <option value="">Select…</option>
                {linkOptions.caseStudies.map((c) => (
                  <option key={c.id} value={c.id}>{c.title || c.id}</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-metallic">Testimonials</h4>
          <ul className="mt-2 space-y-2">
            {testimonials.length ? testimonials.map((t) => (
              <ContentItem
                key={t.id}
                title={t.quote?.slice(0, 80) || 'Testimonial'}
                status={t.status}
                approvalLabel={t.approval_received ? 'Documented' : 'Missing'}
                published={t.status === 'published'}
                warning={!t.approval_received || !t.confidentiality_review_complete ? 'Incomplete approval or confidentiality review.' : null}
              />
            )) : <li className="text-sm text-metallic">No linked testimonials.</li>}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-metallic">Case Studies</h4>
          <ul className="mt-2 space-y-2">
            {caseStudies.length ? caseStudies.map((c) => (
              <ContentItem
                key={c.id}
                title={c.title || 'Case Study'}
                status={c.status}
                approvalLabel={c.customer_approval_received ? 'Documented' : 'Missing'}
                published={c.status === 'published'}
                warning={!c.customer_approval_received || !c.confidentiality_review_complete ? 'Incomplete approval or confidentiality review.' : null}
              />
            )) : <li className="text-sm text-metallic">No linked case studies.</li>}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-metallic">Project Photos</h4>
          <ul className="mt-2 space-y-2">
            {photos.length ? photos.map((p) => (
              <ContentItem
                key={p.id}
                title={p.file_name || 'Photo'}
                status={p.status}
                approvalLabel={p.approved_for_public_use ? 'Approved' : 'Not approved'}
                published={p.status === 'published'}
                warning={!p.confidentiality_review_complete ? 'Confidentiality review incomplete.' : null}
              />
            )) : <li className="text-sm text-metallic">No linked photos.</li>}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-metallic">Approval Requests</h4>
          <ul className="mt-2 space-y-2">
            {approvalRequests.length ? approvalRequests.map((r) => (
              <ContentItem
                key={r.id}
                title={r.subject || r.request_type}
                status={r.status}
                approvalLabel={r.approval_received ? 'Received' : 'Pending'}
                published={false}
                warning={null}
              />
            )) : <li className="text-sm text-metallic">No linked approval requests.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
