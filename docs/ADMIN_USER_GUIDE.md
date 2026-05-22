# Admin User Guide

**K&C Design and Manufacturing — RFQ Admin Platform**  
**Audience:** K&C staff with admin access

---

## Getting Started

| Item | Detail |
|---|---|
| **Admin login URL** | `/admin/login` |
| **Main dashboard** | `/admin/rfqs` |
| **Handoff center** | `/admin/handoff` |
| **Support** | info@kcdesignmfg.com · (630) 543-3386 |

You must have an active row in `admin_profiles` linked to your Supabase Auth account. Contact engineering if login fails after password reset.

---

## How to Log In

1. Go to **`/admin/login`** on the production site.
2. Enter your email and password.
3. Click **Sign In**.
4. On success, you are redirected to the **RFQ Dashboard** (`/admin/rfqs`).
5. If you see “Access denied,” your account is not authorized — contact an owner to add your profile.

**Sign out:** Use the sign-out control in the admin header.

---

## How to Review RFQs

1. Open **RFQs** in the admin navigation (`/admin/rfqs`).
2. Use **search** and **filters** to find requests by status, date, or keywords.
3. Click a row to open the **RFQ detail panel**.
4. Review:
   - Customer contact information
   - Project type, material, quantity, timeline, notes
   - Internal status and public customer status
   - Uploaded files and email history tabs

**Deep link:** `/admin/rfqs?rfq={uuid}` opens a specific RFQ directly.

---

## How to Download Uploaded Files

1. Open the RFQ detail panel.
2. Go to the **Files** section (or equivalent tab showing original uploads).
3. Click **Download** next to each file.
4. Files are served via **signed URLs** from the private storage bucket — links expire after a short time; click again if expired.

Customer re-uploads appear in the **Customer Updates** / re-upload section (see below).

---

## How to Update RFQ Status

1. Open the RFQ detail panel.
2. Use the **Internal Status** control to set workflow state (e.g. new, in_review, quoted, won).
3. Update **Public Status** separately — this is what customers see on `/rfq/status`.
4. Optionally add a **customer status message** for richer public messaging.
5. Save changes — updates are recorded on the RFQ record.

Internal and public statuses are related but not identical; always set public status when customers should see progress.

---

## How to Add Internal Notes

1. Open the RFQ detail panel.
2. Find the **Internal Notes** section.
3. Type your note and save.
4. Notes are **admin-only** — never visible to customers.
5. A system note is added automatically when an RFQ is first submitted.

Use notes for quoting decisions, customer calls, and handoffs between team members.

---

## How to Generate Quote Email Drafts

1. Open the RFQ detail panel.
2. Go to the **Quote** tab/section.
3. Click **Generate Quote Draft** (or similar).
4. Review the generated subject and body in the preview.
5. Edit if needed before sending externally.
6. Draft history is saved in **Quote Draft History**.

Drafts are **not sent automatically** — copy content to your email client or send manually, then record the send (next section).

---

## How to Record Manual Quote Sends

1. After sending a quote email outside the system (or from your mail client), return to the RFQ detail panel.
2. Open **Manual Send Tracker** under the Quote section.
3. Record:
   - Send date/time
   - Recipient
   - Optional notes
4. Save — this updates follow-up tracking and operations metrics.

---

## How to Request Additional Customer Information

1. Open the RFQ detail panel.
2. Go to the **Customer Updates** tab.
3. Open **Additional Info Request**.
4. Enter the message describing what you need (files, dimensions, clarifications).
5. Click **Send Request**.
6. The customer receives an email with a secure link to `/rfq/additional-info/{token}`.
7. Track request status and history in **Additional Info Request History**.

You can send follow-up requests if the customer does not respond before token expiry.

---

## How to Review Re-Uploaded Files

1. Open the RFQ detail panel → **Customer Updates** tab.
2. View **Customer Re-upload Files** list after the customer submits.
3. Download files the same way as original uploads (signed URLs).
4. Review **submission notes** and timestamps in the submission history.

Compare against original files before updating quote or status.

---

## How to Check Reminders

1. Click **Reminders** in the admin navigation (`/admin/rfqs?tab=reminders`).
2. Review the follow-up queue sorted by priority and due date.
3. Use filters to narrow by status or overdue level.
4. Open the linked RFQ from a reminder row.
5. Use **Follow-Up Quick Actions** in the detail panel to snooze, complete, or escalate.

---

## How to Use Analytics

1. Click **Analytics** in the admin navigation (`/admin/rfq-operations#analytics`).
2. Review KPI summary cards (volume, conversion, response times).
3. Use charts for trends over time (RFQ volume, status distribution, email activity).
4. Charts load lazily — allow a moment on first visit.
5. Use data for weekly operations reviews.

---

## How to Use Operations Command Center

1. Click **Operations** in the admin navigation (`/admin/rfq-operations`).
2. Monitor:
   - **Summary cards** — open RFQs, overdue follow-ups, recent activity
   - **Action queue** — items needing attention
   - **Alert feed** — system and workflow alerts
   - **System health** — email, storage, and integration status
3. Use **Refresh** to pull latest data.
4. Click through to individual RFQs from queue items.

---

## How to Run Readiness Checklist

1. Click **Readiness** in the admin navigation (`/admin/rfq-readiness`).
2. Click **Run Audit** to execute automated production readiness checks.
3. Review results by category (security, email, database, etc.).
4. Open individual checks for evidence and remediation guidance.
5. Re-run after fixes until critical checks pass.

Use before launch and after major infrastructure changes.

---

## How to Use Launch Checklist

1. Click **Launch** in the admin navigation (`/admin/launch-checklist`).
2. Work through categories: SEO, performance, accessibility, RFQ workflow, security, email, Supabase, Vercel.
3. Check off completed items; add **evidence notes** where helpful.
4. Track overall completion % and readiness badge.
5. Use **Print** for sign-off records.

Target **95%+** completion with no unresolved critical blockers before launch.

---

## How to Use Launch Go/No-Go Review

1. Click **Go/No-Go** in the admin navigation (`/admin/launch-go-no-go`).
2. Review the **Final Review Table** — status, evidence, risk, owner, decision per area.
3. Select executive decision: **Go**, **Conditional Go**, or **No-Go**.
4. Add **final decision notes** for sign-off.
5. Print/export for executive records.

Do not select **Go** until RFQ submission, email, and admin access are verified in production.

---

## Admin Navigation Quick Reference

| Nav item | Route |
|---|---|
| RFQs | `/admin/rfqs` |
| Analytics | `/admin/rfq-operations#analytics` |
| Reminders | `/admin/rfqs?tab=reminders` |
| Readiness | `/admin/rfq-readiness` |
| Operations | `/admin/rfq-operations` |
| Launch | `/admin/launch-checklist` |
| Go/No-Go | `/admin/launch-go-no-go` |
| Handoff | `/admin/handoff` |

---

## Tips

- Always update **public status** when replying to customer status inquiries.
- Record **manual quote sends** so reminders and analytics stay accurate.
- Use **internal notes** instead of customer-visible fields for internal discussion.
- If emails fail, check with engineering before telling customers the system is down.
- For technical issues, reference the RFQ **reference number** (e.g. `KC-RFQ-YYYYMMDD-0001`).

---

## Related Documentation

- [`PUBLIC_LAUNCH_PACKAGE.md`](./PUBLIC_LAUNCH_PACKAGE.md)
- [`POST_LAUNCH_MONITORING_PLAN.md`](./POST_LAUNCH_MONITORING_PLAN.md)
- [`HANDOFF_NOTES.md`](./HANDOFF_NOTES.md)
