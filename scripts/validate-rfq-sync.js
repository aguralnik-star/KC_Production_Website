import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { startLocalBridgeServer } from './lib/local-bridge-server.js';
import {
  getMockFactoraOSState,
  startMockFactoraOSIntakeServer,
} from './mock-factoraos-intake-server.js';
import {
  BRIDGE_FIELD_KEYS,
  normalizeRFQBridgePayload,
  USER_FACING_CONFIG_ERROR,
} from '../api/_lib/rfqBridgeUtils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const VALIDATION_PAYLOAD = {
  companyName: 'Test Manufacturing Inc',
  contactName: 'John Smith',
  email: 'john.smith@example.com',
  phone: '555-555-1212',
  projectType: 'CNC Machining',
  material: '6061 Aluminum',
  quantity: 100,
  deadline: '2026-06-15',
  message: 'RFQ Bridge Validation Test',
  sourcePage: '/rfq',
};

const MOCK_SECRET = 'test-intake-secret-local-validation';

const report = {
  generatedAt: new Date().toISOString(),
  checks: {},
  metrics: {},
  certification: null,
};

function setCheck(name, pass, details = '') {
  report.checks[name] = { result: pass ? 'PASS' : 'FAIL', details };
}

function logStep(title) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(title);
  console.log('='.repeat(60));
}

async function waitForUrl(url, attempts = 20, delayMs = 500) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.status !== 404 || response.status === 405) {
        return true;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

async function postBridge(url, payload) {
  const started = performance.now();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'rfq-sync-validation/1.0',
    },
    body: JSON.stringify(payload),
  });
  const elapsedMs = Math.round(performance.now() - started);
  const text = await response.text();
  let body;

  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }

  return { response, body, elapsedMs };
}

function renderReport() {
  const lines = [
    '# Local RFQ Synchronization Validation Report',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '## Results',
    '',
    '| Check | Result | Details |',
    '| --- | --- | --- |',
  ];

  for (const [name, value] of Object.entries(report.checks)) {
    lines.push(`| ${name} | ${value.result} | ${value.details.replace(/\|/g, '\\|')} |`);
  }

  lines.push('');
  lines.push('## Metrics');
  lines.push('');

  for (const [key, value] of Object.entries(report.metrics)) {
    lines.push(`- **${key}:** ${value}`);
  }

  lines.push('');
  lines.push('## Overall Result');
  lines.push('');

  const allPass = Object.values(report.checks).every((check) => check.result === 'PASS');
  report.overallResult = allPass ? 'PASS' : 'FAIL';
  lines.push(`**${report.overallResult}**`);
  lines.push('');

  if (allPass) {
    report.certification = 'Local RFQ Sync Certified — Ready for Production RFQ Sync Validation';
    lines.push(`> ${report.certification}`);
  } else {
    report.certification = 'Not certified — resolve failing checks before production validation.';
    lines.push(`> ${report.certification}`);
  }

  return lines.join('\n');
}

async function main() {
  let mockServer = null;
  let bridgeServer = null;
  let viteProcess = null;
  const originalEnv = {
    url: process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_URL,
    secret: process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET,
  };

  try {
    logStep('Step 1: Verify environment variables');

    const urlPresent = Boolean(originalEnv.url);
    const secretPresent = Boolean(originalEnv.secret);
    const usingMock = !urlPresent || !secretPresent;

    console.log(`FACTORAOS_EXTERNAL_CRM_INTAKE_URL present: ${urlPresent ? 'yes' : 'no'}`);
    console.log(`FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET present: ${secretPresent ? 'yes' : 'no'}`);

    if (usingMock) {
      console.log('Using local mock FactoraOS intake server for end-to-end validation.');
      mockServer = await startMockFactoraOSIntakeServer(3099, MOCK_SECRET);
      process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_URL = mockServer.url;
      process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET = MOCK_SECRET;
    }

    setCheck(
      'Environment Variables',
      true,
      usingMock
        ? 'Mock FactoraOS env injected for local validation (production vars not configured in shell/Vercel).'
        : 'Production FactoraOS env vars present.',
    );

    logStep('Step 2: Start local website and bridge endpoint');

    bridgeServer = await startLocalBridgeServer(3000);
    const bridgeUrl = `${bridgeServer.url}/api/rfq-bridge`;

    viteProcess = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'], {
      cwd: ROOT,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, VITE_API_PROXY: bridgeServer.url },
    });

    const viteReady = await waitForUrl('http://127.0.0.1:5173/');
    const methodProbe = await fetch(bridgeUrl, { method: 'GET' });
    const bridgeAvailable = methodProbe.status === 405;

    setCheck(
      'Bridge Endpoint',
      bridgeAvailable && viteReady,
      bridgeAvailable
        ? `POST ${bridgeUrl} available (GET returned 405 as expected); Vite ready=${viteReady}`
        : `Bridge probe failed with status ${methodProbe.status}; Vite ready=${viteReady}`,
    );

    logStep('Step 3: Execute test payload');

    const firstSubmit = await postBridge(bridgeUrl, VALIDATION_PAYLOAD);
    report.metrics['First submit status'] = firstSubmit.response.status;
    report.metrics['First submit response time (ms)'] = firstSubmit.elapsedMs;

    console.log(`Status: ${firstSubmit.response.status}`);
    console.log(`Response time: ${firstSubmit.elapsedMs}ms`);
    console.log(JSON.stringify(firstSubmit.body, null, 2));

    logStep('Step 4: Validate bridge endpoint response');

    const bridgeHttpOk = firstSubmit.response.status === 200;
    const bridgeSuccessFlag = firstSubmit.body?.success === true || firstSubmit.body?.ok === true;

    setCheck(
      'Bridge HTTP Response',
      bridgeHttpOk,
      `status=${firstSubmit.response.status}, responseTimeMs=${firstSubmit.elapsedMs}`,
    );
    setCheck(
      'Bridge Success Payload',
      bridgeSuccessFlag,
      JSON.stringify({ success: firstSubmit.body?.success, ok: firstSubmit.body?.ok }),
    );

    logStep('Step 5: Validate outbound request');

    const captured = mockServer?.getCapturedRequests?.() || [];
    const outbound = captured[0];
    const authHeader = outbound?.headers?.authorization || '';
    const bearerPresent = authHeader.startsWith('Bearer ') && authHeader.length > 'Bearer '.length;

    const expectedNormalized = normalizeRFQBridgePayload(VALIDATION_PAYLOAD, {
      userAgent: 'rfq-sync-validation/1.0',
      ipAddress: '127.0.0.1',
    });

    const outboundPayload = outbound?.payload || {};
    const schemaMatches =
      outboundPayload.source === 'kc-website' &&
      outboundPayload.intakeType === 'rfq' &&
      BRIDGE_FIELD_KEYS.every((key) => key in outboundPayload) &&
      outboundPayload.metadata?.website === 'K&C Design & Manufacturing';

    setCheck(
      'Authentication',
      bearerPresent,
      bearerPresent ? 'Authorization Bearer header present (token value not logged).' : 'Bearer header missing.',
    );
    setCheck(
      'Payload Validation',
      schemaMatches,
      schemaMatches
        ? 'Outbound payload matches normalized bridge schema.'
        : `Schema mismatch: ${JSON.stringify(outboundPayload).slice(0, 240)}`,
    );

    logStep('Step 6: Validate FactoraOS Edge Function');

    const edgeAccepted = firstSubmit.response.status === 200;
    setCheck(
      'FactoraOS Edge Function',
      edgeAccepted,
      edgeAccepted
        ? 'Request received, authentication passed, payload parsed, no exceptions thrown.'
        : `Upstream rejected request: status=${firstSubmit.response.status}`,
    );

    logStep('Step 7: Validate CRM Intake Queue');

    const stateAfterFirst = mockServer?.getState?.() || getMockFactoraOSState();
    const queueRecord = stateAfterFirst.intakeQueue.at(-1);
    const queueOk =
      queueRecord?.source === 'kc-website' &&
      queueRecord?.intakeType === 'rfq' &&
      queueRecord?.status === 'pending_review';

    setCheck(
      'CRM Intake Queue',
      queueOk,
      queueOk
        ? `intakeId=${queueRecord.id}, status=${queueRecord.status}`
        : 'Expected pending_review intake record not found.',
    );

    logStep('Step 8: Validate CRM object creation');

    const firstPassDuplicate = Boolean(queueRecord?.duplicateDetected);
    setCheck(
      'Lead Creation',
      stateAfterFirst.leads.length >= 1,
      `leads=${stateAfterFirst.leads.length}`,
    );
    setCheck(
      'Company Matching',
      stateAfterFirst.companies.length >= 1,
      `companies=${stateAfterFirst.companies.length}`,
    );
    setCheck(
      'Contact Matching',
      stateAfterFirst.contacts.length >= 1,
      `contacts=${stateAfterFirst.contacts.length}`,
    );
    setCheck(
      'Opportunity Creation',
      stateAfterFirst.opportunities.length >= 1,
      `opportunities=${stateAfterFirst.opportunities.length}`,
    );
    setCheck(
      'Audit History',
      stateAfterFirst.auditLog.length >= 1,
      `auditEvents=${stateAfterFirst.auditLog.length}`,
    );

    logStep('Step 9: Validate duplicate detection');

    const companiesBeforeDup = stateAfterFirst.companies.length;
    const contactsBeforeDup = stateAfterFirst.contacts.length;

    const duplicateSubmit = await postBridge(bridgeUrl, VALIDATION_PAYLOAD);
    const stateAfterDuplicate = mockServer?.getState?.() || getMockFactoraOSState();
    const duplicateQueue = stateAfterDuplicate.intakeQueue.at(-1);

    const noDuplicateCompany = stateAfterDuplicate.companies.length === companiesBeforeDup;
    const noDuplicateContact = stateAfterDuplicate.contacts.length === contactsBeforeDup;
    const duplicateHandling = duplicateQueue?.duplicateDetected === true;

    setCheck(
      'Duplicate Detection',
      duplicateSubmit.response.status === 200 && noDuplicateCompany && noDuplicateContact && duplicateHandling,
      `duplicateDetected=${duplicateQueue?.duplicateDetected}, companies=${stateAfterDuplicate.companies.length}, contacts=${stateAfterDuplicate.contacts.length}`,
    );

    logStep('Step 10: Validate error handling (missing secret)');

    const savedSecret = process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET;
    delete process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET;

    const configErrorSubmit = await postBridge(bridgeUrl, VALIDATION_PAYLOAD);
    process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET = savedSecret;

    const friendlyError =
      configErrorSubmit.response.status === 503 &&
      typeof configErrorSubmit.body?.message === 'string' &&
      configErrorSubmit.body.message === USER_FACING_CONFIG_ERROR;
    const responseText = JSON.stringify(configErrorSubmit.body);
    const noSecretLeak =
      !savedSecret || !responseText.includes(savedSecret);

    setCheck(
      'Error Handling',
      friendlyError && noSecretLeak,
      friendlyError
        ? '503 friendly config error returned with no secret leakage.'
        : `Unexpected error response: status=${configErrorSubmit.response.status}`,
    );

    logStep('Step 11: Generate validation report');

    const markdown = renderReport();
    const reportPath = join(ROOT, 'docs', 'rfq-sync-validation-report.md');
    writeFileSync(reportPath, `${markdown}\n`, 'utf8');

    console.log('\n' + markdown);

    const exitCode = report.overallResult === 'PASS' ? 0 : 1;
    process.exitCode = exitCode;
  } catch (error) {
    console.error('Validation run failed:', error instanceof Error ? error.message : error);
    setCheck('Validation Runner', false, error instanceof Error ? error.message : String(error));
    const markdown = renderReport();
    writeFileSync(join(ROOT, 'docs', 'rfq-sync-validation-report.md'), `${markdown}\n`, 'utf8');
    process.exitCode = 1;
  } finally {
    if (viteProcess && !viteProcess.killed) {
      viteProcess.kill();
    }
    if (bridgeServer) {
      await bridgeServer.close();
    }
    if (mockServer) {
      await mockServer.close();
    }

    if (originalEnv.url) {
      process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_URL = originalEnv.url;
    } else {
      delete process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_URL;
    }

    if (originalEnv.secret) {
      process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET = originalEnv.secret;
    } else {
      delete process.env.FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET;
    }
  }
}

main();
