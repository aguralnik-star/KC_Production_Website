import { supabase, RFQ_BUCKET, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  ALLOWED_EXTENSIONS,
  MAX_FILES,
  MAX_FILE_SIZE_BYTES,
  sanitizeFileName,
  getFileExtension,
} from '../utils/rfqFileUtils';
import { validateRFQInput } from '../utils/rfqValidation';

export { MAX_FILES, MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS, sanitizeFileName, getFileExtension };

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
    for (const fileRow of uploaded) {
      const { error: insertError } = await supabase.rpc('submit_public_rfq_file', {
        p_rfq_request_id: fileRow.rfq_request_id,
        p_file_name: fileRow.file_name,
        p_file_path: fileRow.file_path,
        p_file_type: fileRow.file_type,
        p_file_size: fileRow.file_size,
      });

      if (insertError) {
        throw new Error('Files uploaded but could not be linked to your request. Please contact us directly.');
      }
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
  if (validationErrors.messages.length > 0) {
    throw new Error(validationErrors.messages[0]);
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

  const { data: rfqRows, error: insertError } = await supabase.rpc('submit_public_rfq', {
    p_name: payload.name,
    p_company: payload.company,
    p_email: payload.email,
    p_phone: payload.phone,
    p_project_type: payload.project_type,
    p_material: payload.material,
    p_quantity: payload.quantity,
    p_timeline: payload.timeline,
    p_notes: payload.notes,
  });

  const rfqRecord = Array.isArray(rfqRows) ? rfqRows[0] : rfqRows;

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

