import { supabase } from '../lib/supabaseClient';
import { getCurrentUser, isCurrentUserAdmin } from './authService';

async function requireAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin access required.');
}

export async function convertRFQToCRM(rfqRequestId) {
  await requireAdminAccess();
  const user = await getCurrentUser();

  const { data: existing } = await supabase
    .from('crm_opportunities')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .maybeSingle();

  if (existing) {
    return getCRMConversionByRFQ(rfqRequestId);
  }

  const { data: rfq, error: rfqError } = await supabase
    .from('rfq_requests')
    .select('*')
    .eq('id', rfqRequestId)
    .single();

  if (rfqError || !rfq) throw new Error('RFQ request not found.');

  const companyName = rfq.company?.trim() || rfq.name?.trim() || 'Unknown Company';
  const opportunityName = `${companyName} — ${rfq.project_type || 'RFQ'}`.slice(0, 200);

  const { data: company, error: companyError } = await supabase
    .from('crm_companies')
    .insert({
      rfq_request_id: rfqRequestId,
      name: companyName,
      email: rfq.email,
      phone: rfq.phone,
      internal_notes: `Converted from RFQ ${rfq.reference_number || rfqRequestId} by ${user?.email ?? 'admin'}.`,
    })
    .select('*')
    .single();

  if (companyError) throw new Error('Unable to create CRM company.');

  const { data: contact, error: contactError } = await supabase
    .from('crm_contacts')
    .insert({
      crm_company_id: company.id,
      rfq_request_id: rfqRequestId,
      name: rfq.name,
      email: rfq.email,
      phone: rfq.phone,
    })
    .select('*')
    .single();

  if (contactError) throw new Error('Unable to create CRM contact.');

  const { data: opportunity, error: oppError } = await supabase
    .from('crm_opportunities')
    .insert({
      rfq_request_id: rfqRequestId,
      crm_company_id: company.id,
      crm_contact_id: contact.id,
      name: opportunityName,
      stage: 'lead',
      project_type: rfq.project_type,
      material: rfq.material,
      quantity: rfq.quantity,
      timeline: rfq.timeline,
      internal_notes: rfq.notes,
    })
    .select('*')
    .single();

  if (oppError) throw new Error('Unable to create CRM opportunity.');

  await supabase.from('rfq_internal_notes').insert({
    rfq_request_id: rfqRequestId,
    note: 'RFQ converted to local CRM record (company, contact, opportunity).',
  });

  return { company, contact, opportunity };
}

export async function getCRMConversionByRFQ(rfqRequestId) {
  await requireAdminAccess();

  const { data: opportunity, error } = await supabase
    .from('crm_opportunities')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .maybeSingle();

  if (error) throw new Error('Unable to load CRM conversion.');
  if (!opportunity) return null;

  const [{ data: company }, { data: contact }] = await Promise.all([
    supabase.from('crm_companies').select('*').eq('id', opportunity.crm_company_id).single(),
    supabase.from('crm_contacts').select('*').eq('id', opportunity.crm_contact_id).single(),
  ]);

  return { company, contact, opportunity };
}

export async function getCRMOpportunities() {
  await requireAdminAccess();

  const { data, error } = await supabase
    .from('crm_opportunities')
    .select(`
      *,
      crm_companies (id, name, email, phone),
      crm_contacts (id, name, email, phone, role)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw new Error('Unable to load CRM opportunities.');
  return data ?? [];
}

export async function isRFQConvertedToCRM(rfqRequestId) {
  const conversion = await getCRMConversionByRFQ(rfqRequestId);
  return Boolean(conversion?.opportunity);
}
