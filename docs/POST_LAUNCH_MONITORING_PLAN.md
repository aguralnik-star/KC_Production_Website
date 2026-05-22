# Post-Launch Monitoring Plan

**K&C Design and Manufacturing Website & RFQ Platform**  
**Audience:** Operations, engineering, and executive stakeholders

---

## Overview

This plan defines monitoring activities for the first **24 hours** and **7 days** after public launch. Assign owners before go-live and record results in `/admin/launch-checklist` and `/admin/launch-go-no-go`.

**Production URL:** `https://www.kcdesignmfg.com`  
**Interim URL:** `https://kc-production-website.vercel.app`

---

## First 24 Hours

Complete within the first business day after launch. Treat any critical failure as a **P1 incident**.

### 1. Check Vercel deployment health

| Action | Owner | Pass criteria |
|---|---|---|
| Open Vercel project dashboard | Engineering | Latest production deploy status **Ready** |
| Verify custom domain SSL | Engineering | HTTPS valid, no certificate warnings |
| Spot-check public routes | Operations | `/`, `/contact`, `/rfq/status` return 200 |
| Review Vercel runtime logs | Engineering | No spike in 5xx errors |

### 2. Check Supabase logs

| Action | Owner | Pass criteria |
|---|---|---|
| Review API logs | Engineering | No repeated RLS/auth errors |
| Review Edge Function logs | Engineering | Functions return 200 for test calls |
| Review Auth logs | Engineering | Admin login succeeds |

### 3. Submit test RFQ

| Action | Owner | Pass criteria |
|---|---|---|
| Submit RFQ on `/contact` with test PDF | Operations | Reference number generated |
| Confirm row in `rfq_requests` | Engineering | New row with correct email/status |
| Confirm redirect to confirmation page | Operations | `/rfq/confirmation` loads with reference |

### 4. Confirm internal notification

| Action | Owner | Pass criteria |
|---|---|---|
| Check `info@kcdesignmfg.com` inbox | Operations | Internal RFQ notification received |
| Verify RFQ details in email | Operations | Name, email, project summary, file count correct |

### 5. Confirm customer confirmation email

| Action | Owner | Pass criteria |
|---|---|---|
| Check test customer inbox | Operations | Confirmation email received |
| Verify reference number in email | Operations | Matches confirmation page |
| Check reply-to | Operations | Replies route to configured address |

### 6. Verify admin dashboard

| Action | Owner | Pass criteria |
|---|---|---|
| Log in at `/admin/login` | Operations | Dashboard loads |
| Locate test RFQ in list | Operations | RFQ visible with correct status |
| Open RFQ detail panel | Operations | All fields and tabs load |

### 7. Verify uploaded file download

| Action | Owner | Pass criteria |
|---|---|---|
| Download test file from RFQ detail | Operations | File opens correctly |
| Confirm file not publicly accessible | Engineering | Direct storage URL without signed token fails |

### 8. Verify public status lookup

| Action | Owner | Pass criteria |
|---|---|---|
| Visit `/rfq/status` | Operations | Form loads |
| Enter test reference + email | Operations | Status returned (e.g. “RFQ Received”) |
| Test wrong email | Operations | Safe “not found” message, no data leak |

---

## 24-Hour Escalation Thresholds

| Signal | Threshold | Response |
|---|---|---|
| RFQ submission failure | Any production failure | Engineering on-call immediately |
| Email delivery failure | Any failed send on test RFQ | Check Resend + Edge Function secrets |
| Admin login failure | Any admin unable to access | Verify `admin_profiles` + Auth |
| 5xx error rate | Sustained increase on Vercel | Roll back or hotfix deploy |
| Storage upload failure | Any customer unable to upload | Check bucket policies + RLS |

---

## First 7 Days

### 1. Monitor RFQ submissions

- Daily count of new `rfq_requests`
- Compare to historical inquiry volume (phone/email)
- Flag duplicate or spam submissions
- **Owner:** Operations

### 2. Monitor email failures

- Resend dashboard: bounces, complaints, failures
- Supabase Edge Function error logs for email functions
- **Owner:** Operations + Engineering

### 3. Monitor file upload errors

- Customer-reported upload issues
- Storage errors in Supabase logs
- Failed rows in `rfq_files` / upload sessions
- **Owner:** Engineering

### 4. Monitor public lookup attempts

- Review `rfq_customer_status_lookup_events`
- Watch for brute-force patterns (many failed lookups)
- **Owner:** Engineering

### 5. Review analytics dashboard

- Open `/admin/rfq-operations#analytics`
- Verify KPI charts load and reflect live data
- Confirm funnel counts match RFQ volume
- **Owner:** Operations

### 6. Review operations command center

- Open `/admin/rfq-operations`
- Check action queue, alerts, system health panel
- Resolve stale “needs attention” items daily
- **Owner:** Operations

### 7. Collect customer feedback

- Track phone/email comments about new site
- Note form usability issues or confusion
- Log requests for missing content
- **Owner:** Operations + Marketing

### 8. Check SEO indexing

- Google Search Console: sitemap submitted, pages indexed
- Verify `robots.txt` and `sitemap.xml` on production domain
- Confirm meta titles/descriptions in search results
- **Owner:** Marketing

---

## 7-Day Review Meeting Agenda

1. RFQ volume and conversion vs. baseline
2. Email deliverability summary
3. Open bugs / incidents from first week
4. Admin team feedback on dashboard workflows
5. Launch checklist completion percentage
6. Go/No-Go review update — confirm **Go** sustained
7. Backlog for post-launch improvements

---

## Monitoring Tools

| Tool | URL / location |
|---|---|
| Vercel Dashboard | vercel.com → `kc-production-website` |
| Supabase Dashboard | supabase.com → project `uukrvhyepqloqwekzppm` |
| Resend Dashboard | resend.com → emails / domains |
| Admin Handoff Center | `/admin/handoff` |
| Launch Checklist | `/admin/launch-checklist` |
| Go/No-Go Review | `/admin/launch-go-no-go` |

---

## Sign-off (7-day review)

| Role | Name | Date | Notes |
|---|---|---|---|
| Operations lead | | | |
| Engineering lead | | | |
| Executive sponsor | | | |
