import { supabase, RFQ_BUCKET, isSupabaseConfigured } from '../lib/supabaseClient';

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'dwg',
  'dxf',
  'step',
  'stp',
  'x_t',
  'sldprt',
  'sldasm',
  'zip',
]);

export function sanitizeFileName(fileName) {
  const base = fileName.split(/[/\\]/).pop() ?? 'file';
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180) || 'file';
}

export function getFileExtension(fileName) {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

export function validateRFQInput(formData, files = []) {
  const errors = [];

  if (!formData.name?.trim()) {
    errors.push('Name is required.');
  }

  if (!formData.email?.trim()) {
    errors.push('Email is required.');
  } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  if (files.length > MAX_FILES) {
    errors.push(`You can upload up to ${MAX_FILES} files.`);
  }

  for (const file of files) {
    const extension = getFileExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      errors.push(`"${file.name}" is not an allowed file type.`);
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(`"${file.name}" exceeds the 20 MB limit.`);
    }
  }

  return errors;
}

export async function uploadRFQFiles(rfqRequestId, files) {
  if (!files.length) return [];

  const uploaded = [];

  for (const file of files) {
    const safeName = sanitizeFileName(file.name);
    const filePath = `rfq/${rfqRequestId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(RFQ_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined,
      });

    if (uploadError) {
      throw new Error(`Failed to upload "${file.name}". Please try again.`);
    }

    uploaded.push({
      rfq_request_id: rfqRequestId,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type || null,
      file_size: file.size,
    });
  }

  if (uploaded.length > 0) {
    const { error: insertError } = await supabase.from('rfq_files').insert(uploaded);
    if (insertError) {
      throw new Error('Files uploaded but could not be linked to your request. Please contact us directly.');
    }
  }

  return uploaded;
}

export async function notifyRFQSubmission(rfqRequestId, mode = 'full_notification') {
  const { data, error } = await supabase.functions.invoke('send-rfq-notification', {
    body: { rfq_request_id: rfqRequestId, mode },
  });

  if (error) {
    return {
      internal_notification_sent: false,
      customer_confirmation_sent: false,
      customer_confirmation_status: 'failed',
    };
  }

  if (data?.error) {
    return {
      internal_notification_sent: false,
      customer_confirmation_sent: false,
      customer_confirmation_status: data.customer_confirmation_status ?? 'failed',
      ...data,
    };
  }

  return {
    internal_notification_sent: Boolean(data?.internal_notification_sent),
    customer_confirmation_sent: Boolean(data?.customer_confirmation_sent),
    customer_confirmation_status: data?.customer_confirmation_status ?? 'not_sent',
    ...data,
  };
}

export async function submitRFQ(formData, files = []) {
  if (!isSupabaseConfigured) {
    throw new Error('RFQ submission is not configured yet. Please call (630) 543-3386 or email info@kcdesignmfg.com.');
  }

  const validationErrors = validateRFQInput(formData, files);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors[0]);
  }

  const payload = {
    name: formData.name.trim(),
    company: formData.company?.trim() || null,
    email: formData.email.trim(),
    phone: formData.phone?.trim() || null,
    project_type: formData.projectType?.trim() || null,
    material: formData.material?.trim() || null,
    quantity: formData.quantity?.trim() || null,
    timeline: formData.timeline?.trim() || null,
    notes: formData.notes?.trim() || null,
    status: 'new',
  };

  const { data: rfqRecord, error: insertError } = await supabase
    .from('rfq_requests')
    .insert(payload)
    .select('id, reference_number, submitted_at')
    .single();

  if (insertError || !rfqRecord?.id) {
    throw new Error('Unable to submit your RFQ right now. Please try again or contact us directly.');
  }

  const rfqRequestId = rfqRecord.id;
  let notification = {
    internal_notification_sent: false,
    customer_confirmation_sent: false,
    customer_confirmation_status: 'not_sent',
  };

  try {
    await uploadRFQFiles(rfqRequestId, files);
    notification = await notifyRFQSubmission(rfqRequestId);
  } catch (err) {
    throw err instanceof Error ? err : new Error('RFQ submission failed. Please try again.');
  }

  return {
    id: rfqRequestId,
    reference_number: rfqRecord.reference_number,
    submitted_at: rfqRecord.submitted_at,
    email: formData.email.trim(),
    notification,
  };
}

export { MAX_FILES, MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS };
