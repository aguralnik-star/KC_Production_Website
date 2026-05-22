/**
 * Supabase Edge Function: send-rfq-notification
 *
 * Deploy:
 *   supabase functions deploy send-rfq-notification
 *
 * Required Supabase secrets:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESEND_API_KEY
 *   RFQ_NOTIFICATION_TO=info@kcdesignmfg.com
 *   RFQ_FROM_EMAIL=K&C Design and Manufacturing <no-reply@yourdomain.com>
 *   RFQ_REPLY_TO=info@kcdesignmfg.com
 *
 * Modes:
 *   full_notification (default)
 *   customer_confirmation_only
 *   internal_notification_only
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const VALID_MODES = new Set([
  'full_notification',
  'customer_confirmation_only',
  'internal_notification_only',
]);

type NotificationMode =
  | 'full_notification'
  | 'customer_confirmation_only'
  | 'internal_notification_only';

type RfqRecord = {
  id: string;
  reference_number: string | null;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  project_type: string | null;
  material: string | null;
  quantity: string | null;
  timeline: string | null;
  notes: string | null;
  created_at: string;
  submitted_at: string | null;
  customer_confirmation_email_status: string | null;
};

type RfqFile = {
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
};

function escapeHtml(value: string | null | undefined) {
  if (!value) return '—';
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function displayValue(value: string | null | undefined) {
  return value?.trim() || '—';
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

function getReplyToEmail() {
  return Deno.env.get('RFQ_REPLY_TO') ?? Deno.env.get('RFQ_NOTIFICATION_TO') ?? 'info@kcdesignmfg.com';
}

async function sendResendEmail(payload: Record<string, unknown>, resendApiKey: string) {
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text();
    console.error('Resend API error:', resendError);
    return { ok: false as const, error: 'Email delivery failed.' };
  }

  const resendData = await resendResponse.json();
  return { ok: true as const, messageId: resendData.id as string };
}

function buildInternalEmail(rfq: RfqRecord, files: RfqFile[]) {
  const subjectName = rfq.company?.trim() || rfq.name?.trim() || 'Website Visitor';
  const subject = `New RFQ Request - ${subjectName}`;
  const referenceNumber = displayValue(rfq.reference_number);
  const confirmationStatus = displayValue(rfq.customer_confirmation_email_status);

  const fileLines = files.length
    ? files
        .map(
          (file) =>
            `<li><strong>${escapeHtml(file.file_name)}</strong><br/>Path: ${escapeHtml(file.file_path)}<br/>Type: ${escapeHtml(file.file_type)} | Size: ${file.file_size ?? 'unknown'} bytes</li>`,
        )
        .join('')
    : '<li>No files uploaded</li>';

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6;max-width:640px;">
      <h2 style="color:#111827;margin-bottom:8px;">New RFQ Submission</h2>
      <p>A new request for quote was submitted on the K&amp;C website.</p>
      <p><strong>Review this RFQ in the admin dashboard.</strong></p>
      <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr><td><strong>Reference Number</strong></td><td>${escapeHtml(referenceNumber)}</td></tr>
        <tr><td><strong>RFQ ID</strong></td><td>${escapeHtml(rfq.id)}</td></tr>
        <tr><td><strong>Submitted</strong></td><td>${escapeHtml(rfq.submitted_at ?? rfq.created_at)}</td></tr>
        <tr><td><strong>Name</strong></td><td>${escapeHtml(rfq.name)}</td></tr>
        <tr><td><strong>Company</strong></td><td>${escapeHtml(rfq.company)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(rfq.email)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(rfq.phone)}</td></tr>
        <tr><td><strong>Project Type</strong></td><td>${escapeHtml(rfq.project_type)}</td></tr>
        <tr><td><strong>Material</strong></td><td>${escapeHtml(rfq.material)}</td></tr>
        <tr><td><strong>Quantity</strong></td><td>${escapeHtml(rfq.quantity)}</td></tr>
        <tr><td><strong>Timeline</strong></td><td>${escapeHtml(rfq.timeline)}</td></tr>
        <tr><td><strong>Notes</strong></td><td>${escapeHtml(rfq.notes)}</td></tr>
        <tr><td><strong>Customer Confirmation Email</strong></td><td>${escapeHtml(confirmationStatus)}</td></tr>
      </table>
      <h3>Uploaded Files</h3>
      <ul>${fileLines}</ul>
    </div>
  `;

  const text = [
    'New RFQ Submission',
    'Review this RFQ in the admin dashboard.',
    `Reference Number: ${referenceNumber}`,
    `RFQ ID: ${rfq.id}`,
    `Submitted: ${rfq.submitted_at ?? rfq.created_at}`,
    `Name: ${rfq.name}`,
    `Company: ${displayValue(rfq.company)}`,
    `Email: ${rfq.email}`,
    `Phone: ${displayValue(rfq.phone)}`,
    `Project Type: ${displayValue(rfq.project_type)}`,
    `Material: ${displayValue(rfq.material)}`,
    `Quantity: ${displayValue(rfq.quantity)}`,
    `Timeline: ${displayValue(rfq.timeline)}`,
    `Notes: ${displayValue(rfq.notes)}`,
    `Customer Confirmation Email: ${confirmationStatus}`,
    '',
    'Uploaded Files:',
    ...files.map((file) => `- ${file.file_name} (${file.file_path})`),
  ].join('\n');

  return { subject, html, text };
}

function buildCustomerEmail(rfq: RfqRecord) {
  const referenceNumber = displayValue(rfq.reference_number);
  const subject = `RFQ Received - ${referenceNumber} - K&C Design and Manufacturing`;

  const text = [
    `Hi ${rfq.name},`,
    '',
    'Thank you for submitting your RFQ to K&C Design and Manufacturing.',
    '',
    'Your RFQ has been received and assigned the following reference number:',
    '',
    referenceNumber,
    '',
    'Project Summary:',
    `Company: ${displayValue(rfq.company)}`,
    `Project Type: ${displayValue(rfq.project_type)}`,
    `Material: ${displayValue(rfq.material)}`,
    `Quantity: ${displayValue(rfq.quantity)}`,
    `Timeline: ${displayValue(rfq.timeline)}`,
    '',
    'What happens next:',
    '1. Our team will review your RFQ and any uploaded drawings or files.',
    '2. We may contact you if additional details are needed.',
    '3. A quote or follow-up response will be provided after review.',
    '',
    'Please save your reference number for future communication.',
    '',
    'Thank you,',
    '',
    'K&C Design and Manufacturing',
    '422 S. Irmen Drive',
    'Addison, IL 60101',
    'Phone: (630) 543-3386',
    'Email: info@kcdesignmfg.com',
  ].join('\n');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6;max-width:640px;margin:0 auto;">
      <div style="border-bottom:3px solid #2563eb;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="margin:0;font-size:22px;color:#111827;">K&amp;C Design and Manufacturing</h1>
      </div>
      <p>Hi ${escapeHtml(rfq.name)},</p>
      <p>Thank you for submitting your RFQ to K&amp;C Design and Manufacturing.</p>
      <p>Your RFQ has been received and assigned the following reference number:</p>
      <div style="margin:24px 0;padding:18px 20px;border:2px solid #2563eb;border-radius:12px;background:#eff6ff;text-align:center;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Reference Number</p>
        <p style="margin:0;font-size:24px;font-weight:700;color:#111827;font-family:Consolas,Monaco,monospace;">${escapeHtml(referenceNumber)}</p>
      </div>
      <h2 style="font-size:16px;color:#111827;margin-top:28px;">Project Summary</h2>
      <table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;margin-top:8px;">
        <tr><td style="color:#64748b;width:140px;">Company</td><td>${escapeHtml(rfq.company)}</td></tr>
        <tr><td style="color:#64748b;">Project Type</td><td>${escapeHtml(rfq.project_type)}</td></tr>
        <tr><td style="color:#64748b;">Material</td><td>${escapeHtml(rfq.material)}</td></tr>
        <tr><td style="color:#64748b;">Quantity</td><td>${escapeHtml(rfq.quantity)}</td></tr>
        <tr><td style="color:#64748b;">Timeline</td><td>${escapeHtml(rfq.timeline)}</td></tr>
      </table>
      <h2 style="font-size:16px;color:#111827;margin-top:28px;">What happens next</h2>
      <ol style="padding-left:20px;">
        <li>Our team will review your RFQ and any uploaded drawings or files.</li>
        <li>We may contact you if additional details are needed.</li>
        <li>A quote or follow-up response will be provided after review.</li>
      </ol>
      <p style="margin-top:24px;font-weight:600;">Please save your reference number for future communication.</p>
      <p>Thank you,</p>
      <p style="margin-bottom:0;">
        <strong>K&amp;C Design and Manufacturing</strong><br/>
        422 S. Irmen Drive<br/>
        Addison, IL 60101<br/>
        Phone: (630) 543-3386<br/>
        Email: info@kcdesignmfg.com
      </p>
    </div>
  `;

  return { subject, html, text };
}

async function updateCustomerEmailStatus(
  supabase: ReturnType<typeof createClient>,
  rfqRequestId: string,
  status: 'sent' | 'failed',
  errorMessage: string | null,
) {
  const updatePayload =
    status === 'sent'
      ? {
          customer_confirmation_email_sent_at: new Date().toISOString(),
          customer_confirmation_email_status: 'sent',
          customer_confirmation_email_error: null,
        }
      : {
          customer_confirmation_email_status: 'failed',
          customer_confirmation_email_error: errorMessage,
        };

  const { error } = await supabase
    .from('rfq_requests')
    .update(updatePayload)
    .eq('id', rfqRequestId);

  if (error) {
    console.error('Unable to update customer confirmation email status:', error);
  }
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

  if (error) {
    console.error('Unable to add internal note:', error);
  }
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
    const mode = (body?.mode ?? 'full_notification') as NotificationMode;

    if (!rfqRequestId || typeof rfqRequestId !== 'string' || !UUID_PATTERN.test(rfqRequestId)) {
      return new Response(JSON.stringify({ error: 'Invalid RFQ request ID.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!VALID_MODES.has(mode)) {
      return new Response(JSON.stringify({ error: 'Invalid notification mode.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = getRequiredEnv('RESEND_API_KEY');
    const notificationTo = Deno.env.get('RFQ_NOTIFICATION_TO') ?? 'info@kcdesignmfg.com';
    const fromEmail = getFromEmail();
    const replyToEmail = getReplyToEmail();

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

    const rfqRecord = rfq as RfqRecord;
    const fileList = (files ?? []) as RfqFile[];

    let internalNotificationSent = false;
    let customerConfirmationSent = false;
    let customerConfirmationStatus: 'not_sent' | 'sent' | 'failed' = 'not_sent';
    let customerConfirmationError: string | null = null;

    const sendInternal = mode === 'full_notification' || mode === 'internal_notification_only';
    const sendCustomer = mode === 'full_notification' || mode === 'customer_confirmation_only';

    if (sendInternal) {
      const internalEmail = buildInternalEmail(rfqRecord, fileList);
      const internalResult = await sendResendEmail(
        {
          from: fromEmail,
          to: [notificationTo],
          subject: internalEmail.subject,
          html: internalEmail.html,
          text: internalEmail.text,
          reply_to: rfqRecord.email,
        },
        resendApiKey,
      );

      if (!internalResult.ok) {
        return new Response(
          JSON.stringify({
            error: 'Failed to send internal notification email.',
            internal_notification_sent: false,
            customer_confirmation_sent: false,
            customer_confirmation_status: 'not_sent',
          }),
          {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }

      internalNotificationSent = true;
    }

    if (sendCustomer) {
      const customerEmail = buildCustomerEmail(rfqRecord);
      const customerResult = await sendResendEmail(
        {
          from: fromEmail,
          to: [rfqRecord.email],
          subject: customerEmail.subject,
          html: customerEmail.html,
          text: customerEmail.text,
          reply_to: replyToEmail,
        },
        resendApiKey,
      );

      if (customerResult.ok) {
        customerConfirmationSent = true;
        customerConfirmationStatus = 'sent';
        await updateCustomerEmailStatus(supabase, rfqRequestId, 'sent', null);

        if (mode === 'customer_confirmation_only') {
          await addInternalNote(supabase, rfqRequestId, 'Customer confirmation email resent.');
        }
      } else {
        customerConfirmationStatus = 'failed';
        customerConfirmationError = customerResult.error;
        await updateCustomerEmailStatus(supabase, rfqRequestId, 'failed', customerResult.error);
      }
    }

    if (mode === 'full_notification' && !sendCustomer) {
      customerConfirmationStatus = 'not_sent';
    }

    const responseBody = {
      success: true,
      internal_notification_sent: internalNotificationSent,
      customer_confirmation_sent: customerConfirmationSent,
      customer_confirmation_status: customerConfirmationStatus,
      ...(customerConfirmationError ? { customer_confirmation_error: customerConfirmationError } : {}),
    };

    return new Response(JSON.stringify(responseBody), {
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
