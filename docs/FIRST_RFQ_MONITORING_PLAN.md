# First RFQ Monitoring Plan

**Project:** K&C Design and Manufacturing Website  
**Effective:** First 30 days after production launch

---

## New RFQ Review Process

For every new RFQ received in production, complete the 10-step monitoring workflow in the **Go-Live Command Center** (`/admin/go-live`):

| Step | Action |
|------|--------|
| 1 | Confirm RFQ record created in Supabase |
| 2 | Confirm file upload exists in storage |
| 3 | Confirm customer confirmation email delivered |
| 4 | Confirm admin notification delivered |
| 5 | Assign review owner |
| 6 | Move status to `in_review` |
| 7 | Add review note |
| 8 | Track quote preparation |
| 9 | Track follow-up creation |
| 10 | Record outcome (won / lost / pending / closed) |

---

## Response-Time Goals

| Milestone | Target |
|-----------|--------|
| New RFQ reviewed | Within 1 business day |
| Customer contacted (if needed) | Within 1 business day |
| Quote prepared | As operationally feasible |
| Follow-up scheduled | Immediately after quote issuance |

---

## Quote Preparation Process

1. Review RFQ details, files, and project notes in admin dashboard
2. Validate manufacturability against current capabilities
3. Prepare internal quote draft
4. Update RFQ status to `quote_ready` when draft is complete
5. Send quote to customer and update status to `quoted`
6. Log activity in admin notes

---

## Follow-Up Expectations

- Schedule follow-up immediately after quote is sent
- Use admin reminders tab to track due dates
- Complete follow-up within agreed timeline
- Update status to `follow_up_needed`, `won`, `lost`, or `waiting_on_customer` as appropriate
- Record outcome in Go-Live monitoring workflow (Step 10)

---

## Customer Communication Standards

- Acknowledge receipt via automated confirmation email (system-generated)
- Use professional, clear language in any manual follow-up
- Do not share internal pricing notes or admin-only fields with customers
- Request additional info through the admin additional-info workflow (not ad-hoc email links)
- Update customer-facing status when meaningful progress occurs

---

## Activity Feed Events to Monitor

- RFQ received
- RFQ reviewed
- Quote draft generated
- Quote sent
- Follow-up scheduled
- Follow-up completed
- Additional info requested
- Additional info received
- RFQ won
- RFQ lost
- Issue created
- Issue resolved

---

## Escalation

Refer to [Go-Live Issue Response Playbook](./GO_LIVE_ISSUE_RESPONSE_PLAYBOOK.md) for severity levels and response times.

| Severity | Response |
|----------|----------|
| CRITICAL | Immediate investigation |
| HIGH | Resolve within same business day |
| MEDIUM | Resolve within 72 hours |
| LOW | Add to backlog |
