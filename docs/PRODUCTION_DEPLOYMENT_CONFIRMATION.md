# Production Deployment Confirmation

**Project:** K&C Design and Manufacturing Website  
**Production URL:** https://kc-production-website.vercel.app  
**Deployment Date:** 2026-05-22  
**Vercel Deployment:** `dpl_B3a3G1Yu1LVx4Xw5UfAz73JwzpXn`  
**Supabase Project:** `uukrvhyepqloqwekzppm`  
**Deployment Status:** Successful (with email delivery blocker)

---

## Validation Results

| Check | Result | Notes |
|---|---|---|
| Build passed | Yes | `npm install` + `npm run build` succeeded locally and on Vercel |
| Vercel deployment passed | Yes | Production alias updated to https://kc-production-website.vercel.app |
| Public pages verified | Yes | `/`, `/about`, `/capabilities`, `/equipment`, `/quality`, `/industries`, `/contact`, `/rfq/status` return HTTP 200 |
| Equipment page verified | Yes | Accurate K&C equipment content (VF-2, VF-3, ST-10, inspection, gauging, Mastercam). No UMC-750 hero/gallery (removed per content rollback) |
| RFQ form verified | Yes | Production API test created `KC-RFQ-20260522-0004` with PDF upload |
| Customer confirmation email verified | No | `RESEND_API_KEY` not configured in Supabase Edge Function secrets |
| Internal email verified | No | Blocked by missing `RESEND_API_KEY` |
| Admin login verified | Yes | `/admin/login` loads; unauthenticated `/admin/rfq` requires login |
| Admin RFQ dashboard verified | Partial | Test RFQ visible in database; UI login/download not exercised in this run |
| RFQ file upload verified | Yes | `deploy-test.pdf` uploaded to private `rfq-files` bucket; metadata stored in `rfq_files` |
| Public RFQ lookup verified | Yes | `public-rfq-status-lookup` returns `found: true` for `KC-RFQ-20260522-0004` |
| Supabase RLS verified | Yes | RLS enabled on all 16 RFQ/admin public tables |
| Storage bucket private | Yes | `rfq-files` bucket exists with `public = false` |
| Edge Functions deployed | Yes | 7 functions ACTIVE (see below) |

---

## Step 1 — Required Files

| File | Status |
|---|---|
| `public/kc-logo.svg` | Present |
| `public/kc-logo-white.svg` | Present |
| `public/kc-logo-mark.svg` | Present |
| `public/favicon.svg` | Present |
| `public/images/equipment/haas-umc750.png` | **Missing** — not used after equipment page rollback; no placeholder created |
| `public/robots.txt` | Present |
| `public/sitemap.xml` | Present |
| `public/site.webmanifest` | Present |

---

## Step 2 — Environment Variables

### Frontend / Vercel (Production)

| Variable | Status |
|---|---|
| `VITE_SUPABASE_URL` | Set |
| `VITE_SUPABASE_ANON_KEY` | Set |
| `VITE_SITE_URL` | Set |

Local `.env` / `.env.local`: not present (expected for CI/Vercel-only deploy).

### Supabase Edge Function Secrets

| Variable | Status |
|---|---|
| `SUPABASE_URL` | Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Set |
| `RESEND_API_KEY` | **Missing** |
| `RFQ_NOTIFICATION_TO` | Set |
| `RFQ_FROM_EMAIL` | Set |
| `RFQ_REPLY_TO` | Set |
| `PUBLIC_SITE_URL` | Set |

---

## Step 3 — Build

```
npm install  → PASS (0 vulnerabilities)
npm run build → PASS (2446 modules)
```

---

## Step 4 — Local Preview Routes

All routes returned HTTP 200 on `http://127.0.0.1:4173`:

`/`, `/about`, `/capabilities`, `/equipment`, `/quality`, `/industries`, `/contact`, `/rfq/status`, `/admin/login`

---

## Step 5 — Vercel Production Deploy

```
vercel build        → PASS
vercel deploy --prod → PASS
```

**Production URL:** https://kc-production-website.vercel.app

---

## Step 6 — Post-Deployment Smoke Test

| Check | Result |
|---|---|
| Home loads | Pass |
| Equipment page loads | Pass (accurate content, no representative Haas gallery) |
| Capabilities page loads | Pass |
| Contact/RFQ page loads | Pass |
| RFQ status lookup page loads | Pass |
| `/admin/login` loads | Pass |
| Admin routes require login | Pass (client-side guard) |
| `/robots.txt` | Pass (200) |
| `/sitemap.xml` | Pass (200) |
| `/favicon.svg` | Pass (200) |

---

## Step 7 — Supabase Production Validation

### Migrations

Applied remotely: `001`–`018` plus `20260522133935` (all local migrations match remote).

### RLS

RLS enabled (`rowsecurity = true`) on: `admin_profiles`, `launch_checklist_items`, and all `rfq_*` tables (14 tables).

### Admin profiles

| Email | Role | Active |
|---|---|---|
| aguralnik@gmail.com | owner | true |

### Storage

| Bucket | Public |
|---|---|
| `rfq-files` | false (private) |

### Edge Functions (ACTIVE)

| Function | Status |
|---|---|
| `send-rfq-notification` | ACTIVE |
| `public-rfq-status-lookup` | ACTIVE |
| `send-customer-status-update` | ACTIVE |
| `send-additional-info-request` | ACTIVE |
| `validate-additional-info-token` | ACTIVE |
| `create-additional-info-upload-session` | ACTIVE |
| `finalize-additional-info-submission` | ACTIVE |

Note: `submit-additional-info` is not a separate deployed function; submission is handled by `finalize-additional-info-submission`.

---

## Step 8 — End-to-End Production RFQ Test

**Test RFQ:** `KC-RFQ-20260522-0004`  
**RFQ ID:** `cbe253b5-dd62-45a0-884a-2552c2ff10b8`

| Field | Value |
|---|---|
| Name | Launch Test |
| Company | K&C Production Validation |
| Email | launch.validation@kcdesignmfg.com |
| Project Type | CNC Machining |
| Material | Aluminum |
| Quantity | 10 |
| Timeline | 2-3 weeks |
| Notes | Production deployment validation test |
| Attachment | `deploy-test.pdf` |

| Verification | Result |
|---|---|
| RFQ submits successfully | Pass |
| Reference number generated | Pass |
| Confirmation page | Not browser-tested (API path verified) |
| Customer confirmation email | Fail — no Resend key |
| Internal notification email | Fail — no Resend key |
| Admin dashboard shows RFQ | Pass (database) |
| Uploaded file linked | Pass |
| Admin file download | Not tested (UI login required) |
| Public RFQ status lookup | Pass |

Re-run smoke test locally:

```bash
# Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in environment
node scripts/deploy-rfq-smoke-test.mjs
```

---

## Known Issues

1. **`RESEND_API_KEY` missing** — customer and internal RFQ emails will not send until configured in Supabase Edge Function secrets.
2. **`public/images/equipment/haas-umc750.png` missing** — intentional; equipment page uses text cards only after content rollback.
3. **Custom domain not cut over** — `www.kcdesignmfg.com` still serves legacy site; Vercel production is on `kc-production-website.vercel.app`.
4. **Admin UI login and file download** — not manually verified in this deployment run (database and storage layers confirmed).

---

## Final Recommendation

**Not ready for full public launch** until `RESEND_API_KEY` is configured and email delivery is retested.

The site is **deployed and operational** for public browsing, RFQ submission, file upload, status lookup, and admin data access. Configure Resend, verify admin UI login, and cut over DNS when ready.

---

*Validated 2026-05-22.*
