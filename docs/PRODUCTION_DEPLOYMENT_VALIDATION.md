# Production Deployment Validation Report

**Project:** K&C Design and Manufacturing Website  
**Date:** 2026-05-22  
**Supabase project:** `uukrvhyepqloqwekzppm`  
**Vercel project:** `kc-production-website`  
**Production URL (new React app):** https://kc-production-website.vercel.app  
**Legacy site (not yet replaced):** https://www.kcdesignmfg.com  

## Executive summary

| Area | Status | Notes |
|---|---|---|
| Local build | PASS | `npm install` + `npm run build` succeeded |
| Vercel deployment | PASS | Deployed to https://kc-production-website.vercel.app |
| Vercel env vars | PASS | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL` configured |
| Supabase migrations | PASS | 001–014 applied; migration history repaired for 009–013 |
| RLS enabled | PASS | All 16 public RFQ/admin tables have RLS enabled |
| Storage bucket | PASS | `rfq-files` exists and is private |
| Edge functions | PASS | 7 functions deployed and ACTIVE |
| Edge function secrets | PARTIAL | `RESEND_API_KEY` missing |
| Admin users | FAIL | 0 active owner/admin rows in `admin_profiles` |
| RFQ submission | FAIL | Anon REST/SQL insert still blocked by RLS after migrations `015`–`016`; admin SQL insert works |
| Full RFQ workflow | BLOCKED | Requires admin user + Resend + RLS fix retest |
| Public site checks | PASS | Routes, SEO, skip link, admin redirect verified on Vercel |
| Custom domain | PENDING | `www.kcdesignmfg.com` still serves legacy HTML site |

**Launch readiness:** Not Ready — resolve blockers below before go-live.

---

## 1. Local build

```
npm install   → PASS (0 vulnerabilities)
npm run build → PASS (2439 modules, code-split chunks)
```

---

## 2. Environment variables

### Vercel (Production)

| Variable | Status |
|---|---|
| `VITE_SUPABASE_URL` | Configured |
| `VITE_SUPABASE_ANON_KEY` | Configured |
| `VITE_SITE_URL` | Configured (`https://www.kcdesignmfg.com`) |

### Supabase Edge Function secrets

| Variable | Status |
|---|---|
| `SUPABASE_URL` | Present (auto) |
| `SUPABASE_SERVICE_ROLE_KEY` | Present (auto) |
| `SUPABASE_ANON_KEY` | Present (auto) |
| `PUBLIC_SITE_URL` | Configured |
| `RFQ_NOTIFICATION_TO` | Configured (`info@kcdesignmfg.com`) |
| `RFQ_FROM_EMAIL` | Configured |
| `RFQ_REPLY_TO` | Configured |
| `RESEND_API_KEY` | **Missing — required for all email workflows** |

---

## 3. Supabase database

### Migrations

All migrations applied remotely:

`001`, `002`, `004`, `005`, `007`, `008`, `009`, `010`, `011`, `012`, `013`, `014`

Note: migrations `009`–`013` were partially present before history repair; `014`–`015` applied cleanly. Apply `016_fix_anon_rfq_insert_trigger.sql` next.

### RLS

All RFQ/admin tables have `rowsecurity = true`:

- `admin_profiles`, `launch_checklist_items`, `rfq_*` tables (14 RFQ-related tables)

### Admin users

```sql
SELECT count(*) FROM admin_profiles WHERE is_active = true AND role IN ('owner','admin');
-- Result: 0
```

**Action required:** Create Supabase Auth user, then:

```sql
insert into public.admin_profiles (id, email, role, is_active)
values ('AUTH_USER_UUID', 'admin@example.com', 'owner', true);
```

### Storage

| Bucket | Public |
|---|---|
| `rfq-files` | `false` (private) |

---

## 4. Supabase Edge Functions

All deployed and ACTIVE:

| Function | Status |
|---|---|
| `send-rfq-notification` | ACTIVE |
| `public-rfq-status-lookup` | ACTIVE |
| `send-customer-status-update` | ACTIVE |
| `send-additional-info-request` | ACTIVE |
| `validate-additional-info-token` | ACTIVE |
| `create-additional-info-upload-session` | ACTIVE |
| `finalize-additional-info-submission` | ACTIVE |

Note: User checklist referenced `submit-additional-info`; codebase uses `finalize-additional-info-submission`.

### Edge function smoke test

```
POST /functions/v1/public-rfq-status-lookup
→ 200 {"found":false,"message":"We could not locate an RFQ..."}
```

---

## 5. Production workflow test

| Step | Status | Notes |
|---|---|---|
| Submit RFQ form | FAIL | RLS blocked anon insert (`42501`) |
| Upload test PDF | Not tested | Blocked by insert failure |
| Reference number generated | Not tested | |
| Confirmation page | Not tested | |
| Internal email | Not tested | Requires `RESEND_API_KEY` |
| Customer confirmation email | Not tested | Requires `RESEND_API_KEY` |
| Admin dashboard | Not tested | No admin user |
| Admin file download | Not tested | No admin user |
| Public status lookup | PASS | Edge function returns RFQ `KC-RFQ-20260522-0001` (seeded via admin SQL) |
| Additional info request flow | Not tested | Requires admin + Resend |
| Quote draft / manual send | Not tested | Requires admin |
| Follow-up reminders | Not tested | Requires admin |
| Analytics / operations dashboard | Not tested | Requires admin |

**Fixes applied:**
- `015_restore_anon_rfq_insert_policies.sql` — recreates anon insert/upload policies
- `016_fix_anon_rfq_insert_trigger.sql` — security definer before-insert trigger + authenticated insert policy

---

## 6. Public site validation (Vercel)

**Base URL tested:** https://kc-production-website.vercel.app

| Route | HTTP | Client SEO (after hydration) |
|---|---|---|
| `/` | 200 | Default + LocalBusiness JSON-LD |
| `/about` | 200 | Page-specific title/description |
| `/capabilities` | 200 | Page-specific title/description |
| `/equipment` | 200 | Page-specific title/description |
| `/quality` | 200 | Page-specific title/description |
| `/industries` | 200 | Page-specific title/description |
| `/contact` | 200 | "Request a Quote \| K&C Design and Manufacturing" |
| `/rfq/status` | 200 | Status lookup page loads |
| `/admin/rfqs` (logged out) | Redirects to `/admin/login` | PASS |

### Static assets

| Asset | Status |
|---|---|
| `/robots.txt` | PASS — blocks `/admin`, `/rfq/additional-info` |
| `/sitemap.xml` | PASS — lists public routes (domain: `www.kcdesignmfg.com`) |
| `/site.webmanifest` | PASS |

### Accessibility / UX checks

- Skip-to-content link present
- No console errors on `/contact` after load
- Mobile nav button has accessible name ("Open menu")
- Footer navigation landmarks present

### Known gap

`www.kcdesignmfg.com` still serves the legacy static website, not the new React deployment. Point DNS/custom domain to Vercel project `kc-production-website` before launch.

---

## 7. Vercel deployment

```
vercel deploy --prod --yes
→ https://kc-production-website.vercel.app
```

Added `vercel.json` SPA rewrite for React Router.

Second production deploy run after env vars were added to Vercel.

---

## 8. Required actions before go-live

1. Apply migration `016`: `supabase db push`
2. Set `RESEND_API_KEY` in Supabase Edge Function secrets
3. Create admin Auth user + seed `admin_profiles`
4. Re-test full RFQ workflow end-to-end
5. Connect `www.kcdesignmfg.com` custom domain to Vercel
6. Complete `/admin/launch-checklist` items
7. Verify Resend sender domain (SPF/DKIM/DMARC)

---

## 9. Go / No-Go

**NO-GO** for public launch until:

- RFQ submission works (migration 015 + retest)
- Email delivery verified (Resend configured)
- At least one active admin user exists
- Custom domain points to new React deployment
