import { supabase } from '../lib/supabaseClient';
import { isCurrentUserAdmin } from './authService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

export async function sendRFQToFactoraOS(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase.functions.invoke('send-rfq-to-factoraos', {
    body: { rfq_request_id: rfqRequestId },
  });

  if (error) {
    throw new Error('Unable to send RFQ to FactoraOS.');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data?.success) {
    throw new Error(data?.error_message || 'FactoraOS sync failed.');
  }

  return data;
}

export async function getFactoraOSSyncEvents(rfqRequestId) {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('factoraos_crm_sync_events')
    .select('id, created_at, sync_status, sync_attempted_at, synced_at, factoraos_intake_id, error_message')
    .eq('rfq_request_id', rfqRequestId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw new Error('Unable to load FactoraOS sync events.');
  return data ?? [];
}

export async function retryFactoraOSSync(syncEventId) {
  await requireAdminAccess();

  const { data, error } = await supabase.functions.invoke('send-rfq-to-factoraos', {
    body: { sync_event_id: syncEventId },
  });

  if (error) {
    throw new Error('Unable to retry FactoraOS sync.');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data?.success) {
    throw new Error(data?.error_message || 'FactoraOS sync retry failed.');
  }

  return data;
}

export async function getLatestFactoraOSSyncEvent(rfqRequestId) {
  const events = await getFactoraOSSyncEvents(rfqRequestId);
  return events[0] ?? null;
}
