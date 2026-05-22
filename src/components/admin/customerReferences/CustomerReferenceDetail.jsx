import CustomerReferenceEditor from './CustomerReferenceEditor';
import CustomerPermissionMatrix from './CustomerPermissionMatrix';
import CustomerLinkedContent from './CustomerLinkedContent';
import CustomerReferenceActivityFeed from './CustomerReferenceActivityFeed';
import CustomerReferenceStatusBadge from './CustomerReferenceStatusBadge';
import DoNotContactBadge from './DoNotContactBadge';

export default function CustomerReferenceDetail({
  summary,
  reference,
  matrix,
  onReferenceChange,
  onSaveReference,
  onSetDoNotContact,
  onPermissionRequest,
  onPermissionApprove,
  onPermissionDecline,
  onPermissionRevoke,
  onPermissionUpdateEvidence,
  onLinkTestimonial,
  onLinkCaseStudy,
  linkOptions,
  onBack,
  saving,
}) {
  if (!reference) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button type="button" onClick={onBack} className="text-sm font-semibold text-accent hover:underline">
            ← Back to list
          </button>
          <h2 className="mt-2 text-xl font-bold text-charcoal">
            {reference.customer_company || reference.customer_name || 'Customer Reference'}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <CustomerReferenceStatusBadge status={reference.reference_status} />
            <DoNotContactBadge active={reference.do_not_contact} />
          </div>
        </div>
      </div>

      <CustomerReferenceEditor
        reference={reference}
        onChange={onReferenceChange}
        onSave={onSaveReference}
        onSetDoNotContact={onSetDoNotContact}
        saving={saving}
      />

      <CustomerPermissionMatrix
        matrix={matrix}
        onRequest={onPermissionRequest}
        onApprove={onPermissionApprove}
        onDecline={onPermissionDecline}
        onRevoke={onPermissionRevoke}
        onUpdateEvidence={onPermissionUpdateEvidence}
        saving={saving}
      />

      <CustomerLinkedContent
        testimonials={summary?.linkedTestimonials ?? []}
        caseStudies={summary?.linkedCaseStudies ?? []}
        photos={summary?.linkedPhotos ?? []}
        approvalRequests={summary?.linkedApprovalRequests ?? []}
        onLinkTestimonial={onLinkTestimonial}
        onLinkCaseStudy={onLinkCaseStudy}
        linkOptions={linkOptions}
      />

      <CustomerReferenceActivityFeed activity={summary?.activity ?? []} />
    </div>
  );
}
