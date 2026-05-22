/**
 * Supabase Edge Function: public-rfq-status-lookup
 *
 * Deploy:
 *   supabase functions deploy public-rfq-status-lookup
 *
 * Required secrets:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('PUBLIC_SITE_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_LABELS: Record<string, string> = {
  received: 'RFQ Received',
  under_review: 'Under Review',
  additional_info_needed: 'Additional Information Needed',
  quote_in_progress: 'Quote In Progress',
  quote_sent: 'Quote Sent',
  completed: 'Completed',
  closed: 'Closed',
};

const DEFAULT_MESSAGES: Record<string, string> = {
  received: 'Your RFQ has been received and is waiting for review.',
  under_review: 'Our team is reviewing your RFQ and uploaded project details.',
  additional_info_needed: 'We may need additional information before we can continue review.',
  quote_in_progress: 'Your RFQ is being prepared for quoting.',
  quote_sent: 'A quote or follow-up response has been sent or is being finalized.',
  completed: 'This RFQ has been completed.',
  closed: 'This RFQ has been closed.',
};

const NOT_FOUND_MESSAGE =
  'We could not locate an RFQ using that reference number and email combination.';

function mapInternalStatusToPublicStatus(internalStatus: string | null) {
  switch (internalStatus) {
    case 'new':
      return 'received';
    case 'in_review':
      return 'under_review';
    case 'waiting_on_customer':
      return 'additional_info_needed';
    case 'quote_ready':
      return 'quote_in_progress';
    case 'quoted':
    case 'follow_up_needed':
      return 'quote_sent';
    case 'won':
      return 'completed';
    case 'lost':
    case 'closed':
    case 'rejected':
      return 'closed';
    default:
      return 'received';
  }
}

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

function normalizeReferenceNumber(value: string) {
  return value.trim().toUpperCase();
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getClientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? null;
}

function toPublicDate(value: string | null | undefined) {
  if (!value) return null;
  return new Date(value).toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed.' }, 405);
    }

    const body = await req.json();
    const referenceNumber = normalizeReferenceNumber(String(body?.reference_number ?? ''));
    const email = normalizeEmail(String(body?.email ?? ''));

    if (!referenceNumber || !email) {
      return jsonResponse({ found: false, message: NOT_FOUND_MESSAGE });
    }

    if (referenceNumber.length < 8 || !EMAIL_PATTERN.test(email)) {
      return jsonResponse({ found: false, message: NOT_FOUND_MESSAGE });
    }

    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const clientIp = getClientIp(req);
    const userAgent = req.headers.get('user-agent');

    const { data: rfq, error: rfqError } = await supabase
      .from('rfq_requests')
      .select(
        'id, reference_number, submitted_at, created_at, updated_at, company, name, project_type, material, quantity, timeline, public_status, customer_status_message, status, email',
      )
      .eq('reference_number', referenceNumber)
      .ilike('email', email)
      .maybeSingle();

    if (rfqError) {
      console.error('RFQ lookup error:', rfqError);
      return jsonResponse({ error: 'Unable to process status lookup.' }, 500);
    }

    await supabase.from('rfq_customer_status_lookup_events').insert({
      reference_number: referenceNumber,
      email,
      matched_rfq_request_id: rfq?.id ?? null,
      lookup_success: Boolean(rfq),
      client_ip: clientIp,
      user_agent: userAgent,
    });

    if (!rfq) {
      return jsonResponse({ found: false, message: NOT_FOUND_MESSAGE });
    }

    await supabase
      .from('rfq_requests')
      .update({ last_customer_status_viewed_at: new Date().toISOString() })
      .eq('id', rfq.id);

    const publicStatus = rfq.public_status || mapInternalStatusToPublicStatus(rfq.status);
    const customerStatusMessage =
      rfq.customer_status_message?.trim()
      || DEFAULT_MESSAGES[publicStatus]
      || DEFAULT_MESSAGES.received;

    const lastUpdated = rfq.updated_at ?? rfq.submitted_at ?? rfq.created_at;

    return jsonResponse({
      found: true,
      reference_number: rfq.reference_number,
      submitted_at: rfq.submitted_at ?? rfq.created_at,
      company: rfq.company,
      name: rfq.name,
      project_type: rfq.project_type,
      material: rfq.material,
      quantity: rfq.quantity,
      timeline: rfq.timeline,
      public_status: publicStatus,
      customer_status_label: STATUS_LABELS[publicStatus] ?? STATUS_LABELS.received,
      customer_status_message: customerStatusMessage,
      last_updated_public_date: toPublicDate(lastUpdated),
    });
  } catch (error) {
    console.error('public-rfq-status-lookup error:', error);
    return jsonResponse({ error: 'Unable to process status lookup.' }, 500);
  }
});
