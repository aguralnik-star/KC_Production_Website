/**
 * Supabase Edge Function: send-rfq-to-factoraos
 *
 * Deploy:
 *   supabase functions deploy send-rfq-to-factoraos
 *
 * Required secrets:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPABASE_ANON_KEY
 *   FACTORAOS_INTAKE_ENDPOINT
 *   FACTORAOS_INTAKE_API_KEY
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('PUBLIC_SITE_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ADMIN_ROLES = new Set(['admin', 'owner']);

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function safeErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.slice(0, 500);
  }
  return 'FactoraOS sync failed.';
}

async function verifyAdminUser(req: Request, supabaseUrl: string, anonKey: string) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { ok: false as const, status: 401, message: 'Authentication required.' };
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userError } = await authClient.auth.getUser();
  if (userError || !user) {
    return { ok: false as const, status: 401, message: 'Invalid authentication.' };
  }

  const serviceClient = createClient(supabaseUrl, getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'));
  const { data: profile, error: profileError } = await serviceClient
    .from('admin_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile?.is_active || !ADMIN_ROLES.has(profile.role)) {
    return { ok: false as const, status: 403, message: 'Admin access required.' };
  }

  return { ok: true as const, user, serviceClient };
}

type IntakePayload = Record<string, unknown>;

function buildIntakePayload(
  rfq: Record<string, unknown>,
  company: Record<string, unknown>,
  contact: Record<string, unknown>,
  opportunity: Record<string, unknown>,
  files: Array<{ file_name: string; file_type: string | null; file_size: number | null }>,
): IntakePayload {
  return {
    source_system: 'kc_website',
    source_type: 'rfq_to_crm_conversion',
    source_rfq_id: rfq.id,
    reference_number: rfq.reference_number ?? null,
    company: {
      name: company.name ?? rfq.company ?? rfq.name,
      email: company.email ?? rfq.email,
      phone: company.phone ?? rfq.phone,
      industry: company.industry ?? null,
    },
    contact: {
      name: contact.name ?? rfq.name,
      email: contact.email ?? rfq.email,
      phone: contact.phone ?? rfq.phone,
      role: contact.role ?? null,
    },
    opportunity: {
      name: opportunity.name,
      stage: opportunity.stage,
      estimated_value: opportunity.estimated_value ?? null,
      quoted_value: opportunity.quoted_value ?? null,
      expected_close_date: opportunity.expected_close_date ?? null,
      project_type: opportunity.project_type ?? rfq.project_type,
      material: opportunity.material ?? rfq.material,
      quantity: opportunity.quantity ?? rfq.quantity,
      timeline: opportunity.timeline ?? rfq.timeline,
    },
    rfq: {
      submitted_at: rfq.submitted_at ?? rfq.created_at,
      notes: rfq.notes ?? null,
      status: rfq.status,
      public_status: rfq.public_status ?? null,
      files: files.map((file) => ({
        file_name: file.file_name,
        file_type: file.file_type,
        file_size: file.file_size,
      })),
    },
    integration_policy: {
      create_customer_automatically: false,
      requires_review: true,
      allow_duplicate_detection: true,
    },
  };
}

async function addInternalNote(
  supabase: ReturnType<typeof createClient>,
  rfqRequestId: string,
  note: string,
) {
  const { error } = await supabase.from('rfq_internal_notes').insert({
    rfq_request_id: rfqRequestId,
    note,
  });
  if (error) console.error('Unable to add internal note:', error);
}

async function processSync(
  supabase: ReturnType<typeof createClient>,
  rfqRequestId: string,
  syncEventId: string | null,
  intakeEndpoint: string,
  intakeApiKey: string,
) {
  const { data: opportunity, error: oppError } = await supabase
    .from('crm_opportunities')
    .select('*')
    .eq('rfq_request_id', rfqRequestId)
    .maybeSingle();

  if (oppError || !opportunity) {
    throw new Error('RFQ must be converted to local CRM before sending to FactoraOS.');
  }

  const [{ data: rfq, error: rfqError }, { data: company }, { data: contact }, { data: files }] =
    await Promise.all([
      supabase.from('rfq_requests').select('*').eq('id', rfqRequestId).single(),
      supabase.from('crm_companies').select('*').eq('id', opportunity.crm_company_id).single(),
      supabase.from('crm_contacts').select('*').eq('id', opportunity.crm_contact_id).single(),
      supabase
        .from('rfq_files')
        .select('file_name, file_type, file_size')
        .eq('rfq_request_id', rfqRequestId)
        .order('created_at', { ascending: true }),
    ]);

  if (rfqError || !rfq || !company || !contact) {
    throw new Error('Unable to load RFQ or CRM records.');
  }

  const payload = buildIntakePayload(rfq, company, contact, opportunity, files ?? []);
  const now = new Date().toISOString();

  let syncRowId = syncEventId;

  if (!syncRowId) {
    const { data: created, error: insertError } = await supabase
      .from('factoraos_crm_sync_events')
      .insert({
        rfq_request_id: rfqRequestId,
        crm_company_id: company.id,
        crm_contact_id: contact.id,
        crm_opportunity_id: opportunity.id,
        sync_status: 'pending',
        sync_attempted_at: now,
        payload,
      })
      .select('id')
      .single();

    if (insertError || !created) {
      throw new Error('Unable to create sync event.');
    }
    syncRowId = created.id;
  } else {
    await supabase
      .from('factoraos_crm_sync_events')
      .update({
        sync_status: 'pending',
        sync_attempted_at: now,
        payload,
        error_message: null,
      })
      .eq('id', syncRowId);
  }

  try {
    const response = await fetch(intakeEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${intakeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let responseJson: Record<string, unknown> = {};
    try {
      responseJson = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseJson = {};
    }

    if (!response.ok) {
      const errorMessage = (
        (responseJson.error as string) ||
        (responseJson.message as string) ||
        `FactoraOS intake returned HTTP ${response.status}.`
      ).slice(0, 500);

      await supabase
        .from('factoraos_crm_sync_events')
        .update({
          sync_status: 'failed',
          error_message: errorMessage,
        })
        .eq('id', syncRowId);

      return {
        success: false,
        sync_event_id: syncRowId,
        sync_status: 'failed',
        error_message: errorMessage,
      };
    }

    const intakeId =
      (responseJson.intake_id as string) ||
      (responseJson.id as string) ||
      (responseJson.factoraos_intake_id as string) ||
      null;

    const syncedAt = new Date().toISOString();
    await supabase
      .from('factoraos_crm_sync_events')
      .update({
        sync_status: 'sent',
        synced_at: syncedAt,
        factoraos_intake_id: intakeId,
        error_message: null,
      })
      .eq('id', syncRowId);

    await addInternalNote(supabase, rfqRequestId, 'RFQ sent to FactoraOS CRM intake queue.');

    return {
      success: true,
      sync_event_id: syncRowId,
      sync_status: 'sent',
      factoraos_intake_id: intakeId,
      synced_at: syncedAt,
    };
  } catch (error) {
    const errorMessage = safeErrorMessage(error);
    await supabase
      .from('factoraos_crm_sync_events')
      .update({
        sync_status: 'failed',
        error_message: errorMessage,
      })
      .eq('id', syncRowId);

    return {
      success: false,
      sync_event_id: syncRowId,
      sync_status: 'failed',
      error_message: errorMessage,
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed.' }, 405);
    }

    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const anonKey = getRequiredEnv('SUPABASE_ANON_KEY');
    const intakeEndpoint = getRequiredEnv('FACTORAOS_INTAKE_ENDPOINT');
    const intakeApiKey = getRequiredEnv('FACTORAOS_INTAKE_API_KEY');

    const auth = await verifyAdminUser(req, supabaseUrl, anonKey);
    if (!auth.ok) {
      return jsonResponse({ error: auth.message }, auth.status);
    }

    const body = await req.json();
    const rfqRequestId = body?.rfq_request_id as string | undefined;
    const syncEventId = body?.sync_event_id as string | undefined;

    if (syncEventId) {
      if (!UUID_PATTERN.test(syncEventId)) {
        return jsonResponse({ error: 'Invalid sync event ID.' }, 400);
      }

      const { data: syncEvent, error: syncError } = await auth.serviceClient
        .from('factoraos_crm_sync_events')
        .select('rfq_request_id, sync_status')
        .eq('id', syncEventId)
        .single();

      if (syncError || !syncEvent) {
        return jsonResponse({ error: 'Sync event not found.' }, 404);
      }

      const result = await processSync(
        auth.serviceClient,
        syncEvent.rfq_request_id,
        syncEventId,
        intakeEndpoint,
        intakeApiKey,
      );

      return jsonResponse(result, result.success ? 200 : 502);
    }

    if (!rfqRequestId || !UUID_PATTERN.test(rfqRequestId)) {
      return jsonResponse({ error: 'Invalid RFQ request ID.' }, 400);
    }

    const result = await processSync(
      auth.serviceClient,
      rfqRequestId,
      null,
      intakeEndpoint,
      intakeApiKey,
    );

    return jsonResponse(result, result.success ? 200 : 502);
  } catch (error) {
    console.error('send-rfq-to-factoraos error:', error);
    return jsonResponse({ error: 'Unable to send RFQ to FactoraOS.' }, 500);
  }
});
