/**
 * Supabase Edge Function: send-customer-status-update
 *
 * Deploy:
 *   supabase functions deploy send-customer-status-update
 *
 * Required secrets:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPABASE_ANON_KEY
 *   RESEND_API_KEY
 *   RFQ_FROM_EMAIL
 *   RFQ_REPLY_TO
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
const SENDABLE_STATUSES = new Set(['draft', 'ready', 'failed']);

function escapeHtml(value: string | null | undefined) {
  if (!value) return '';
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function textToHtml(text: string) {
  return escapeHtml(text).replaceAll('\n', '<br/>');
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getFromEmail() {
  return (
    Deno.env.get('RFQ_FROM_EMAIL') ??
    Deno.env.get('RFQ_NOTIFICATION_FROM') ??
    'K&C Design and Manufacturing <onboarding@resend.dev>'
  );
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
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
    const resendApiKey = getRequiredEnv('RESEND_API_KEY');
    const replyTo = Deno.env.get('RFQ_REPLY_TO') ?? 'info@kcdesignmfg.com';
    const fromEmail = getFromEmail();

    const auth = await verifyAdminUser(req, supabaseUrl, anonKey);
    if (!auth.ok) {
      return jsonResponse({ error: auth.message }, auth.status);
    }

    const { user, serviceClient: supabase } = auth;
    const body = await req.json();
    const draftId = body?.draft_id;

    if (!draftId || typeof draftId !== 'string' || !UUID_PATTERN.test(draftId)) {
      return jsonResponse({ error: 'Invalid draft ID.' }, 400);
    }

    const { data: draft, error: draftError } = await supabase
      .from('rfq_customer_status_email_drafts')
      .select('*')
      .eq('id', draftId)
      .single();

    if (draftError || !draft) {
      return jsonResponse({ error: 'Draft not found.' }, 404);
    }

    if (!SENDABLE_STATUSES.has(draft.status)) {
      return jsonResponse({ error: 'This draft cannot be sent.' }, 400);
    }

    if (!draft.subject?.trim() || !draft.body?.trim()) {
      return jsonResponse({ error: 'Draft subject and body are required.' }, 400);
    }

    const { data: rfq, error: rfqError } = await supabase
      .from('rfq_requests')
      .select('id, email, public_status, customer_status_message')
      .eq('id', draft.rfq_request_id)
      .single();

    if (rfqError || !rfq?.email) {
      return jsonResponse({ error: 'Customer email address is missing.' }, 400);
    }

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6;max-width:640px;">
        ${textToHtml(draft.body)}
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [rfq.email],
        subject: draft.subject,
        html,
        text: draft.body,
        reply_to: replyTo,
      }),
    });

    if (!resendResponse.ok) {
      const safeError = 'Email delivery failed.';
      console.error('Resend error:', await resendResponse.text());

      await supabase
        .from('rfq_customer_status_email_drafts')
        .update({ status: 'failed', send_error: safeError })
        .eq('id', draftId);

      await supabase.from('rfq_customer_status_email_events').insert({
        rfq_request_id: draft.rfq_request_id,
        draft_id: draftId,
        sent_by: user.id,
        sent_to_email: rfq.email,
        subject: draft.subject,
        public_status: draft.public_status,
        status: 'failed',
        error_message: safeError,
      });

      await supabase
        .from('rfq_requests')
        .update({
          last_customer_status_email_status: 'failed',
          last_customer_status_email_error: safeError,
        })
        .eq('id', draft.rfq_request_id);

      return jsonResponse({ sent: false, error: safeError }, 502);
    }

    const resendData = await resendResponse.json();
    const sentAt = new Date().toISOString();

    await supabase
      .from('rfq_customer_status_email_drafts')
      .update({
        status: 'sent',
        sent_at: sentAt,
        sent_by: user.id,
        resend_email_id: resendData.id ?? null,
        send_error: null,
      })
      .eq('id', draftId);

    await supabase.from('rfq_customer_status_email_events').insert({
      rfq_request_id: draft.rfq_request_id,
      draft_id: draftId,
      sent_by: user.id,
      sent_to_email: rfq.email,
      subject: draft.subject,
      public_status: draft.public_status,
      resend_email_id: resendData.id ?? null,
      status: 'sent',
    });

    await supabase
      .from('rfq_requests')
      .update({
        public_status: draft.public_status,
        last_customer_status_email_sent_at: sentAt,
        last_customer_status_email_status: 'sent',
        last_customer_status_email_error: null,
      })
      .eq('id', draft.rfq_request_id);

    await supabase.from('rfq_internal_notes').insert({
      rfq_request_id: draft.rfq_request_id,
      created_by: user.id,
      note: 'Customer status update email sent.',
    });

    return jsonResponse({
      sent: true,
      resend_email_id: resendData.id ?? null,
    });
  } catch (error) {
    console.error('send-customer-status-update error:', error);
    return jsonResponse({ error: 'Unable to send customer status update email.' }, 500);
  }
});
