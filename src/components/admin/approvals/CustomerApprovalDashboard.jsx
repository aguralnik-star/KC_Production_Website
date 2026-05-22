const CARDS = [
  { key: 'draftRequests', label: 'Draft Requests', description: 'Drafts and copied emails not yet sent' },
  { key: 'awaitingResponse', label: 'Awaiting Response', description: 'Sent manually, waiting for customer reply' },
  { key: 'approved', label: 'Approved', description: 'Customer approval documented' },
  { key: 'declined', label: 'Declined', description: 'Customer declined publication' },
  { key: 'publishedContent', label: 'Published Content', description: 'Published testimonials and case studies' },
  { key: 'pendingReviews', label: 'Pending Reviews', description: 'Open approval requests in progress' },
];

export default function CustomerApprovalDashboard({ stats }) {
  return (
    <section aria-labelledby="approval-dashboard-heading">
      <h3 id="approval-dashboard-heading" className="sr-only">
        Approval dashboard summary
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(({ key, label, description }) => (
          <article
            key={key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            aria-label={`${label}: ${stats?.[key] ?? 0}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-metallic">{label}</p>
            <p className="mt-2 text-3xl font-bold text-charcoal">{stats?.[key] ?? 0}</p>
            <p className="mt-2 text-sm text-metallic">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
