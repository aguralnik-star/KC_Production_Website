import {
  forwardRFQToFactoraOS,
  getClientIpAddress,
  normalizeRFQBridgePayload,
  USER_FACING_CONFIG_ERROR,
  USER_FACING_FORWARD_ERROR,
  validateRFQBridgeInput,
} from './_lib/rfqBridgeUtils.js';

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString('utf8');

  if (!raw.trim()) {
    return {};
  }

  return JSON.parse(raw);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, {
      ok: false,
      message: 'Method not allowed. Use POST.',
    });
  }

  const intakeUrl = process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_URL;
  const intakeSecret = process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET;

  if (!intakeUrl || !intakeSecret) {
    console.error('[rfq-bridge] Missing FactoraOS intake configuration.');
    return sendJson(res, 503, {
      ok: false,
      message: USER_FACING_CONFIG_ERROR,
    });
  }

  let body;

  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, {
      ok: false,
      message: 'Invalid JSON request body.',
    });
  }

  const validation = validateRFQBridgeInput(body);
  if (!validation.ok) {
    return sendJson(res, 400, {
      ok: false,
      message: validation.errors[0] || 'Please check the required RFQ fields.',
      fieldErrors: validation.fieldErrors,
    });
  }

  const payload = normalizeRFQBridgePayload(body, {
    userAgent: req.headers['user-agent'] || null,
    ipAddress: getClientIpAddress(req),
  });

  try {
    const upstream = await forwardRFQToFactoraOS(payload, {
      url: intakeUrl,
      secret: intakeSecret,
    });

    if (!upstream.ok) {
      console.error('[rfq-bridge] FactoraOS intake rejected request.', {
        status: upstream.status,
      });

      return sendJson(res, 502, {
        ok: false,
        message: USER_FACING_FORWARD_ERROR,
      });
    }

    return sendJson(res, 200, {
      ok: true,
      success: true,
      message: 'RFQ forwarded successfully.',
      submittedAt: payload.submittedAt,
    });
  } catch (error) {
    console.error('[rfq-bridge] Forward failed.', error instanceof Error ? error.message : error);

    return sendJson(res, 502, {
      ok: false,
      message: USER_FACING_FORWARD_ERROR,
    });
  }
}
