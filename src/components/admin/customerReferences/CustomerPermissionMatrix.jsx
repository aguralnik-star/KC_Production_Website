import AccessibleButton from '../../AccessibleButton';
import CustomerPermissionCard from './CustomerPermissionCard';

export default function CustomerPermissionMatrix({
  matrix,
  onRequest,
  onApprove,
  onDecline,
  onRevoke,
  onUpdateEvidence,
  saving,
}) {
  if (!matrix?.length) {
    return <p className="text-sm text-metallic">No permissions loaded.</p>;
  }

  return (
    <section className="space-y-4" aria-labelledby="permission-matrix-heading">
      <div>
        <h3 id="permission-matrix-heading" className="text-lg font-bold text-charcoal">Permission Matrix</h3>
        <p className="mt-1 text-sm text-metallic">
          Track all publication permissions from one customer record. Nothing is published without documented approval.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {matrix.map((row) => (
          <CustomerPermissionCard
            key={row.permission_type}
            permission={row}
            onRequest={() => row.id && onRequest(row.id)}
            onApprove={(data) => row.id && onApprove(row.id, data)}
            onDecline={(reason) => row.id && onDecline(row.id, reason)}
            onRevoke={(reason) => row.id && onRevoke(row.id, reason)}
            onUpdateEvidence={(updates) => row.id && onUpdateEvidence(row.id, updates)}
            saving={saving}
          />
        ))}
      </div>
    </section>
  );
}
