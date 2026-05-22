# RFQ Workflow Operating Procedure

**K&C Design and Manufacturing — Standard Operating Procedure**

---

## RFQ Lifecycle

```
Customer Submit → Reference Number → K&C Notification → Admin Review
    → File Download → Status Update → Notes → Quote Draft
    → Manual Quote Send → Follow-Up → Won / Lost / Closed
```

### Step-by-Step

1. **Customer submits RFQ** at `/contact` with contact info, project details, optional files
2. **Customer receives reference number** on confirmation page and in confirmation email
3. **K&C receives internal notification** email with RFQ summary
4. **Admin reviews RFQ** in dashboard — open detail panel, read requirements
5. **Files are downloaded** from Files section via signed URLs
6. **Status is updated** — internal status to `in_review`; public status to `under_review`
7. **Notes are added** — record review findings, quoting approach, customer calls
8. **Quote draft is generated** — use Quote tab to create email draft
9. **Quote is manually sent** — send via your email client; record in Manual Send Tracker
10. **Follow-up is scheduled** — set reminder if no customer response within agreed timeframe
11. **RFQ is won/lost/closed** — update internal and public status accordingly

---

## Status Definitions

### Internal Status (Admin Workflow)

| Status | Definition |
|--------|------------|
| `new` | RFQ submitted; awaiting initial review |
| `in_review` | K&C is actively reviewing requirements and files |
| `waiting_on_customer` | Additional information needed from customer |
| `quote_ready` | Quote prepared internally; not yet sent |
| `quoted` | Quote has been sent to customer |
| `follow_up_needed` | Follow-up required after quote or customer delay |
| `won` | Customer accepted quote — proceed to production |
| `lost` | Customer declined or selected another supplier |
| `closed` | RFQ complete or archived with no further action |

### Public Status (Customer-Facing at `/rfq/status`)

| Public Status | Customer Message Theme |
|---------------|------------------------|
| `received` | RFQ received and logged |
| `under_review` | K&C is reviewing requirements |
| `additional_info_needed` | More information or files requested |
| `quote_in_progress` | Quote being prepared |
| `quote_sent` | Quote delivered to customer |
| `completed` | Project completed or RFQ fulfilled |
| `closed` | RFQ closed |

Internal and public statuses are related but independent — always set public status when customers should see progress.

---

## Additional Information Workflow

1. Admin creates **Additional Info Request** from Customer Updates tab
2. Customer receives email with secure token link
3. Customer uploads files at `/rfq/additional-info/{token}`
4. Admin reviews re-uploads in Customer Updates tab
5. Update status and proceed with quoting

Token links expire per request configuration.

---

## Quote Workflow

1. Review RFQ files and notes
2. Prepare quote externally (pricing, lead time, terms)
3. Generate quote email draft in admin for consistent formatting
4. Send quote via your email client
5. **Record manual send** in admin — date, recipient, notes
6. Schedule follow-up reminder (typically 3–5 business days)

Quotes are **never auto-sent** by the platform.

---

## Customer Status Lookup

- Customer visits `/rfq/status`
- Enters reference number + email used on RFQ
- Sees public status and message only — no files or internal data exposed
- Lookup attempts are logged for admin review

---

## Quality Standards

- Respond to new RFQs within one business day when possible
- Always update public status after customer contact about their RFQ
- Record manual quote sends for accurate follow-up tracking
- Use internal notes for team communication — not customer-visible fields
- Reference RFQ number in all customer correspondence

---

## Related Documentation

- [ADMIN_OPERATIONS_MANUAL.md](./ADMIN_OPERATIONS_MANUAL.md)
- [OWNER_HANDOFF_GUIDE.md](./OWNER_HANDOFF_GUIDE.md)
- [ADMIN_USER_GUIDE.md](./ADMIN_USER_GUIDE.md)
