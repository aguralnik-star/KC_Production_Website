# RFQ Bridge Endpoint

The K&C website RFQ form submits through `/api/rfq-bridge`, which validates and normalizes the payload and forwards it to the FactoraOS `external-crm-intake` Supabase Edge Function.

## Data flow

```text
K&C RFQ Form
  → POST /api/rfq-bridge
  → FactoraOS external-crm-intake Edge Function
  → CRM Intake Queue
  → Lead / Company / Contact / Opportunity Review
```

The bridge runs as a Vercel serverless function. The browser never receives FactoraOS secrets.

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (server-side only):

```env
FACTORAOS_EXTERNAL_CRM_INTAKE_URL=https://YOUR_FACTORAOS_PROJECT.supabase.co/functions/v1/external-crm-intake
FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET=your_shared_intake_secret
```

- `FACTORAOS_EXTERNAL_CRM_INTAKE_URL` — full HTTPS URL for the deployed FactoraOS intake function
- `FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET` — bearer token sent as `Authorization: Bearer ...`

Do not expose these values in Vite `VITE_*` variables or client-side code.

## Incoming request

- **Method:** `POST` only (all other methods return `405`)
- **Content-Type:** `application/json`

### Expected fields

| Field | Required | Notes |
| --- | --- | --- |
| `companyName` | No | Company name |
| `contactName` | Yes | Contact name |
| `email` | Yes | Valid email address |
| `phone` | No | Phone number |
| `projectType` | No | Project type |
| `material` | No | Material |
| `quantity` | No | Quantity |
| `deadline` | No | Timeline / deadline |
| `message` | No | Project notes |
| `sourcePage` | No | Page path, e.g. `/request-quote` |

## Forwarded payload

The bridge sends this normalized payload to FactoraOS:

```json
{
  "source": "kc-website",
  "intakeType": "rfq",
  "companyName": "...",
  "contactName": "...",
  "email": "...",
  "phone": "...",
  "projectType": "...",
  "material": "...",
  "quantity": "...",
  "deadline": "...",
  "message": "...",
  "sourcePage": "...",
  "submittedAt": "2026-05-22T12:00:00.000Z",
  "metadata": {
    "userAgent": "...",
    "ipAddress": "...",
    "website": "K&C Design & Manufacturing"
  }
}
```

Authorization header:

```http
Authorization: Bearer ${FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET}
```

## Responses

### Success (`200`)

```json
{
  "ok": true,
  "message": "RFQ forwarded successfully.",
  "submittedAt": "2026-05-22T12:00:00.000Z"
}
```

### Validation error (`400`)

```json
{
  "ok": false,
  "message": "Contact name is required.",
  "fieldErrors": {
    "contactName": "Contact name is required."
  }
}
```

### Configuration error (`503`)

Returned when bridge env vars are missing in the deployment environment.

### Forwarding error (`502`)

Returned when FactoraOS intake is unreachable or rejects the request. Internal secrets and upstream stack traces are not exposed to the client.

## Local development

1. Add server env vars to a local Vercel env file or shell session.
2. Start the API locally:

```bash
npx vercel dev
```

3. In another terminal, run the Vite app (optional proxy to port `3000` is configured in `vite.config.js`):

```bash
npm run dev
```

4. Submit the RFQ form, or run the test script:

```bash
npm run test:rfq-bridge
```

Override the test target when needed:

```bash
RFQ_BRIDGE_TEST_URL=https://your-preview.vercel.app/api/rfq-bridge npm run test:rfq-bridge
```

## Local synchronization validation

Run the full 11-step local validation workflow (bridge, mock FactoraOS intake, duplicate detection, and error handling):

```bash
npm run validate:rfq-sync
```

Report output: `docs/rfq-sync-validation-report.md`

When `FACTORAOS_EXTERNAL_CRM_INTAKE_URL` and `FACTORAOS_EXTERNAL_CRM_INTAKE_SECRET` are not configured locally, the validator injects a mock FactoraOS intake server for end-to-end testing. Configure production env vars in Vercel before production RFQ sync validation.

Run production validation against the live site:

```bash
npm run validate:production-rfq-sync
```

Report output: `docs/production-rfq-sync-validation-report.md`

## Frontend integration

- Service: `src/services/rfqBridgeService.js`
- Form: `src/components/RFQForm.jsx`
- Submission states: `submitting`, `success`, `error`

The form posts RFQ data to `/api/rfq-bridge` through `postRFQToBridge()` inside `submitRFQ()`. After the local Supabase RFQ record, file uploads, and notification emails succeed, the bridge forwards the normalized payload to FactoraOS CRM intake. Bridge failures are logged in the browser console and do not block the customer confirmation flow.

## Security notes

- FactoraOS intake secrets stay on the server.
- Upstream errors are logged server-side only.
- User-facing errors use friendly messages without internal details.
