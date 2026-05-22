import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import FactoraOSSyncStatusBadge from '../components/admin/crm/FactoraOSSyncStatusBadge';
import { getCRMOpportunities } from '../services/crmService';
import { getFactoraOSSyncEvents } from '../services/factoraOSIntegrationService';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminCRM() {
  const { session, handleSignOut } = useOutletContext();
  const [opportunities, setOpportunities] = useState([]);
  const [syncByRfq, setSyncByRfq] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    const rows = await getCRMOpportunities();
    setOpportunities(rows);

    const syncMap = {};
    await Promise.all(
      rows.map(async (opp) => {
        try {
          const events = await getFactoraOSSyncEvents(opp.rfq_request_id);
          syncMap[opp.rfq_request_id] = events[0] ?? null;
        } catch {
          syncMap[opp.rfq_request_id] = null;
        }
      })
    );
    setSyncByRfq(syncMap);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    loadAll()
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load CRM records.'))
      .finally(() => setLoading(false));
  }, [loadAll]);

  if (loading) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="CRM">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading CRM admin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead title="CRM | K&C Admin" description="RFQ-to-CRM conversions and FactoraOS sync status." noindex />
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="CRM">
        {error ? (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        ) : null}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-charcoal to-slate-800 p-6 text-white">
          <h2 className="text-2xl font-bold">CRM & FactoraOS Bridge</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Website-side CRM staging for RFQ conversions. Send approved records to FactoraOS intake queue for review — no automatic customer creation in FactoraOS.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="crm-opportunities-heading">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 id="crm-opportunities-heading" className="text-lg font-bold text-charcoal">CRM Opportunities</h2>
            <p className="mt-1 text-sm text-metallic">Converted from RFQ submissions. Manage sync from individual RFQ detail panels.</p>
          </div>

          {!opportunities.length ? (
            <p className="p-6 text-sm text-metallic">No CRM conversions yet. Convert an RFQ from the RFQ dashboard CRM tab.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-metallic">
                  <tr>
                    <th scope="col" className="px-4 py-3">Opportunity</th>
                    <th scope="col" className="px-4 py-3">Company</th>
                    <th scope="col" className="px-4 py-3">Contact</th>
                    <th scope="col" className="px-4 py-3">Stage</th>
                    <th scope="col" className="px-4 py-3">FactoraOS Sync</th>
                    <th scope="col" className="px-4 py-3">Last Sync</th>
                    <th scope="col" className="px-4 py-3">RFQ</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => {
                    const sync = syncByRfq[opp.rfq_request_id];
                    return (
                      <tr key={opp.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-charcoal">{opp.name}</td>
                        <td className="px-4 py-3 text-charcoal">{opp.crm_companies?.name || '—'}</td>
                        <td className="px-4 py-3 text-charcoal">{opp.crm_contacts?.name || '—'}</td>
                        <td className="px-4 py-3 capitalize text-charcoal">{opp.stage}</td>
                        <td className="px-4 py-3">
                          {sync ? <FactoraOSSyncStatusBadge status={sync.sync_status} /> : <span className="text-xs text-metallic">Not sent</span>}
                        </td>
                        <td className="px-4 py-3 text-charcoal">{formatDate(sync?.synced_at || sync?.sync_attempted_at)}</td>
                        <td className="px-4 py-3">
                          <a href={`/admin/rfqs?rfq=${opp.rfq_request_id}`} className="text-xs font-semibold text-accent hover:underline">
                            View RFQ
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </AdminLayout>
    </>
  );
}
