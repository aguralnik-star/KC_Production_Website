# Go-Live Issue Response Playbook

**Project:** K&C Design and Manufacturing Website

---

## Issue Severity Levels

| Level | Examples | Response Time |
|-------|----------|---------------|
| **LOW** | Minor styling issue | Add to backlog |
| **MEDIUM** | Analytics event not tracking | Resolve within 72 hours |
| **HIGH** | Customer email failed | Resolve within same business day |
| **CRITICAL** | RFQ submission failure, storage upload failure, admin access failure, production outage | Immediate investigation |

Log all issues in the Go-Live Command Center (`/admin/go-live`) or Post-Launch Dashboard (`/admin/post-launch`).

---

## Issue: RFQ Submission Failure

**Severity:** CRITICAL

**Response:**

1. Disable or banner the affected workflow if submissions are failing consistently
2. Investigate browser console errors and network requests
3. Check Supabase logs for insert failures on `rfq_requests`
4. Verify Edge Functions for RFQ processing are deployed and healthy
5. Test submission in staging or with controlled smoke test after fix
6. Notify operations lead immediately

---

## Issue: Customer Confirmation Email Failure

**Severity:** HIGH (CRITICAL if all emails failing)

**Response:**

1. Review Resend dashboard for delivery failures and bounce reasons
2. Verify Edge Function execution logs for email send handler
3. Confirm `RESEND_API_KEY` is set in production environment
4. Verify sender domain DNS (SPF, DKIM) is configured
5. Manually confirm RFQ record exists and contact customer if needed
6. Re-test with smoke submission after fix

---

## Issue: File Upload Failure

**Severity:** CRITICAL

**Response:**

1. Review browser network tab for storage upload errors
2. Verify Supabase Storage bucket permissions and RLS policies
3. Check file size limits and allowed MIME types
4. Review upload logs in Supabase dashboard
5. Test upload with sample file after fix
6. Contact customer to re-submit if RFQ was created without files

---

## Issue: Status Lookup Failure

**Severity:** HIGH

**Response:**

1. Verify status lookup page loads at `/rfq/status`
2. Test lookup with known reference number
3. Check database access and RLS for public lookup function
4. Review failed lookup events in operations dashboard
5. Verify Edge Function or RPC used for lookup is deployed

---

## Issue: Analytics Outage

**Severity:** MEDIUM

**Response:**

1. Verify GA4 measurement ID in production environment variables
2. Confirm gtag script loads on public pages (Network tab)
3. Verify Microsoft Clarity project ID and script injection
4. Test key events: page view, RFQ form start, RFQ submit
5. Check for ad blockers or CSP blocking scripts
6. Document gap period; analytics data cannot be backfilled

---

## Issue: Production Page Unavailable

**Severity:** CRITICAL

**Response:**

1. Check Vercel deployment status and latest build
2. Review deployment logs for build or runtime errors
3. Verify DNS resolution to correct hosting
4. Roll back to last known good deployment if required
5. Communicate outage to stakeholders
6. Post-incident: document root cause and prevention steps

---

## Escalation Matrix

| Severity | Action |
|----------|--------|
| CRITICAL | Immediate investigation — stop launch activities if customer-facing workflows are broken |
| HIGH | Resolve within same business day — assign owner in issue tracker |
| MEDIUM | Resolve within 72 hours — schedule fix in current sprint |
| LOW | Add to backlog — no launch blocker |

---

## Post-Resolution

1. Mark issue resolved in admin dashboard
2. Add resolution notes
3. Verify fix in production
4. Update runbook if new failure mode discovered
