# Public Launch Package

**K&C Design and Manufacturing, Inc.**  
**Document version:** 1.0  
**Date:** 2026-05-22

---

## Website Launch Summary

K&C Design and Manufacturing has a modern public marketing website and integrated RFQ (Request for Quote) platform built to replace the legacy static site. The new site presents company capabilities, equipment, quality standards, and industries served, and provides a secure path for customers to submit machining RFQs, check quote status, and upload additional project files when requested.

The platform is deployed on **Vercel** with **Supabase** for database, authentication, private file storage, and server-side email workflows via Edge Functions and **Resend**.

| Item | Detail |
|---|---|
| **Production URL** | `https://www.kcdesignmfg.com` *(target custom domain — connect DNS to Vercel before cutover)* |
| **Staging / interim URL** | `https://kc-production-website.vercel.app` |
| **Supabase project** | `uukrvhyepqloqwekzppm` |
| **Vercel project** | `kc-production-website` |
| **Repository** | `KC_Production_Website` |

---

## Public Pages Launched

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About K&C |
| `/capabilities` | CNC capabilities |
| `/equipment` | Equipment & inspection |
| `/quality` | Quality program |
| `/industries` | Industries served |
| `/contact` | Contact & RFQ form |
| `/rfq/confirmation` | Post-submission confirmation |
| `/rfq/status` | Public RFQ status lookup |
| `/rfq/additional-info/:token` | Customer additional-info upload (token link only) |

**SEO assets:** `robots.txt`, `sitemap.xml`, `site.webmanifest`, page-specific meta tags, Open Graph metadata, and LocalBusiness JSON-LD on the home page.

**Not indexed:** Admin routes, confirmation pages, and token-based upload routes are excluded from the sitemap and blocked in `robots.txt` where appropriate.

---

## RFQ Workflow Summary

1. Customer visits **Contact** (`/contact`) and completes the RFQ form (contact info, project details, optional files).
2. Frontend validates input and inserts a row into `rfq_requests` (reference number auto-generated).
3. Files upload to the private **`rfq-files`** bucket under `rfq/{request_id}/`.
4. File metadata is stored in `rfq_files`.
5. Edge Function **`send-rfq-notification`** sends:
   - Internal notification to K&C (`RFQ_NOTIFICATION_TO`)
   - Customer confirmation email with reference number
6. Customer is redirected to **`/rfq/confirmation`** with reference number and next steps.

**Supported file types:** PDF, PNG, JPG, DWG, DXF, STEP, STP, X_T, SLDPRT, SLDASM, ZIP (max 5 files, 20 MB each).

---

## Admin Workflow Summary

1. Admin signs in at **`/admin/login`** (Supabase Auth + `admin_profiles` check).
2. **RFQ Dashboard** (`/admin/rfqs`) lists incoming requests with filters, search, and detail panel.
3. Admin reviews uploaded files via signed download URLs, updates internal status, adds notes, and manages public customer-facing status.
4. Admin generates quote email drafts, records manual sends, and tracks follow-up reminders.
5. Admin can request additional customer information; customer receives a secure token link.
6. **Operations Command Center** and **Production Readiness Audit** support launch monitoring and QA.

---

## Customer Status Lookup Summary

- Public page: **`/rfq/status`**
- Customer enters **reference number** + **email** used on the RFQ.
- Edge Function **`public-rfq-status-lookup`** validates the match and returns a safe, customer-facing status label and message.
- Lookup attempts are logged in `rfq_customer_status_lookup_events` (admin-visible).
- No authentication required; no private file or internal data exposed.

**Public status values:** received, under_review, additional_info_needed, quote_in_progress, quote_sent, completed, closed.

---

## Additional Information Upload Summary

1. Admin creates an additional-info request from the RFQ detail panel (Customer Updates tab).
2. Edge Function **`send-additional-info-request`** emails the customer a secure link.
3. Customer opens **`/rfq/additional-info/:token`** — token validated by **`validate-additional-info-token`**.
4. Customer uploads revised files via **`create-additional-info-upload-session`** and submits through **`finalize-additional-info-submission`**.
5. Admin sees re-uploaded files and submission history in the RFQ detail panel.

Token links expire per request configuration; expired tokens show a dedicated message to the customer.

---

## Email Workflow Summary

All outbound email is sent through **Resend** via Supabase Edge Functions.

| Email | Trigger | Edge Function |
|---|---|---|
| Internal RFQ notification | New RFQ submitted | `send-rfq-notification` |
| Customer confirmation | New RFQ submitted | `send-rfq-notification` |
| Customer status update | Admin sends status email | `send-customer-status-update` |
| Additional info request | Admin requests files/info | `send-additional-info-request` |

**Required secrets:** `RESEND_API_KEY`, `RFQ_FROM_EMAIL`, `RFQ_REPLY_TO`, `RFQ_NOTIFICATION_TO`, `PUBLIC_SITE_URL`.

Quote emails are drafted in admin and sent manually (tracked in `rfq_manual_send_events`); they are not auto-sent by the platform.

---

## Security Summary

| Control | Implementation |
|---|---|
| **Row Level Security** | Enabled on all RFQ, admin, readiness, and launch checklist tables |
| **Anonymous access** | Insert-only on RFQ submission; no public read of RFQ data |
| **Admin access** | Supabase Auth + `admin_profiles` with `is_admin()` RLS helper |
| **File storage** | Private `rfq-files` bucket; admin downloads via signed URLs only |
| **Service role** | Edge Functions only — never exposed in frontend env vars |
| **Token routes** | Additional-info links use single-use/time-limited tokens |
| **Admin routes** | Protected by `ProtectedAdminRoute`; redirect to login when logged out |
| **SEO / indexing** | Admin and sensitive routes excluded from sitemap; `noindex` on admin pages |

---

## Launch Decision

| Decision | Status |
|---|---|
| **Go** | ☐ |
| **Conditional Go** | ☐ |
| **No-Go** | ☑ |

**Current status:** **No-Go** — see [`LAUNCH_GO_NO_GO_REVIEW.md`](./LAUNCH_GO_NO_GO_REVIEW.md) for executive criteria and blockers.

**Critical items before public launch:**

- Resolve anonymous RFQ submission (RLS)
- Configure `RESEND_API_KEY` and verify email delivery
- Seed at least one active admin user
- Connect custom domain to Vercel
- Complete end-to-end workflow test

---

## Support Contact

| Channel | Contact |
|---|---|
| **Phone** | (630) 543-3386 |
| **Email** | info@kcdesignmfg.com |
| **Address** | 422 S. Irmen Drive, Addison, IL 60101 |
| **Technical / deployment** | Engineering team via repository issues or internal escalation |

---

## Related Documentation

- [`HANDOFF_NOTES.md`](./HANDOFF_NOTES.md) — technical handoff for maintainers
- [`POST_LAUNCH_MONITORING_PLAN.md`](./POST_LAUNCH_MONITORING_PLAN.md) — 24-hour and 7-day monitoring
- [`ADMIN_USER_GUIDE.md`](./ADMIN_USER_GUIDE.md) — admin user instructions
- [`LAUNCH_GO_NO_GO_REVIEW.md`](./LAUNCH_GO_NO_GO_REVIEW.md) — executive launch decision
- [`PRODUCTION_LAUNCH_CHECKLIST.md`](./PRODUCTION_LAUNCH_CHECKLIST.md) — deployment checklist
- [`PRODUCTION_DEPLOYMENT_VALIDATION.md`](./PRODUCTION_DEPLOYMENT_VALIDATION.md) — validation report

**Admin Handoff Center:** `/admin/handoff`
