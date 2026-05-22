import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import {
  corsHeaders,
  escapeHtml,
  getFromEmail,
  getRequiredEnv,
  jsonResponse,
} from '../_shared/additionalInfo.ts';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ADMIN_ROLES = new Set(['admin', 'owner']);
const SENDABLE_STATUSES = new Set(['draft', 'failed']);

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
  const { data: profile } = await serviceClient
    .from('admin_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_active || !ADMIN_ROLES.has(profile.role)) {
    return { ok: false as const, status: 403, message: 'Admin access required.' };
  }

  return { ok: true as const, user, serviceClient };
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
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
    const siteUrl = (Deno.env.get('PUBLIC_SITE_URL') ?? Deno.env.get('VITE_SITE_URL') ?? 'http://localhost:5173').replace(/\/$/, '');
    const replyTo = Deno.env.get('RFQ_REPLY_TO') ?? 'info@kcdesignmfg.com';
    const fromEmail = getFromEmail();
    const resendApiKey = getRequiredEnv('RESEND_API_KEY');

    const auth = await verifyAdminUser(req, supabaseUrl, anonKey);
    if (!auth.ok) {
      return jsonResponse({ error: auth.message }, auth.status);
    }

    const body = await req.json();
    const requestId = body?.additional_info_request_id;

    if (!requestId || typeof requestId !== 'string' || !UUID_PATTERN.test(requestId)) {
      return jsonResponse({ error: 'Invalid request ID.' }, 400);
    }

    const { data: infoRequest, error: requestError } = await auth.serviceClient
      .from('rfq_additional_info_requests')
      .select(`
        *,
        rfq_requests (
          id,
          reference_number,
          name,
          email,
          company,
          additional_info_request_count
        )
      `)
      .eq('id', requestId)
      .single();

    if (requestError || !infoRequest) {
      return jsonResponse({ error: 'Additional info request not found.' }, 404);
    }

    if (!SENDABLE_STATUSES.has(infoRequest.status)) {
      return jsonResponse({ error: 'This request cannot be sent.' }, 400);
    }

    if (!infoRequest.subject?.trim() || !infoRequest.message?.trim()) {
      return jsonResponse({ error: 'Subject and message are required.' }, 400);
    }

    if (new Date(infoRequest.expires_at) <= new Date()) {
      return jsonResponse({ error: 'Expiration date must be in the future.' }, 400);
    }

    const rfq = infoRequest.rfq_requests as Record<string, string | number | null>;
    const customerEmail = infoRequest.customer_email ?? (rfq?.email as string);

    if (!customerEmail) {
      return jsonResponse({ error: 'Customer email is missing.' }, 400);
    }

    const uploadLink = `${siteUrl}/rfq/additional-info/${infoRequest.request_token}`;
    const customerName = (rfq?.name as string) ?? 'there';
    const referenceNumber = (rfq?.reference_number as string) ?? 'your RFQ';

    const emailText = [
      `Hi ${customerName},`,
      '',
      infoRequest.message,
      '',
      `RFQ Reference Number: ${referenceNumber}`,
      infoRequest.requested_items ? `Requested Items:\n${infoRequest.requested_items}` : '',
      '',
      'Please use the secure link below to provide the requested information:',
      uploadLink,
      '',
      `This link expires on ${formatDate(infoRequest.expires_at)}.`,
      '',
      'Thank you,',
      'K&C Design and Manufacturing',
      '422 S. Irmen Drive',
      'Addison, IL 60101',
      'Phone: (630) 543-3386',
      'Email: info@kcdesignmfg.com',
    ].filter(Boolean).join('\n');

    const emailHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6;max-width:640px;">
        <p>Hi ${escapeHtml(customerName)},</p>
        <p>${escapeHtml(infoRequest.message).replaceAll('\n', '<br/>')}</p>
        <p><strong>RFQ Reference Number:</strong> ${escapeHtml(referenceNumber)}</p>
        ${infoRequest.requested_items ? `<p><strong>Requested Items:</strong><br/>${escapeHtml(infoRequest.requested_items).replaceAll('\n', '<br/>')}</p>` : ''}
        <p><strong>Secure Upload Link:</strong><br/><a href="${escapeHtml(uploadLink)}">${escapeHtml(uploadLink)}</a></p>
        <p><strong>Expires:</strong> ${escapeHtml(formatDate(infoRequest.expires_at))}</p>
        <p>Thank you,<br/>K&amp;C Design and Manufacturing<br/>422 S. Irmen Drive<br/>Addison, IL 60101<br/>Phone: (630) 543-3386<br/>Email: info@kcdesignmfg.com</p>
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
        to: [customerEmail],
        subject: infoRequest.subject,
        html: emailHtml,
        text: emailText,
        reply_to: replyTo,
      }),
    });

    if (!resendResponse.ok) {
      const safeError = 'Email delivery failed.';
      console.error('Resend error:', await resendResponse.text());

      await auth.serviceClient
        .from('rfq_additional_info_requests')
        .update({ status: 'failed', send_error: safeError })
        .eq('id', requestId);

      return jsonResponse({ sent: false, error: safeError }, 502);
    }

    const resendData = await resendResponse.json();
    const sentAt = new Date().toISOString();

    await auth.serviceClient
      .from('rfq_additional_info_requests')
      .update({
        status: 'sent',
        sent_at: sentAt,
        sent_by: auth.user.id,
        resend_email_id: resendData.id ?? null,
        send_error: null,
        customer_email: customerEmail,
      })
      .eq('id', requestId);

    await auth.serviceClient
      .from('rfq_requests')
      .update({
        status: 'waiting_on_customer',
        public_status: 'additional_info_needed',
        additional_info_requested_at: sentAt,
        additional_info_due_at: infoRequest.expires_at,
        additional_info_request_count: Number(rfq?.additional_info_request_count ?? 0) + 1,
      })
      .eq('id', infoRequest.rfq_request_id);

    await auth.serviceClient.from('rfq_internal_notes').insert({
      rfq_request_id: infoRequest.rfq_request_id,
      created_by: auth.user.id,
      note: 'Additional information request sent to customer.',
    });

    return jsonResponse({
      sent: true,
      resend_email_id: resendData.id ?? null,
      upload_link: uploadLink,
    });
  } catch (err) {
    console.error('send-additional-info-request error:', err);
    return jsonResponse({ error: 'Unable to send additional information request.' }, 500);
  }
});
