import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import {
  INVALID_TOKEN_MESSAGE,
  RFQ_BUCKET,
  corsHeaders,
  escapeHtml,
  getFromEmail,
  getRequiredEnv,
  isTokenFormatValid,
  jsonResponse,
} from '../_shared/additionalInfo.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed.' }, 405);
    }

    const body = await req.json();
    const requestToken = String(body?.request_token ?? '').trim();
    const submissionId = String(body?.submission_id ?? '').trim();
    const uploadedFiles = Array.isArray(body?.uploaded_files) ? body.uploaded_files : [];

    if (!isTokenFormatValid(requestToken) || !submissionId) {
      return jsonResponse({ error: INVALID_TOKEN_MESSAGE }, 400);
    }

    const supabase = createClient(
      getRequiredEnv('SUPABASE_URL'),
      getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data: request, error } = await supabase
      .from('rfq_additional_info_requests')
      .select(`
        id,
        rfq_request_id,
        status,
        expires_at,
        rfq_requests (
          reference_number,
          name,
          email
        )
      `)
      .eq('request_token', requestToken)
      .maybeSingle();

    if (error || !request) {
      return jsonResponse({ error: INVALID_TOKEN_MESSAGE }, 400);
    }

    if (['canceled', 'submitted', 'expired'].includes(request.status) || new Date(request.expires_at) <= new Date()) {
      return jsonResponse({ error: INVALID_TOKEN_MESSAGE }, 400);
    }

    const { data: submission, error: submissionError } = await supabase
      .from('rfq_customer_info_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('additional_info_request_id', request.id)
      .maybeSingle();

    if (submissionError || !submission) {
      return jsonResponse({ error: 'Submission session not found.' }, 400);
    }

    const fileRecords = [];
    for (const file of uploadedFiles) {
      const filePath = String(file?.file_path ?? '');
      if (!filePath.startsWith(`rfq/${request.rfq_request_id}/customer-reuploads/${request.id}/`)) {
        return jsonResponse({ error: 'Invalid uploaded file reference.' }, 400);
      }

      fileRecords.push({
        rfq_request_id: request.rfq_request_id,
        additional_info_request_id: request.id,
        customer_info_submission_id: submission.id,
        file_name: String(file?.file_name ?? 'file'),
        file_path: filePath,
        file_type: file?.file_type ? String(file.file_type) : null,
        file_size: file?.file_size ? Number(file.file_size) : null,
        uploaded_by_email: submission.customer_email,
      });
    }

    if (fileRecords.length > 0) {
      const { error: filesError } = await supabase.from('rfq_customer_uploaded_files').insert(fileRecords);
      if (filesError) {
        return jsonResponse({ error: 'Unable to save uploaded files.' }, 500);
      }
    }

    const completedAt = new Date().toISOString();

    await supabase
      .from('rfq_additional_info_requests')
      .update({ status: 'submitted', completed_at: completedAt })
      .eq('id', request.id);

    await supabase
      .from('rfq_requests')
      .update({
        status: 'in_review',
        public_status: 'under_review',
        additional_info_received_at: completedAt,
        has_customer_reupload: fileRecords.length > 0 || Boolean(submission.notes),
      })
      .eq('id', request.rfq_request_id);

    await supabase.from('rfq_internal_notes').insert({
      rfq_request_id: request.rfq_request_id,
      note: 'Customer submitted additional information.',
    });

    const rfq = request.rfq_requests as Record<string, string | null>;
    const referenceNumber = rfq?.reference_number ?? 'RFQ';
    const notificationTo = Deno.env.get('RFQ_NOTIFICATION_TO') ?? 'info@kcdesignmfg.com';
    const resendApiKey = getRequiredEnv('RESEND_API_KEY');
    const fileNames = fileRecords.map((file) => file.file_name).join(', ') || 'None';

    const internalSubject = `Additional Information Received - ${referenceNumber}`;
    const internalText = [
      'Additional information was submitted by a customer.',
      'Review this RFQ in the admin dashboard.',
      `Reference Number: ${referenceNumber}`,
      `Customer: ${submission.customer_name ?? rfq?.name ?? 'Unknown'}`,
      `Email: ${submission.customer_email ?? rfq?.email ?? 'Unknown'}`,
      `Notes: ${submission.notes ?? 'None'}`,
      `Uploaded Files: ${fileNames}`,
    ].join('\n');

    const internalHtml = `
      <h2>Additional Information Received</h2>
      <p><strong>Review this RFQ in the admin dashboard.</strong></p>
      <p><strong>Reference Number:</strong> ${escapeHtml(referenceNumber)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(submission.customer_name ?? rfq?.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(submission.customer_email ?? rfq?.email)}</p>
      <p><strong>Notes:</strong> ${escapeHtml(submission.notes)}</p>
      <p><strong>Uploaded Files:</strong> ${escapeHtml(fileNames)}</p>
    `;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getFromEmail(),
        to: [notificationTo],
        subject: internalSubject,
        html: internalHtml,
        text: internalText,
        reply_to: submission.customer_email ?? rfq?.email ?? undefined,
      }),
    });

    return jsonResponse({
      success: true,
      message: 'Thank you. Your additional information has been submitted to K&C Design and Manufacturing.',
    });
  } catch (err) {
    console.error('finalize-additional-info-submission error:', err);
    return jsonResponse({ error: 'Unable to complete submission.' }, 500);
  }
});
