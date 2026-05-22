import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  ALLOWED_EXTENSIONS,
  MAX_FILES,
  MAX_FILE_SIZE_BYTES,
  getFileExtension,
} from './rfqService';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NOTES_LENGTH = 5000;

export function validateAdditionalInfoSubmission(formData, files = [], expectedEmail = '') {
  const errors = [];

  if (!formData.name?.trim()) errors.push('Name is required.');
  if (!formData.email?.trim()) {
    errors.push('Email is required.');
  } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
    errors.push('Please enter a valid email address.');
  } else if (expectedEmail && formData.email.trim().toLowerCase() !== expectedEmail.toLowerCase()) {
    errors.push('The email address must match the email used for your original RFQ submission.');
  }

  if (formData.notes?.length > MAX_NOTES_LENGTH) {
    errors.push('Notes must be 5000 characters or fewer.');
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

export async function validateAdditionalInfoToken(requestToken) {
  if (!isSupabaseConfigured) {
    throw new Error('This upload link is unavailable right now.');
  }

  const { data, error } = await supabase.functions.invoke('validate-additional-info-token', {
    body: { request_token: requestToken },
  });

  if (error) {
    throw new Error('Unable to validate this upload link.');
  }

  return data;
}

export async function submitAdditionalInfo(requestToken, formData, files = [], onProgress) {
  if (!isSupabaseConfigured) {
    throw new Error('This upload link is unavailable right now.');
  }

  const validationErrors = validateAdditionalInfoSubmission(formData, files, formData.expectedEmail);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors[0]);
  }

  onProgress?.('Preparing upload…');

  const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
    'create-additional-info-upload-session',
    {
      body: {
        request_token: requestToken,
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim().toLowerCase(),
        notes: formData.notes?.trim() || '',
        files: files.map((file) => ({
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || null,
        })),
      },
    },
  );

  if (sessionError || sessionData?.error) {
    throw new Error(sessionData?.error || 'Unable to start upload session.');
  }

  const uploadedFiles = [];

  for (let index = 0; index < (sessionData.uploads ?? []).length; index += 1) {
    const upload = sessionData.uploads[index];
    const file = files[index];
    onProgress?.(`Uploading ${file.name}…`);

    const response = await fetch(upload.signed_url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        ...(upload.token ? { 'x-upsert': 'false' } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to upload "${file.name}". Please try again.`);
    }

    uploadedFiles.push({
      file_name: upload.file_name,
      file_path: upload.file_path,
      file_type: upload.file_type,
      file_size: upload.file_size,
    });
  }

  onProgress?.('Finalizing submission…');

  const { data: finalizeData, error: finalizeError } = await supabase.functions.invoke(
    'finalize-additional-info-submission',
    {
      body: {
        request_token: requestToken,
        submission_id: sessionData.submission_id,
        uploaded_files: uploadedFiles,
      },
    },
  );

  if (finalizeError || finalizeData?.error) {
    throw new Error(finalizeData?.error || 'Unable to complete submission.');
  }

  return finalizeData;
}

export { MAX_FILES, MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS };
