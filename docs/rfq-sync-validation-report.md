# Local RFQ Synchronization Validation Report

Generated: 2026-05-22T20:32:30.892Z

## Results

| Check | Result | Details |
| --- | --- | --- |
| Environment Variables | PASS | Mock FactoraOS env injected for local validation (production vars not configured in shell/Vercel). |
| Bridge Endpoint | PASS | POST http://127.0.0.1:3000/api/rfq-bridge available (GET returned 405 as expected); Vite ready=true |
| Bridge HTTP Response | PASS | status=200, responseTimeMs=46 |
| Bridge Success Payload | PASS | {"success":true,"ok":true} |
| Authentication | PASS | Authorization Bearer header present (token value not logged). |
| Payload Validation | PASS | Outbound payload matches normalized bridge schema. |
| FactoraOS Edge Function | PASS | Request received, authentication passed, payload parsed, no exceptions thrown. |
| CRM Intake Queue | PASS | intakeId=intake-1, status=pending_review |
| Lead Creation | PASS | leads=1 |
| Company Matching | PASS | companies=1 |
| Contact Matching | PASS | contacts=1 |
| Opportunity Creation | PASS | opportunities=1 |
| Audit History | PASS | auditEvents=5 |
| Duplicate Detection | PASS | duplicateDetected=true, companies=1, contacts=1 |
| Error Handling | PASS | 503 friendly config error returned with no secret leakage. |

## Metrics

- **First submit status:** 200
- **First submit response time (ms):** 46

## Overall Result

**PASS**

> Local RFQ Sync Certified — Ready for Production RFQ Sync Validation
