import { useCallback, useEffect, useState } from 'react';
import { Building2, Loader2, UserRound } from 'lucide-react';
import AccessibleButton from '../../AccessibleButton';
import FactoraOSSyncPanel from './FactoraOSSyncPanel';
import { convertRFQToCRM, getCRMConversionByRFQ } from '../../../services/crmService';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function RFQToCRMConversionPanel({ request, onConverted }) {
  const [conversion, setConversion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');

  const loadConversion = useCallback(async () => {
    if (!request?.id) {
      setConversion(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getCRMConversionByRFQ(request.id);
      setConversion(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load CRM conversion.');
    } finally {
      setLoading(false);
    }
  }, [request?.id]);

  useEffect(() => {
    loadConversion();
  }, [loadConversion]);

  const handleConvert = async () => {
    if (!request?.id) return;
    setConverting(true);
    setError('');
    try {
      const data = await convertRFQToCRM(request.id);
      setConversion(data);
      onConverted?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to convert RFQ to CRM.');
    } finally {
      setConverting(false);
    }
  };

  if (!request) {
    return <p className="text-sm text-metallic">Select an RFQ to manage CRM conversion.</p>;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-metallic">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading CRM status…
      </div>
    );
  }

  const isConverted = Boolean(conversion?.opportunity);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="crm-conversion-heading">
        <h3 id="crm-conversion-heading" className="text-sm font-bold text-charcoal">Local CRM Conversion</h3>
        <p className="mt-1 text-xs text-metallic">
          Create a website-side company, contact, and opportunity record before sending to FactoraOS for review.
        </p>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
            {error}
          </div>
        ) : null}

        {isConverted ? (
          <div className="mt-4 space-y-4">
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Converted to local CRM on {formatDate(conversion.opportunity.created_at)}.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-lg border border-slate-200 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-metallic">
                  <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Company
                </p>
                <p className="mt-1 font-medium text-charcoal">{conversion.company?.name}</p>
                <p className="text-xs text-metallic">{conversion.company?.email}</p>
              </article>
              <article className="rounded-lg border border-slate-200 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-metallic">
                  <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                  Contact
                </p>
                <p className="mt-1 font-medium text-charcoal">{conversion.contact?.name}</p>
                <p className="text-xs text-metallic">{conversion.contact?.email}</p>
              </article>
            </div>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Opportunity</dt>
                <dd className="text-charcoal">{conversion.opportunity?.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-metallic">Stage</dt>
                <dd className="capitalize text-charcoal">{conversion.opportunity?.stage}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="mt-4">
            <p className="mb-3 text-sm text-metallic">
              This RFQ has not been converted to a local CRM record yet.
            </p>
            <AccessibleButton
              type="button"
              onClick={handleConvert}
              disabled={converting}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {converting ? 'Converting…' : 'Convert RFQ to CRM'}
            </AccessibleButton>
          </div>
        )}
      </section>

      <FactoraOSSyncPanel rfqRequestId={request.id} crmConverted={isConverted} />
    </div>
  );
}
