import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStatusLookupInput(referenceNumber, email) {
  const errors = [];

  if (!referenceNumber?.trim()) {
    errors.push('Reference number is required.');
  } else if (referenceNumber.trim().length < 8) {
    errors.push('Please enter a valid reference number.');
  }

  if (!email?.trim()) {
    errors.push('Email is required.');
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  return errors;
}

export async function lookupRFQStatus(referenceNumber, email) {
  if (!isSupabaseConfigured) {
    throw new Error('Status lookup is not available right now. Please contact K&C directly.');
  }

  const validationErrors = validateStatusLookupInput(referenceNumber, email);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors[0]);
  }

  const { data, error } = await supabase.functions.invoke('public-rfq-status-lookup', {
    body: {
      reference_number: referenceNumber.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
    },
  });

  if (error) {
    throw new Error('Unable to check RFQ status right now. Please try again or contact K&C.');
  }

  if (data?.error) {
    throw new Error('Unable to check RFQ status right now. Please try again or contact K&C.');
  }

  return data;
}
