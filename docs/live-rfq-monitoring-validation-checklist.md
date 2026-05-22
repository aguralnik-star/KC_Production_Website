# Live RFQ Monitoring — Validation Checklist

Use this checklist to verify the live RFQ monitoring and customer conversion workflow after deployment or migration.

**Dashboard URL:** `/crm/live-rfq-monitoring`  
**Migration:** `022_live_rfq_monitoring_and_conversion.sql`  
**Service:** `src/services/rfqMonitoringService.js`

---

## Prerequisites

- [ ] Migration `022_live_rfq_monitoring_and_conversion.sql` applied to Supabase
- [ ] Admin user logged in at `/admin/login`
- [ ] At least one RFQ exists in `rfq_requests` (submit via `/contact` if needed)

---

## Dashboard

- [ ] RFQs appear in the Live RFQ Monitoring dashboard
- [ ] Summary cards show counts for New, Pending Review, Qualified, Disqualified, Converted, Follow-Up, and Overdue
- [ ] Table displays reference, company/contact, project type, material, quantity, deadline, source page, status, owner, submitted date
- [ ] Status filter and "Overdue without review only" filter work
- [ ] Refresh button reloads data without errors

---

## RFQ Status Updates

- [ ] **Mark Pending Review** updates status to `pending_review`
- [ ] **Mark Qualified** updates status to `qualified`
- [ ] **Needs More Info** updates status to `needs_more_info` with notes
- [ ] **Disqualify** updates status to `disqualified` with reason
- [ ] Status changes persist after page refresh

---

## Assignment

- [ ] Admin owner dropdown loads active admin profiles
- [ ] **Save Owner** assigns `assigned_owner_id` on the review record
- [ ] Assigned owner displays in the dashboard queue

---

## Qualification

- [ ] Qualification sets `qualified_at` timestamp
- [ ] Qualification workflow stage marked completed
- [ ] Audit event `rfq_qualified` created
- [ ] Follow-up task creation enabled only when qualified

---

## Follow-Up Task Creation

- [ ] Default title is `Follow up on RFQ from {companyName}`
- [ ] Task fields save: title, due date, priority, recommended action, notes
- [ ] Review status changes to `follow_up_scheduled`
- [ ] Task appears in the workflow panel list
- [ ] Audit event `follow_up_task_created` recorded

---

## Opportunity Conversion

- [ ] **Convert to Opportunity** creates company, contact, and opportunity in local CRM
- [ ] Conversion gate shows company/contact/opportunity checks as passing
- [ ] Audit event `opportunity_created` recorded
- [ ] No automatic FactoraOS or customer email triggered

---

## Quote Prep Record

- [ ] Quote prep form saves project type, material, quantity, deadline from RFQ
- [ ] Quote status options work: `not_started`, `in_review`, `ready_to_send`, `sent_manually`, `accepted`, `declined`
- [ ] Internal notes, estimated value, and next action persist
- [ ] Review status updates to `quoted` on save
- [ ] Audit event `quote_prep_updated` recorded
- [ ] No quote email sent automatically

---

## Customer Conversion Gate

- [ ] Gate blocks conversion when company is missing
- [ ] Gate blocks conversion when contact is missing
- [ ] Gate blocks conversion when opportunity is missing
- [ ] Gate blocks conversion when RFQ is not qualified
- [ ] Gate blocks conversion when quote is not `accepted` (without admin override)
- [ ] Admin override with reason allows conversion when quote not accepted
- [ ] Gate blocks conversion when already `converted_to_customer`
- [ ] Warning message displayed about no automatic emails, billing, or production

---

## Approved Customer Conversion

- [ ] **Approve Customer Conversion** succeeds when all gate checks pass
- [ ] Review status becomes `converted_to_customer`
- [ ] `converted_to_customer_at` timestamp set
- [ ] Workflow stage `converted_customer` marked completed
- [ ] Audit event `converted_to_customer` recorded with override metadata if applicable

---

## Workflow Stages

- [ ] All 9 stages display for selected RFQ
- [ ] Stage status, due date, and notes updates persist
- [ ] Audit event `workflow_stage_updated` recorded on stage changes

---

## Audit Trail

- [ ] Audit log panel shows events for status, owner, qualification, follow-up, quote, workflow, and conversion actions
- [ ] Events include timestamp and entity type
- [ ] `logRfqAuditEvent` entries visible in `crm_rfq_audit_events`

---

## Safety — No Automatic Side Effects

- [ ] **No automatic customer emails** are sent by any workflow action
- [ ] **No billing activation** occurs on conversion
- [ ] **No production job** is created without separate human approval
- [ ] Quote send remains manual (`sent_manually` status only)
- [ ] FactoraOS sync is not triggered by monitoring actions alone

---

## Build & Deploy

- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] Route `/crm/live-rfq-monitoring` accessible to admin users
- [ ] Navigation label **Live RFQ Monitoring** appears in admin nav

---

## Sign-Off

| Role | Name | Date | Result |
|------|------|------|--------|
| Developer | | | |
| Admin / Ops | | | |

**Notes:**
