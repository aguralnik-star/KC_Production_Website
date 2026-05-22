/**
 * Supabase Edge Function: send-rfq-notification
 *
 * Deploy:
 *   supabase functions deploy send-rfq-notification
 *
 * Required Supabase secrets (Dashboard → Edge Functions → Secrets):
 *   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 *   RESEND_API_KEY=re_xxxxxxxx
 *   RFQ_NOTIFICATION_TO=info@kcdesignmfg.com
 *   RFQ_NOTIFICATION_FROM=K&C RFQ <rfq@your-verified-domain.com>
 *
 * Never expose SUPABASE_SERVICE_ROLE_KEY or RESEND_API_KEY in the frontend.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function escapeHtml(value: string | null | undefined) {
  if (!value) return '—';
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const rfqRequestId = body?.rfq_request_id;

    if (!rfqRequestId || typeof rfqRequestId !== 'string' || !UUID_PATTERN.test(rfqRequestId)) {
      return new Response(JSON.stringify({ error: 'Invalid RFQ request ID.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = getEnv('SUPABASE_URL');
    const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = getEnv('RESEND_API_KEY');
    const notificationTo = Deno.env.get('RFQ_NOTIFICATION_TO') ?? 'info@kcdesignmfg.com';
    const notificationFrom =
      Deno.env.get('RFQ_NOTIFICATION_FROM') ?? 'K&C RFQ <onboarding@resend.dev>';

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: rfq, error: rfqError } = await supabase
      .from('rfq_requests')
      .select('*')
      .eq('id', rfqRequestId)
      .single();

    if (rfqError || !rfq) {
      return new Response(JSON.stringify({ error: 'RFQ request not found.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: files, error: filesError } = await supabase
      .from('rfq_files')
      .select('file_name, file_path, file_type, file_size')
      .eq('rfq_request_id', rfqRequestId)
      .order('created_at', { ascending: true });

    if (filesError) {
      return new Response(JSON.stringify({ error: 'Unable to load RFQ files.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subjectName = rfq.company?.trim() || rfq.name?.trim() || 'Website Visitor';
    const subject = `New RFQ Request - ${subjectName}`;

    const fileLines = (files ?? []).length
      ? (files ?? [])
          .map(
            (file) =>
              `<li><strong>${escapeHtml(file.file_name)}</strong><br/>Path: ${escapeHtml(file.file_path)}<br/>Type: ${escapeHtml(file.file_type)} | Size: ${file.file_size ?? 'unknown'} bytes</li>`,
          )
          .join('')
      : '<li>No files uploaded</li>';

    const html = `
      <h2>New RFQ Submission</h2>
      <p>A new request for quote was submitted on the K&amp;C website.</p>
      <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr><td><strong>RFQ ID</strong></td><td>${escapeHtml(rfq.id)}</td></tr>
        <tr><td><strong>Submitted</strong></td><td>${escapeHtml(rfq.created_at)}</td></tr>
        <tr><td><strong>Name</strong></td><td>${escapeHtml(rfq.name)}</td></tr>
        <tr><td><strong>Company</strong></td><td>${escapeHtml(rfq.company)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(rfq.email)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(rfq.phone)}</td></tr>
        <tr><td><strong>Project Type</strong></td><td>${escapeHtml(rfq.project_type)}</td></tr>
        <tr><td><strong>Material</strong></td><td>${escapeHtml(rfq.material)}</td></tr>
        <tr><td><strong>Quantity</strong></td><td>${escapeHtml(rfq.quantity)}</td></tr>
        <tr><td><strong>Timeline</strong></td><td>${escapeHtml(rfq.timeline)}</td></tr>
        <tr><td><strong>Notes</strong></td><td>${escapeHtml(rfq.notes)}</td></tr>
      </table>
      <h3>Uploaded Files</h3>
      <ul>${fileLines}</ul>
    `;

    const text = [
      'New RFQ Submission',
      `RFQ ID: ${rfq.id}`,
      `Name: ${rfq.name}`,
      `Company: ${rfq.company ?? '—'}`,
      `Email: ${rfq.email}`,
      `Phone: ${rfq.phone ?? '—'}`,
      `Project Type: ${rfq.project_type ?? '—'}`,
      `Material: ${rfq.material ?? '—'}`,
      `Quantity: ${rfq.quantity ?? '—'}`,
      `Timeline: ${rfq.timeline ?? '—'}`,
      `Notes: ${rfq.notes ?? '—'}`,
      '',
      'Uploaded Files:',
      ...(files ?? []).map((file) => `- ${file.file_name} (${file.file_path})`),
    ].join('\n');

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: notificationFrom,
        to: [notificationTo],
        subject,
        html,
        text,
        reply_to: rfq.email,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error('Resend API error:', resendError);
      return new Response(JSON.stringify({ error: 'Failed to send notification email.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendData = await resendResponse.json();

    return new Response(JSON.stringify({ success: true, messageId: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('send-rfq-notification error:', error);
    return new Response(JSON.stringify({ error: 'Unable to process RFQ notification.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
