const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const BRIDGE_FIELD_KEYS = [
  'companyName',
  'contactName',
  'email',
  'phone',
  'projectType',
  'material',
  'quantity',
  'deadline',
  'message',
  'sourcePage',
];

const REQUIRED_FIELD_KEYS = ['contactName', 'email'];

const FIELD_LABELS = {
  companyName: 'Company name',
  contactName: 'Contact name',
  email: 'Email',
  phone: 'Phone',
  projectType: 'Project type',
  material: 'Material',
  quantity: 'Quantity',
  deadline: 'Deadline',
  message: 'Message',
  sourcePage: 'Source page',
};

function trimString(value) {
  if (value == null) return '';
  return typeof value === 'string' ? value.trim() : String(value).trim();
}

export function validateRFQBridgeInput(body) {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      ok: false,
      errors: ['Request body must be a JSON object.'],
      fieldErrors: {},
    };
  }

  const fieldErrors = {};

  for (const key of REQUIRED_FIELD_KEYS) {
    const value = trimString(body[key]);
    if (!value) {
      fieldErrors[key] = `${FIELD_LABELS[key]} is required.`;
    }
  }

  const email = trimString(body.email);
  if (email && !EMAIL_PATTERN.test(email)) {
    fieldErrors.email = 'Email must be a valid email address.';
  }

  for (const [key, message] of Object.entries(fieldErrors)) {
    errors.push(message);
  }

  return {
    ok: errors.length === 0,
    errors,
    fieldErrors,
  };
}

export function normalizeRFQBridgePayload(body, metadata = {}) {
  const normalized = {};

  for (const key of BRIDGE_FIELD_KEYS) {
    normalized[key] = trimString(body[key]);
  }

  return {
    source: 'kc-website',
    intakeType: 'rfq',
    companyName: normalized.companyName,
    contactName: normalized.contactName,
    email: normalized.email,
    phone: normalized.phone,
    projectType: normalized.projectType,
    material: normalized.material,
    quantity: normalized.quantity,
    deadline: normalized.deadline,
    message: normalized.message,
    sourcePage: normalized.sourcePage,
    submittedAt: new Date().toISOString(),
    metadata: {
      userAgent: metadata.userAgent || null,
      ipAddress: metadata.ipAddress || null,
      website: 'K&C Design & Manufacturing',
    },
  };
}

export function getClientIpAddress(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]).split(',')[0].trim();
  }

  return req.socket?.remoteAddress || null;
}

export async function forwardRFQToFactoraOS(payload, { url, secret }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let responseBody = null;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      responseBody = await response.json();
    } catch {
      responseBody = null;
    }
  } else {
    try {
      const text = await response.text();
      responseBody = text ? { message: text.slice(0, 500) } : null;
    } catch {
      responseBody = null;
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    body: responseBody,
  };
}

export const USER_FACING_FORWARD_ERROR =
  'We could not forward your RFQ right now. Please try again or contact us directly at info@kcdesignmfg.com.';

export const USER_FACING_CONFIG_ERROR =
  'RFQ forwarding is not configured yet. Please call (630) 543-3386 or email info@kcdesignmfg.com.';
