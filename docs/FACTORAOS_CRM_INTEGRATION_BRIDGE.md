# FactoraOS CRM Integration Bridge

K&C Design and Manufacturing sends RFQ-to-CRM conversions to FactoraOS through a review-gated intake queue. The website does not automatically create customers inside FactoraOS.

## Integration Purpose

When an admin converts an RFQ to a local CRM record on the K&C website, the system can send a structured intake payload to FactoraOS. FactoraOS reviewers then approve, link, or create:

- Company
- Contact
- Opportunity

This preserves human review before CRM records are created in FactoraOS.

## Architecture

```
Admin UI → factoraOSIntegrationService → Supabase Edge Function → FactoraOS Intake API
                ↑                              ↑
           Admin JWT only              Service role + API key (server only)
```

- **No FactoraOS API keys in the frontend**
- **No service role keys in the frontend**
- All external calls run through `send-rfq-to-factoraos` Edge Function

## Workflow

1. Admin converts RFQ to local CRM (`crm_companies`, `crm_contacts`, `crm_opportunities`)
2. Admin clicks **Send to FactoraOS** on the RFQ CRM tab
3. Edge Function verifies admin JWT
4. Function builds intake payload from RFQ + CRM records + file metadata
5. Function inserts `factoraos_crm_sync_events` row with `pending` status
6. Function POSTs to `FACTORAOS_INTAKE_ENDPOINT` with bearer token
7. On success: `sync_status = sent`, internal RFQ note added
8. On failure: `sync_status = failed`, safe error message stored

## Payload Schema

```json
{
  "source_system": "kc_website",
  "source_type": "rfq_to_crm_conversion",
  "source_rfq_id": "uuid",
  "reference_number": "KC-RFQ-...",
  "company": { "name", "email", "phone", "industry" },
  "contact": { "name", "email", "phone", "role" },
  "opportunity": {
    "name", "stage", "estimated_value", "quoted_value",
    "expected_close_date", "project_type", "material", "quantity", "timeline"
  },
  "rfq": {
    "submitted_at", "notes", "status", "public_status",
    "files": [{ "file_name", "file_type", "file_size" }]
  },
  "integration_policy": {
    "create_customer_automatically": false,
    "requires_review": true,
    "allow_duplicate_detection": true
  }
}
```

File metadata only — no storage URLs or signed links are sent.

## Environment Variables

Set in **Supabase Dashboard → Edge Functions → Secrets**:

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side DB access |
| `SUPABASE_ANON_KEY` | Admin JWT verification |
| `FACTORAOS_INTAKE_ENDPOINT` | FactoraOS intake queue URL |
| `FACTORAOS_INTAKE_API_KEY` | Bearer token for FactoraOS API |

Deploy:

```bash
supabase functions deploy send-rfq-to-factoraos
```

## Security Model

- Admin-only RLS on `factoraos_crm_sync_events` and CRM tables
- Edge Function requires authenticated admin JWT (`admin_profiles` role check)
- API keys stored as Edge Function secrets only
- Sync event payload stored for audit; not exposed publicly
- File URLs never included in intake payload

## Review-Gated CRM Intake Model

`integration_policy.create_customer_automatically: false` tells FactoraOS not to auto-create records. FactoraOS should:

1. Receive intake into review queue
2. Detect duplicates (company/email matching)
3. Allow reviewer to link existing records or create new ones
4. Return intake ID for tracking

## Retry Behavior

- Failed syncs store `error_message` and remain `failed`
- Admin can click **Retry Sync** which invokes the Edge Function with `sync_event_id`
- Retry re-builds payload from current RFQ/CRM data and re-POSTs

## Duplicate Handling Recommendation

FactoraOS should match on:

- Company name (normalized)
- Contact email
- RFQ reference number (`source_rfq_id` / `reference_number`)

Recommend returning existing record links in intake response when duplicates are detected rather than creating new records.

## Future Enhancement: Signed File Transfer

Current integration sends file metadata only (`file_name`, `file_type`, `file_size`). A future enhancement could:

1. Generate short-lived signed URLs server-side in the Edge Function
2. Include them in a separate `files_transfer` block
3. Require FactoraOS to fetch within TTL
4. Log transfer completion in sync events

This is intentionally not implemented until FactoraOS documents secure file intake requirements.

## Database

- `factoraos_crm_sync_events` — sync audit trail
- `crm_companies`, `crm_contacts`, `crm_opportunities` — local staging records

Migration: `supabase/migrations/020_factoraos_crm_integration_bridge.sql`

## Admin UI

- RFQ detail → **CRM** tab: convert + send to FactoraOS
- `/admin/crm`: overview of conversions and sync status
