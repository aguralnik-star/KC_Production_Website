# Owner Handoff Guide

**K&C Design and Manufacturing, Inc.**  
**Audience:** Business owners and authorized K&C staff

---

## Getting Started

| Item | Detail |
|------|--------|
| **Website** | https://www.kcdesignmfg.com |
| **Admin login** | https://www.kcdesignmfg.com/admin/login |
| **Owner handoff dashboard** | `/admin/owner-handoff` |
| **Support** | info@kcdesignmfg.com · (630) 543-3386 |

You must have an admin account in Supabase Auth with a matching row in `admin_profiles`. Contact your website administrator if login fails.

---

## How to Access the Website Admin

1. Open **https://www.kcdesignmfg.com/admin/login**
2. Enter your email and password
3. Click **Sign In**
4. You will land on the **RFQ Dashboard** (`/admin/rfqs`)

Use the admin navigation bar to access RFQs, Analytics, Reminders, Operations, Launch tools, Content QA, and Owner Handoff.

---

## How to Log In

See above. If you see "Access denied," your account is not authorized — an administrator must add your profile to `admin_profiles`.

**Sign out:** Use the sign-out control in the admin header when finished.

---

## How to Review New RFQs

1. Go to **RFQs** (`/admin/rfqs`)
2. New submissions appear at the top with status **new**
3. Use search and filters to find specific requests
4. Click a row to open the **RFQ detail panel**
5. Review contact info, project details, notes, and files

---

## How to Download Uploaded Files

1. Open the RFQ detail panel
2. Find the **Files** section
3. Click **Download** next to each file
4. Files use temporary signed URLs — click again if a link expires

---

## How to Update RFQ Status

1. Open the RFQ detail panel
2. Set **Internal Status** (workflow state for K&C staff)
3. Set **Public Status** (what customers see at `/rfq/status`)
4. Add a customer status message if helpful
5. Save changes

Always update public status when customers should see progress.

---

## How to Add Internal Notes

1. Open the RFQ detail panel
2. Find **Internal Notes**
3. Type your note and save
4. Notes are admin-only — never visible to customers

---

## How to Schedule Follow-Ups

1. Open the RFQ detail panel
2. Use **Follow-Up Quick Actions** to schedule a date
3. Or go to **Reminders** (`/admin/rfqs?tab=reminders`) to see the queue
4. Complete or snooze reminders as work progresses

---

## How to Generate Quote Email Drafts

1. Open the RFQ detail panel → **Quote** section
2. Click **Generate Quote Draft**
3. Review and edit the subject and body
4. Copy to your email client — drafts are **not sent automatically**

---

## How to Record Manual Quote Sends

1. After sending a quote email externally, return to the RFQ
2. Open **Manual Send Tracker**
3. Record send date, recipient, and notes
4. Save — this updates follow-up tracking and analytics

---

## How to Request Additional Information

1. Open the RFQ detail panel → **Customer Updates** tab
2. Create an **Additional Info Request**
3. Describe what you need (files, clarifications)
4. Click **Send Request**
5. Customer receives a secure email link to upload files

---

## How Customers Re-Upload Files

1. Customer clicks the secure link in the email
2. Opens `/rfq/additional-info/{token}`
3. Uploads revised files and submits
4. You see re-uploads in **Customer Updates** on the RFQ detail panel

---

## How to Review Analytics

1. Click **Analytics** (`/admin/rfq-operations#analytics`)
2. Review RFQ volume, conversion trends, and KPI charts
3. Use for weekly business reviews

---

## How to Check the Operations Dashboard

1. Click **Operations** (`/admin/rfq-operations`)
2. Monitor summary cards, action queue, alerts, and system health
3. Click through to individual RFQs from queue items

---

## How to Review Failed Emails

1. Check **Operations Command Center** system health panel
2. Review RFQ detail panel email history tabs
3. If emails fail, verify Resend configuration with your administrator
4. Do not tell customers the system is down until confirmed

---

## How to Monitor Post-Launch Performance

1. Use **Post-Launch Dashboard** (`/admin/post-launch`) for 7-day monitoring
2. Review analytics weekly for RFQ conversion trends
3. Complete the post-launch checklist in **Owner Handoff** (`/admin/owner-handoff`)
4. See [POST_LAUNCH_SUPPORT_PLAN.md](./POST_LAUNCH_SUPPORT_PLAN.md) for detailed timelines

---

## Quick Reference

| Task | Where |
|------|-------|
| Review RFQs | `/admin/rfqs` |
| Follow-ups | `/admin/rfqs?tab=reminders` |
| Analytics | `/admin/rfq-operations#analytics` |
| Launch signoff | `/admin/owner-handoff` |
| Content accuracy | `/admin/content-qa` |
| Mobile QA | `/admin/mobile-browser-qa` |

---

## Related Documentation

- [FINAL_PRODUCTION_LAUNCH_PACKAGE.md](./FINAL_PRODUCTION_LAUNCH_PACKAGE.md)
- [ADMIN_OPERATIONS_MANUAL.md](./ADMIN_OPERATIONS_MANUAL.md)
- [RFQ_WORKFLOW_OPERATING_PROCEDURE.md](./RFQ_WORKFLOW_OPERATING_PROCEDURE.md)
