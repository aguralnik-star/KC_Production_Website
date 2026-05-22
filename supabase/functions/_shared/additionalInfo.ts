/**
 * Shared helpers for additional info edge functions
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('PUBLIC_SITE_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const ALLOWED_EXTENSIONS = new Set([
  'pdf', 'png', 'jpg', 'jpeg', 'dwg', 'dxf', 'step', 'stp', 'x_t', 'sldprt', 'sldasm', 'zip',
]);

export const MAX_FILES = 5;
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
export const MAX_NOTES_LENGTH = 5000;
export const RFQ_BUCKET = 'rfq-files';
export const SIGNED_UPLOAD_TTL = 600;

export function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function escapeHtml(value: string | null | undefined) {
  if (!value) return '';
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function sanitizeFileName(fileName: string) {
  const base = fileName.split(/[/\\]/).pop() ?? 'file';
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180) || 'file';
}

export function getFileExtension(fileName: string) {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() ?? '' : '';
}

export function getClientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? null;
}

export function isTokenFormatValid(token: string) {
  return typeof token === 'string' && token.length >= 32 && token.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(token);
}

export function getFromEmail() {
  return (
    Deno.env.get('RFQ_FROM_EMAIL') ??
    Deno.env.get('RFQ_NOTIFICATION_FROM') ??
    'K&C Design and Manufacturing <onboarding@resend.dev>'
  );
}

export const INVALID_TOKEN_MESSAGE =
  'This additional information request link is invalid, expired, or has already been used.';
