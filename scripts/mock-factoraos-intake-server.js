import http from 'node:http';

const intakeQueue = [];
const auditLog = [];
const companies = new Map();
const contacts = new Map();
const leads = new Map();
const opportunities = new Map();

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function findDuplicateCompany(name) {
  const key = normalizeKey(name);
  return companies.get(key) || null;
}

function findDuplicateContact(email) {
  const key = normalizeKey(email);
  return contacts.get(key) || null;
}

function createAuditEntry(action, details) {
  auditLog.push({
    id: `audit-${auditLog.length + 1}`,
    action,
    details,
    createdAt: new Date().toISOString(),
  });
}

function handleIntake(payload, authHeader) {
  if (!authHeader?.startsWith('Bearer ')) {
    return { status: 401, body: { ok: false, error: 'Missing or invalid Authorization header.' } };
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return { status: 401, body: { ok: false, error: 'Bearer token required.' } };
  }

  const required = ['source', 'intakeType', 'contactName', 'email'];
  for (const field of required) {
    if (!payload?.[field]) {
      return { status: 400, body: { ok: false, error: `Missing required field: ${field}` } };
    }
  }

  const duplicateCompany = payload.companyName ? findDuplicateCompany(payload.companyName) : null;
  const duplicateContact = findDuplicateContact(payload.email);
  const duplicateDetected = Boolean(duplicateCompany || duplicateContact);

  let companyRecord = duplicateCompany;
  let contactRecord = duplicateContact;
  let leadRecord = null;
  let opportunityRecord = null;

  if (!companyRecord && payload.companyName) {
    companyRecord = {
      id: `company-${companies.size + 1}`,
      name: payload.companyName,
      matched: false,
    };
    companies.set(normalizeKey(payload.companyName), companyRecord);
    createAuditEntry('company_created', { companyId: companyRecord.id, name: companyRecord.name });
  } else if (companyRecord) {
    createAuditEntry('company_matched', { companyId: companyRecord.id, name: companyRecord.name });
  }

  if (!contactRecord) {
    contactRecord = {
      id: `contact-${contacts.size + 1}`,
      email: payload.email,
      name: payload.contactName,
      matched: false,
    };
    contacts.set(normalizeKey(payload.email), contactRecord);
    createAuditEntry('contact_created', { contactId: contactRecord.id, email: contactRecord.email });
  } else {
    createAuditEntry('contact_matched', { contactId: contactRecord.id, email: contactRecord.email });
  }

  if (!duplicateDetected) {
    leadRecord = {
      id: `lead-${leads.size + 1}`,
      source: payload.source,
      email: payload.email,
      companyName: payload.companyName || null,
    };
    leads.set(leadRecord.id, leadRecord);
    createAuditEntry('lead_created', { leadId: leadRecord.id });

    opportunityRecord = {
      id: `opportunity-${opportunities.size + 1}`,
      name: `${payload.companyName || payload.contactName} RFQ`,
      projectType: payload.projectType || null,
      status: 'open',
    };
    opportunities.set(opportunityRecord.id, opportunityRecord);
    createAuditEntry('opportunity_created', { opportunityId: opportunityRecord.id });
  } else {
    createAuditEntry('duplicate_detected', {
      duplicateCompany: Boolean(duplicateCompany),
      duplicateContact: Boolean(duplicateContact),
    });
  }

  const queueRecord = {
    id: `intake-${intakeQueue.length + 1}`,
    source: payload.source,
    intakeType: payload.intakeType,
    status: 'pending_review',
    payload,
    duplicateDetected,
    companyId: companyRecord?.id || null,
    contactId: contactRecord?.id || null,
    leadId: leadRecord?.id || null,
    opportunityId: opportunityRecord?.id || null,
    receivedAt: new Date().toISOString(),
  };

  intakeQueue.push(queueRecord);
  createAuditEntry('intake_received', { intakeId: queueRecord.id, duplicateDetected });

  return {
    status: 200,
    body: {
      ok: true,
      success: true,
      intakeId: queueRecord.id,
      duplicateDetected,
      status: queueRecord.status,
    },
  };
}

export function getMockFactoraOSState() {
  return {
    intakeQueue: [...intakeQueue],
    auditLog: [...auditLog],
    companies: [...companies.values()],
    contacts: [...contacts.values()],
    leads: [...leads.values()],
    opportunities: [...opportunities.values()],
  };
}

export function resetMockFactoraOSState() {
  intakeQueue.length = 0;
  auditLog.length = 0;
  companies.clear();
  contacts.clear();
  leads.clear();
  opportunities.clear();
}

export function startMockFactoraOSIntakeServer(port = 3099, expectedSecret = 'test-intake-secret') {
  resetMockFactoraOSState();

  const capturedRequests = [];

  const server = http.createServer((req, res) => {
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const rawBody = Buffer.concat(chunks).toString('utf8');
      let payload = {};

      try {
        payload = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON.' }));
        return;
      }

      const authHeader = req.headers.authorization || req.headers.Authorization;
      capturedRequests.push({
        headers: {
          authorization: authHeader || null,
          contentType: req.headers['content-type'] || null,
        },
        payload,
        receivedAt: new Date().toISOString(),
      });

      if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: 'Invalid bearer token.' }));
        return;
      }

      const result = handleIntake(payload, authHeader);
      res.statusCode = result.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result.body));
    });
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => {
      resolve({
        port,
        url: `http://127.0.0.1:${port}/external-crm-intake`,
        expectedSecret,
        getCapturedRequests: () => [...capturedRequests],
        getState: getMockFactoraOSState,
        reset: resetMockFactoraOSState,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => (error ? closeReject(error) : closeResolve()));
          }),
      });
    });
  });
}
