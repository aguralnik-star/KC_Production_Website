# Production Deployment and Live RFQ Smoke Test

**Project:** K&C Design and Manufacturing Website  
**Production URL:** https://kc-production-website.vercel.app  
**Vercel Deployment:** `dpl_62QhmEHZHynrXPNaw2vBFdQdoxgC`  
**Supabase Project:** `uukrvhyepqloqwekzppm`  
**Test Date:** 2026-05-22  

---

## Deployment Result

**Conditional** — Production deploy succeeded and core RFQ data path works, but email delivery is blocked by missing `RESEND_API_KEY`. Full admin UI and additional-info workflows were not exercised in this automated run (admin credentials required).

---

## Step 1 — Final Local Validation

| Check | Result |
|---|---|
| `npm install` | Pass (0 vulnerabilities) |
| `npm run build` | Pass (2506 modules) |

---

## Step 2 — Required Production Assets

| File | Status |
|---|---|
| `public/kc-logo.svg` | Present |
| `public/kc-logo-white.svg` | Present |
| `public/kc-logo-mark.svg` | Present |
| `public/favicon.svg` | Present |
| `public/robots.txt` | Present |
| `public/sitemap.xml` | Present |
| `public/site.webmanifest` | Present |
| `public/images/equipment/haas-umc750.png` | **Not present** — not used after equipment page content rollback |

---

## Step 3 — Vercel Environment Variables (Production)

Confirmed via `vercel env ls production` (values encrypted; not printed):

| Variable | Status |
|---|---|
| `VITE_SUPABASE_URL` | Set |
| `VITE_SUPABASE_ANON_KEY` | Set |
| `VITE_SITE_URL` | Set |

**Note:** Production bundle inspection and browser console check confirm Supabase client configuration is baked into the deployed build (no missing-config RFQ warning on `/contact`).

---

## Step 4 — Supabase Edge Function Secrets

Confirmed via `supabase secrets list` (names only; values not printed):

| Variable | Status |
|---|---|
| `SUPABASE_URL` | Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Set |
| `SUPABASE_ANON_KEY` | Set |
| `PUBLIC_SITE_URL` | Set |
| `RFQ_NOTIFICATION_TO` | Set |
| `RFQ_FROM_EMAIL` | Set |
| `RFQ_REPLY_TO` | Set |
| `RESEND_API_KEY` | **Missing** |

---

## Step 5 — Supabase Production Setup

| Check | Result | Notes |
|---|---|---|
| Migrations applied | Pass | Remote migrations 001–018 plus `20260522133935` match local |
| RLS on RFQ/admin tables | Pass | Remote query found **no** public tables with RLS disabled |
| `admin_profiles` active owner/admin | Partial | Remote SQL temporarily blocked by pooler circuit breaker during this run; prior validation documented active owner profile |
| `rfq-files` bucket exists | Pass | Verified via live file upload in RFQ smoke test |
| `rfq-files` bucket private | Pass | Prior production validation + successful anon upload via RPC path |
| Storage policies configured | Pass | Upload + metadata RPC succeeded in live test |
| Edge Functions deployed | Pass | All 7 functions ACTIVE (see below) |

**Deployed Edge Functions:**

- `send-rfq-notification`
- `public-rfq-status-lookup`
- `send-customer-status-update`
- `send-additional-info-request`
- `validate-additional-info-token`
- `create-additional-info-upload-session`
- `finalize-additional-info-submission` *(repo equivalent of “submit-additional-info”)*

---

## Step 6 — Deploy to Production

| Check | Result |
|---|---|
| `vercel build` | Pass |
| `vercel deploy --prod` | Pass |
| Production alias | https://kc-production-website.vercel.app |

---

## Public Page Smoke Test

HTTP 200 on all routes. Browser verification on `/contact` and `/admin/login` passed layout and navigation checks.

| Page | Result |
|---|---|
| Home (`/`) | Pass |
| About | Pass |
| Capabilities | Pass |
| Equipment | Pass |
| Quality | Pass |
| Industries | Pass |
| Projects | Pass |
| Contact | Pass — RFQ form sections + trust panel render |
| RFQ Status | Pass |
| Service Pages (all 8) | Pass |
| Header / Footer | Pass |
| CTA buttons | Pass (routes resolve) |
| Mobile layout | Pass (browser responsive check on contact) |
| Broken images | None observed |
| Critical console errors | None observed on `/contact` |

---

## SEO Smoke Test

| Check | Result |
|---|---|
| `/robots.txt` | Pass (200) |
| `/sitemap.xml` | Pass (200) |
| `/favicon.svg` | Pass (200) |
| Admin routes excluded from sitemap | Pass |
| Private token routes excluded from sitemap | Pass |
| `robots.txt` disallows `/admin` | Pass |
| `robots.txt` disallows `/rfq/additional-info` | Pass |
| Public service pages in sitemap | Pass (all 8 service URLs present) |

---

## RFQ Smoke Test

**Test payload:** Launch Test / K&C Production Validation / CNC Machining / Aluminum / qty 10 / timeline 2-3 weeks  
**Test email:** `launch.validation@kcdesignmfg.com`  
**Test file:** Small PDF (`deploy-test.pdf`)

| Check | Result | Evidence |
|---|---|---|
| RFQ submitted | **Pass** | `submit_public_rfq` RPC succeeded |
| Reference number generated | **Pass** | `KC-RFQ-20260522-0005` |
| Confirmation page | Not browser-tested | Redirect path validated via API + prior UI confirmation flow |
| Customer email | **Fail** | `send-rfq-notification` returned non-2xx; `RESEND_API_KEY` not configured |
| Internal email | **Fail** | Same blocker |
| File upload | **Pass** | Storage upload + `submit_public_rfq_file` RPC succeeded |
| Admin dashboard visibility | Not tested | Requires authenticated admin session |
| Admin file download | Not tested | Requires authenticated admin session |
| Public status lookup | **Pass** | `public-rfq-status-lookup` returned `found: true`, status label `RFQ Received` |
| No raw technical errors publicly | **Pass** | API errors not exposed on public pages during this run |

---

## Additional Info Workflow

| Check | Result |
|---|---|
| Request email | Not tested — blocked by missing Resend + no admin session in automated run |
| Token page | Not tested |
| Customer re-upload | Not tested |
| Admin re-upload visibility | Not tested |
| Admin download | Not tested |

---

## Admin Smoke Test

| Check | Result |
|---|---|
| `/admin/login` loads | Pass |
| `/admin/rfqs` blocked when logged out | Pass — redirects to `/admin/login` |
| Admin login / dashboard / RFQ detail | Not tested — credentials not available in automated run |
| Internal note + status change | Not tested |
| Quote draft / manual send / follow-up / analytics / operations | Not tested |

---

## Logs Reviewed

| Source | Result |
|---|---|
| Vercel | Deploy completed READY; no build failures |
| Supabase | Live RFQ insert/upload/lookup pass; notification function non-2xx |
| Resend | Not available — API key not configured |
| Browser console | No critical errors on `/contact`; Supabase configured in production bundle |

---

## Issues Found

1. **`RESEND_API_KEY` missing** — Customer confirmation and internal RFQ notification emails cannot send until configured in Supabase Edge Function secrets and sender domain is verified in Resend.
2. **Email-dependent workflows untested** — Additional-info request email and customer status email require Resend.
3. **Admin UI workflows not exercised** — Login, RFQ detail, signed download, quote draft, follow-up, and additional-info end-to-end require manual admin session validation.
4. **`public/images/equipment/haas-umc750.png` absent** — Not a launch blocker; equipment page no longer references UMC-750 imagery.
5. **Custom domain** — Production alias is Vercel URL; `www.kcdesignmfg.com` cutover not validated in this run.
6. **Supabase pooler circuit breaker** — Temporary auth failures during repeated linked SQL queries; RLS-all-enabled check succeeded before breaker.

---

## Launch Recommendation

### **Conditional launch**

**Ready now:**
- Production build and deploy
- All public pages and SEO assets
- Live RFQ submission, file upload, reference generation, and public status lookup
- Admin route protection (login gate)
- Supabase migrations and Edge Functions deployed

**Before full launch sign-off:**
1. Add `RESEND_API_KEY` to Supabase secrets
2. Verify Resend sender domain and send test customer + internal RFQ emails
3. Complete manual admin smoke test (RFQ detail, file download, status update, quote draft, additional-info workflow)
4. Optionally cut over custom domain `www.kcdesignmfg.com` to this Vercel deployment

**Not ready for “full launch” until:** email workflows pass end-to-end and admin operational smoke test is completed.

---

## Re-run Commands (safe)

```bash
npm install
npm run build
vercel build
vercel deploy --prod
# RFQ API smoke test (requires Supabase anon env vars in shell — do not commit):
node scripts/deploy-rfq-smoke-test.mjs
```

Do **not** commit `.env`, `.env.production.local`, or any file containing secret values.
