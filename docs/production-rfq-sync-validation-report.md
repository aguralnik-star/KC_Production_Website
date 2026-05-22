# Production RFQ Synchronization Validation Report

**Test date:** 2026-05-22T20:35:58.059Z
**Production site:** https://kc-production-website.vercel.app
**Bridge endpoint:** https://kc-production-website.vercel.app/api/rfq-bridge

## Test payload summary

- Company: Production RFQ Test Company
- Contact: Production Test User
- Email: production.rfq.test@example.com
- Phone: 555-555-0199
- Project type: CNC Machining
- Material: 6061 Aluminum
- Quantity: 100
- Deadline: 2026-06-15
- Source page: /rfq

## Pre-checks

| Check | Result | Details |
| --- | --- | --- |
| Production env vars | FAIL | URL present=false, secret present=false. Add both in Vercel Production settings. |
| FactoraOS external-crm-intake deployed | FAIL | Could not verify via Supabase MCP (no FactoraOS project access from this environment). Verify manually in FactoraOS Supabase Dashboard → Edge Functions. |
| FactoraOS CRM tables exist | FAIL | Could not verify crm_intake_queue, companies, contacts, opportunities, crm_audit_events (FactoraOS database not accessible from this environment). |
| Bridge endpoint HTTP 200 | FAIL | status=503, responseTimeMs=424 |
| No secret leakage in bridge response | PASS | Bridge response did not include secret values. |
| Public-friendly bridge error when misconfigured | PASS | 503 returned with friendly configuration message (expected while env vars missing). |
| Duplicate bridge submission handling | FAIL | Cannot validate FactoraOS duplicate handling until bridge returns HTTP 200. Second submit status=503. |
| Edge Function authentication | FAIL | Not reached — bridge returned 503 before forwarding to FactoraOS. |
| CRM intake queue record | FAIL | Not created — upstream bridge did not forward payload. |
| CRM intake status pending_review | FAIL | Not verified. |
| Company created or matched | FAIL | Not verified. |
| Contact created or matched | FAIL | Not verified. |
| Opportunity created | FAIL | Not verified. |
| Audit event recorded | FAIL | Not verified. |
| Website RFQ saved locally | PASS | Confirmed via live browser submission to confirmation page ref KC-RFQ-20260522-0006. |
| Website success UX (no internal errors shown) | PASS | Live submission reached confirmation page without exposing bridge/secret errors to the visitor. |

## Metrics

- **Bridge status (first submit):** 503
- **Bridge response time ms (first submit):** 424

## Website result

Manual browser validation: live form at https://kc-production-website.vercel.app/contact submitted successfully and redirected to confirmation ref KC-RFQ-20260522-0006. Bridge CRM sync did not occur.

## Bridge endpoint result

Bridge returned HTTP 503. Body: {"ok":false,"message":"RFQ forwarding is not configured yet. Please call (630) 543-3386 or email info@kcdesignmfg.com."}

## Edge Function result

FactoraOS external-crm-intake was not reached because /api/rfq-bridge returned 503 (missing env configuration).

## CRM intake result

No CRM intake queue record verified for production.rfq.test@example.com.

## CRM object creation result

Database validation queries against FactoraOS were not executed (FactoraOS Supabase project not accessible from this validator).

## Duplicate detection result

Not validated — FactoraOS intake was never reached because production bridge env vars are missing.

## Error handling result

Bridge returns a friendly configuration message without exposing secrets when FactoraOS env vars are missing.

## Final status

**FAIL**

> Not certified — resolve failing checks before production CRM sync can be enabled.

## Required remediation

1. Add FACTORAOS_EXTERNAL_CRM_INTAKE_URL and FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET to Vercel Production environment variables.
1. Redeploy production after adding env vars.
