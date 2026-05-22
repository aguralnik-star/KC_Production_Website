import { PHOTO_SAFETY_CHECKLIST } from '../../../data/caseStudyData';
import AccessibleButton from '../../AccessibleButton';
import ApprovalStatusBadge from '../realContent/ApprovalStatusBadge';

export default function CaseStudyPhotoReviewGrid({
  photos,
  signedUrls,
  onApprove,
  onReject,
  onArchive,
  saving,
}) {
  if (!photos.length) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-metallic">
        No photos uploaded yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2" aria-label="Photo review grid">
      {photos.map((photo) => {
        const url = signedUrls[photo.id];
        return (
          <article key={photo.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-charcoal">{photo.file_name}</p>
              <ApprovalStatusBadge status={photo.status} />
            </div>
            {url ? (
              <img
                src={url}
                alt={photo.alt_text || photo.file_name}
                className="mt-3 aspect-[4/3] w-full rounded-lg object-cover"
                loading="lazy"
                decoding="async"
                width={640}
                height={480}
              />
            ) : (
              <div className="mt-3 flex aspect-[4/3] items-center justify-center rounded-lg bg-slate-100 text-sm text-metallic">
                Preview unavailable
              </div>
            )}
            <dl className="mt-3 space-y-1 text-xs text-metallic">
              <div><dt className="inline font-semibold">Category:</dt> <dd className="inline">{photo.category}</dd></div>
              <div><dt className="inline font-semibold">Alt:</dt> <dd className="inline">{photo.alt_text}</dd></div>
              {photo.caption ? <div><dt className="inline font-semibold">Caption:</dt> <dd className="inline">{photo.caption}</dd></div> : null}
            </dl>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-accent">Photo safety checklist</summary>
              <ul className="mt-2 space-y-1 text-xs text-charcoal">
                {PHOTO_SAFETY_CHECKLIST.map((item) => (
                  <li key={item.id}>☐ {item.label}</li>
                ))}
              </ul>
            </details>

            <div className="mt-3 flex flex-wrap gap-2">
              <AccessibleButton type="button" disabled={saving} onClick={() => onApprove(photo.id)} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                Approve
              </AccessibleButton>
              <AccessibleButton type="button" disabled={saving} onClick={() => onReject(photo.id)} className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
                Reject
              </AccessibleButton>
              <AccessibleButton type="button" disabled={saving} onClick={() => onArchive(photo.id)} className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-charcoal">
                Archive
              </AccessibleButton>
            </div>
          </article>
        );
      })}
    </div>
  );
}
