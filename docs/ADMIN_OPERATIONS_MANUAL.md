# Admin Operations Manual

**K&C Design and Manufacturing — RFQ Admin Platform**

---

## Daily Admin Workflow

Complete these steps each business day when RFQs are active:

1. **Log in** at `/admin/login`
2. **Review new RFQs** — check `/admin/rfqs` for status `new`
3. **Download files** — review drawings and specifications from the RFQ detail panel
4. **Update status** — set internal and public status as review progresses
5. **Add notes** — record quoting decisions, customer calls, and internal discussion
6. **Create follow-ups** — schedule reminders for quotes pending or customer responses
7. **Prepare quote draft** — generate and edit quote email draft when ready
8. **Record manual quote send** — log when quote is sent to customer
9. **Monitor reminders** — check `/admin/rfqs?tab=reminders` for overdue items
10. **Review operations dashboard** — scan action queue and alerts at `/admin/rfq-operations`

---

## Weekly Admin Workflow

Complete these steps once per week:

1. **Review analytics** — RFQ volume, conversion, response patterns (`/admin/rfq-operations#analytics`)
2. **Review conversion trends** — compare form starts vs submissions vs quotes sent
3. **Review open RFQs** — ensure no requests are stuck in `new` or `in_review` too long
4. **Review overdue follow-ups** — clear or reschedule reminders queue
5. **Review status lookup activity** — check if customers are looking up RFQ status
6. **Review customer reuploads** — verify additional info submissions are processed
7. **Review issues** — check operations alerts, email failures, and content QA flags

---

## Status Management Guidelines

| Internal Status | When to Use |
|-----------------|-------------|
| `new` | Just submitted — not yet reviewed |
| `in_review` | Actively reviewing files and requirements |
| `waiting_on_customer` | Need more info from customer |
| `quote_ready` | Quote prepared but not yet sent |
| `quoted` | Quote sent to customer |
| `follow_up_needed` | Awaiting customer response after quote |
| `won` | Customer accepted — proceed to production |
| `lost` | Customer declined or chose another supplier |
| `closed` | No further action needed |

Update **public status** whenever customers should see changed progress at `/rfq/status`.

---

## Email Workflow

| Email | Trigger |
|-------|---------|
| Customer confirmation | Automatic on RFQ submit |
| Internal notification | Automatic on RFQ submit |
| Customer status update | Admin sends from detail panel |
| Additional info request | Admin creates from Customer Updates tab |
| Quote email | **Manual** — draft in admin, send externally, record in Manual Send Tracker |

---

## File Handling

- Original uploads: RFQ detail panel → Files section
- Re-uploads: Customer Updates tab after additional info submission
- All downloads use signed URLs — links expire; download again if needed
- Never share admin download links with customers

---

## Escalation

Contact your website administrator if:

- RFQ submission fails in production
- Emails are not delivering
- Admin login fails for authorized users
- File uploads fail consistently
- Analytics or operations dashboard shows system health errors

Reference the RFQ **reference number** (e.g. `KC-RFQ-20260522-0001`) when reporting issues.

---

## Related Documentation

- [OWNER_HANDOFF_GUIDE.md](./OWNER_HANDOFF_GUIDE.md)
- [RFQ_WORKFLOW_OPERATING_PROCEDURE.md](./RFQ_WORKFLOW_OPERATING_PROCEDURE.md)
- [ADMIN_USER_GUIDE.md](./ADMIN_USER_GUIDE.md)
