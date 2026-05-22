import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import {
  INVALID_TOKEN_MESSAGE,
  corsHeaders,
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
      return jsonResponse({ valid: false, message: INVALID_TOKEN_MESSAGE }, 405);
    }

    const body = await req.json();
    const requestToken = String(body?.request_token ?? '').trim();

    if (!isTokenFormatValid(requestToken)) {
      return jsonResponse({ valid: false, message: INVALID_TOKEN_MESSAGE });
    }

    const supabase = createClient(
      getRequiredEnv('SUPABASE_URL'),
      getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data: request, error } = await supabase
      .from('rfq_additional_info_requests')
      .select(`
        id,
        request_token,
        request_type,
        status,
        message,
        requested_items,
        expires_at,
        customer_email,
        rfq_requests (
          reference_number,
          name,
          email,
          project_type,
          material,
          quantity,
          timeline
        )
      `)
      .eq('request_token', requestToken)
      .maybeSingle();

    if (error || !request) {
      return jsonResponse({ valid: false, message: INVALID_TOKEN_MESSAGE });
    }

    const now = new Date();
    const expiresAt = new Date(request.expires_at);

    if (['canceled', 'submitted', 'expired'].includes(request.status) || expiresAt <= now) {
      if (request.status !== 'expired' && request.status !== 'submitted' && expiresAt <= now) {
        await supabase
          .from('rfq_additional_info_requests')
          .update({ status: 'expired' })
          .eq('id', request.id);
      }
      return jsonResponse({ valid: false, message: INVALID_TOKEN_MESSAGE });
    }

    if (request.status === 'sent') {
      await supabase
        .from('rfq_additional_info_requests')
        .update({ status: 'viewed' })
        .eq('id', request.id);
    }

    const rfq = request.rfq_requests as Record<string, string | null>;

    return jsonResponse({
      valid: true,
      request_token: request.request_token,
      reference_number: rfq?.reference_number,
      customer_name: rfq?.name,
      customer_email: rfq?.email,
      request_type: request.request_type,
      message: request.message,
      requested_items: request.requested_items,
      expires_at: request.expires_at,
      project_type: rfq?.project_type,
      material: rfq?.material,
      quantity: rfq?.quantity,
      timeline: rfq?.timeline,
    });
  } catch (err) {
    console.error('validate-additional-info-token error:', err);
    return jsonResponse({ valid: false, message: INVALID_TOKEN_MESSAGE }, 500);
  }
});
