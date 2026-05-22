# Live RFQ Monitoring and Conversion Workflow

This document describes the admin workflow for monitoring website RFQs and converting qualified leads into CRM opportunities, follow-up tasks, quote prep records, and approved customer conversions.

## Overview

Website RFQs submitted through the K&C contact form are stored in Supabase (`rfq_requests`). When a new RFQ arrives, the system automatically creates:

- A **live RFQ review record** (`crm_live_rfq_reviews`)
- **Conversion workflow stages** (`crm_conversion_workflow_stages`)
- An audit trail entry when reviewers take action (`crm_rfq_audit_events`)

Admins access the dashboard at **`/crm/live-rfq-monitoring`**.

## RFQ Monitoring Process

1. New RFQs appear in the **Live RFQ Queue** with status `new`.
2. Reviewers assign an owner and move the RFQ to `pending_review`.
3. Reviewers evaluate scope, material, quantity, deadline, and source page.
4. RFQs older than **24 hours without first review** are flagged as overdue.
5. Qualified RFQs proceed to opportunity conversion, quote prep, and follow-up scheduling.
6. Disqualified RFQs are closed with a recorded reason.

### Dashboard Buckets

| Bucket | Description |
|--------|-------------|
| New RFQs | Status `new` |
| Pending Review | Status `pending_review` |
| Qualified | Status `qualified` |
| Disqualified | Status `disqualified` |
| Converted | Status `converted_to_customer` |
| Needs Follow-Up | `needs_follow_up` flag or status `follow_up_scheduled` |
| Overdue > 24h | No `first_reviewed_at` and submitted more than 24 hours ago |

### Displayed Fields

- Reference number
- Company / contact
- Project type, material, quantity, deadline
- Source page
- Review status
- Assigned owner
- Submitted timestamp

## Review Statuses

| Status | Meaning |
|--------|---------|
| `new` | RFQ received, not yet reviewed |
| `pending_review` | Assigned for internal review |
| `qualified` | Approved for CRM conversion and quote prep |
| `needs_more_info` | Missing details; internal follow-up required |
| `quoted` | Quote prep record in progress |
| `follow_up_scheduled` | Internal follow-up task created |
| `converted_to_customer` | Human-approved customer conversion complete |
| `disqualified` | RFQ rejected with reason |

## Qualification Workflow

1. Reviewer opens an RFQ from the queue.
2. Reviewer assigns an owner (optional).
3. Reviewer marks **Pending Review** or **Qualified**.
4. If information is missing, reviewer marks **Needs More Info** with internal notes.
5. If the RFQ is not a fit, reviewer marks **Disqualified** with a reason.
6. Each action writes an audit event.

**Qualified RFQs** unlock:

- Follow-up task creation
- Quote prep record editing
- Customer conversion gate (after CRM records exist)

## Opportunity Conversion

The **Convert to Opportunity** action creates local CRM records via `convertRFQToCRM`:

- Company (`crm_companies`)
- Contact (`crm_contacts`)
- Opportunity (`crm_opportunities`)

This is a **manual admin action**. It does not send emails or sync to FactoraOS automatically.

## Quote Prep Workflow

Quote prep is a **review-only internal record** (`crm_quote_prep_records`).

### Fields

- `rfq_id`, `company_id`, `contact_id`, `opportunity_id`
- `project_type`, `material`, `quantity`, `deadline`
- `quote_status`, `internal_notes`, `estimated_value`, `next_action`

### Quote Statuses

| Status | Meaning |
|--------|---------|
| `not_started` | Quote prep not begun |
| `in_review` | Internal review in progress |
| `ready_to_send` | Ready for manual send |
| `sent_manually` | Quote sent by a human outside this system |
| `accepted` | Customer accepted quote |
| `declined` | Customer declined quote |

Saving quote prep updates the RFQ review status to `quoted` and logs an audit event.

**No quote is sent automatically.**

## Follow-Up Workflow

When an RFQ is **qualified**, reviewers may create an internal follow-up task (`crm_rfq_follow_up_tasks`).

### Task Fields

- Title (default: `Follow up on RFQ from {companyName}`)
- Company / contact
- Due date
- Priority (`low`, `medium`, `high`, `urgent`)
- Recommended action
- Notes

Creating a task sets review status to `follow_up_scheduled` and logs an audit event.

**No customer email is sent.**

## Conversion Workflow Stages

Each RFQ has nine tracked stages:

1. RFQ Received
2. Internal Review
3. Qualification
4. Quote Preparation
5. Customer Follow-Up
6. Quote Accepted
7. Customer Record Confirmed
8. First Job / Project Created
9. Converted Customer

Each stage stores:

- Status (`pending`, `in_progress`, `completed`, `blocked`)
- Owner
- Due date
- Notes
- Audit log entry on update

## Customer Conversion Gate

Customer conversion to `converted_to_customer` is blocked unless **all** requirements pass:

| Requirement | Check |
|-------------|-------|
| Company exists | CRM company linked to RFQ |
| Contact exists | CRM contact linked to RFQ |
| Opportunity exists | CRM opportunity linked to RFQ |
| RFQ qualified | Review status is `qualified` or `qualified_at` set |
| Quote accepted | Quote status is `accepted` **OR** admin override with reason |
| Not already converted | Review status is not already `converted_to_customer` |

### Admin Override

If the quote is not yet `accepted`, an admin may apply an override with a documented reason. The override is recorded in audit metadata and on the review record.

### Conversion Warning

The UI displays:

> Customer conversion requires human approval. This action will mark the RFQ as converted but will not automatically send emails, activate billing, or start production.

## Human Approval Rules

| Action | Automatic? | Notes |
|--------|------------|-------|
| Customer email | **No** | Never sent by this module |
| Quote send | **No** | Quote prep is internal only; `sent_manually` is a status label |
| CRM opportunity creation | **No** | Requires explicit "Convert to Opportunity" click |
| Customer conversion | **No** | Requires gate pass + explicit approval |
| Billing activation | **No** | Not triggered |
| Production job creation | **No** | Not triggered |
| FactoraOS sync | **No** | Separate CRM sync workflow |

## Service API

`src/services/rfqMonitoringService.js` exposes:

- `getLiveRfqs()` — dashboard buckets
- `getRfqById(id)` — full RFQ detail with review, quote, workflow, tasks, audit
- `updateRfqStatus(id, status)`
- `assignRfqOwner(id, ownerId)`
- `markRfqQualified(id)`
- `markRfqNeedsMoreInfo(id, notes)`
- `markRfqDisqualified(id, reason)`
- `convertRfqToOpportunity(id)`
- `createRfqFollowUpTask(id, taskInput)`
- `logRfqAuditEvent(id, eventType, metadata)`
- `upsertQuotePrepRecord(rfqRequestId, input)`
- `getConversionGateStatus(rfqRequestId, options)`
- `convertRfqToCustomer(rfqRequestId, options)`
- `updateWorkflowStage(rfqRequestId, stageKey, patch)`

## Database Objects

Migration: `supabase/migrations/022_live_rfq_monitoring_and_conversion.sql`

- `crm_live_rfq_reviews`
- `crm_rfq_follow_up_tasks`
- `crm_quote_prep_records`
- `crm_rfq_audit_events`
- `crm_conversion_workflow_stages`
- `crm_live_rfq_dashboard_view`

## Related Documentation

- [RFQ Bridge Endpoint](./rfq-bridge-endpoint.md)
- [Live RFQ Monitoring Validation Checklist](./live-rfq-monitoring-validation-checklist.md)
