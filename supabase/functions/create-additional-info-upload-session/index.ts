import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import {
  ALLOWED_EXTENSIONS,
  INVALID_TOKEN_MESSAGE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES,
  MAX_NOTES_LENGTH,
  RFQ_BUCKET,
  SIGNED_UPLOAD_TTL,
  corsHeaders,
  getClientIp,
  getFileExtension,
  getRequiredEnv,
  isTokenFormatValid,
  jsonResponse,
  sanitizeFileName,
} from '../_shared/additionalInfo.ts';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const customerName = String(body?.customer_name ?? '').trim();
    const customerEmail = String(body?.customer_email ?? '').trim().toLowerCase();
    const notes = String(body?.notes ?? '').trim();
    const files = Array.isArray(body?.files) ? body.files : [];

    if (!isTokenFormatValid(requestToken)) {
      return jsonResponse({ error: INVALID_TOKEN_MESSAGE }, 400);
    }

    if (!customerName || !customerEmail || !EMAIL_PATTERN.test(customerEmail)) {
      return jsonResponse({ error: 'Please provide a valid name and email address.' }, 400);
    }

    if (notes.length > MAX_NOTES_LENGTH) {
      return jsonResponse({ error: 'Notes must be 5000 characters or fewer.' }, 400);
    }

    if (files.length > MAX_FILES) {
      return jsonResponse({ error: `You can upload up to ${MAX_FILES} files.` }, 400);
    }

    const supabase = createClient(
      getRequiredEnv('SUPABASE_URL'),
      getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data: request, error } = await supabase
      .from('rfq_additional_info_requests')
      .select('id, rfq_request_id, status, expires_at, customer_email, rfq_requests(email)')
      .eq('request_token', requestToken)
      .maybeSingle();

    if (error || !request) {
      return jsonResponse({ error: INVALID_TOKEN_MESSAGE }, 400);
    }

    const rfqEmail = ((request.rfq_requests as { email?: string })?.email ?? request.customer_email ?? '').toLowerCase();

    if (customerEmail !== rfqEmail) {
      return jsonResponse({ error: 'The email address does not match this RFQ request.' }, 400);
    }

    const expiresAt = new Date(request.expires_at);
    if (['canceled', 'submitted', 'expired'].includes(request.status) || expiresAt <= new Date()) {
      return jsonResponse({ error: INVALID_TOKEN_MESSAGE }, 400);
    }

    const uploadTargets = [];
    for (const file of files) {
      const fileName = String(file?.file_name ?? '').trim();
      const fileSize = Number(file?.file_size ?? 0);
      const fileType = file?.file_type ? String(file.file_type) : null;
      const extension = getFileExtension(fileName);

      if (!fileName) {
        return jsonResponse({ error: 'Each uploaded file must have a name.' }, 400);
      }
      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return jsonResponse({ error: `"${fileName}" is not an allowed file type.` }, 400);
      }
      if (fileSize <= 0 || fileSize > MAX_FILE_SIZE_BYTES) {
        return jsonResponse({ error: `"${fileName}" exceeds the 20 MB limit.` }, 400);
      }

      const safeName = sanitizeFileName(fileName);
      const filePath = `rfq/${request.rfq_request_id}/customer-reuploads/${request.id}/${Date.now()}-${safeName}`;
      uploadTargets.push({ file_name: fileName, file_path: filePath, file_type: fileType, file_size: fileSize });
    }

    const { data: submission, error: submissionError } = await supabase
      .from('rfq_customer_info_submissions')
      .insert({
        rfq_request_id: request.rfq_request_id,
        additional_info_request_id: request.id,
        customer_name: customerName,
        customer_email: customerEmail,
        notes: notes || null,
        submitted_from_ip: getClientIp(req),
        user_agent: req.headers.get('user-agent'),
      })
      .select('id')
      .single();

    if (submissionError || !submission) {
      return jsonResponse({ error: 'Unable to start upload session.' }, 500);
    }

    const signedUploads = [];
    for (const target of uploadTargets) {
      const { data: signed, error: signedError } = await supabase.storage
        .from(RFQ_BUCKET)
        .createSignedUploadUrl(target.file_path, SIGNED_UPLOAD_TTL);

      if (signedError || !signed?.signedUrl) {
        return jsonResponse({ error: 'Unable to prepare file uploads.' }, 500);
      }

      signedUploads.push({
        file_name: target.file_name,
        file_path: target.file_path,
        file_type: target.file_type,
        file_size: target.file_size,
        signed_url: signed.signedUrl,
        token: signed.token,
      });
    }

    return jsonResponse({
      submission_id: submission.id,
      uploads: signedUploads,
    });
  } catch (err) {
    console.error('create-additional-info-upload-session error:', err);
    return jsonResponse({ error: 'Unable to start upload session.' }, 500);
  }
});
