# Production Go-Live Runbook

**Project:** K&C Design and Manufacturing Website  
**Launch Date:** 2026-05-22  
**Production URL:** https://www.kcdesignmfg.com

---

## Deployment Confirmation

Before launch approval, confirm:

- [ ] Latest production build deployed to Vercel
- [ ] Environment variables configured (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, Edge Function secrets)
- [ ] `RESEND_API_KEY` configured for customer and internal email delivery
- [ ] Supabase migrations applied through latest version
- [ ] Admin profiles seeded and RBAC verified
- [ ] DNS pointed to production hosting
- [ ] SSL certificate active and valid

---

## Launch Checklist (Phase 1 — Launch Validation)

| Item | Verified | Notes |
|------|----------|-------|
| Production URL accessible | ☐ | |
| SSL certificate active | ☐ | |
| Homepage verified | ☐ | |
| Capabilities page verified | ☐ | |
| Equipment page verified | ☐ | |
| Quality page verified | ☐ | |
| Industries page verified | ☐ | |
| Projects page verified | ☐ | |
| Contact page verified | ☐ | |
| RFQ Status Lookup verified | ☐ | |
| Service pages verified | ☐ | |
| Analytics verified | ☐ | |
| Search Console verified | ☐ | |
| Clarity verified | ☐ | |

Use the **Go-Live Command Center** at `/admin/go-live` to track checklist completion.

---

## RFQ Validation Checklist (Phase 2 — RFQ Workflow Validation)

| Item | Verified | Notes |
|------|----------|-------|
| RFQ form loads | ☐ | |
| File upload works | ☐ | |
| Reference number generated | ☐ | |
| Customer confirmation email received | ☐ | |
| Internal notification received | ☐ | |
| Admin dashboard displays RFQ | ☐ | |
| File download works | ☐ | |
| Status update works | ☐ | |
| Follow-up creation works | ☐ | |
| Additional info request works | ☐ | |
| Customer re-upload works | ☐ | |
| Analytics events recorded | ☐ | |

Submit one controlled smoke-test RFQ before approving launch.

---

## Analytics Validation

- [ ] GA4 property receiving page views on production domain
- [ ] RFQ form start, step, and submit events firing
- [ ] Conversion events visible in GA4 DebugView or Realtime
- [ ] Microsoft Clarity recording sessions on production
- [ ] Search Console property verified and sitemap submitted

---

## Email Validation

- [ ] Customer confirmation email delivered after RFQ submission
- [ ] Internal admin notification delivered
- [ ] Status update emails deliver when status changes
- [ ] Additional info request emails deliver with valid upload link
- [ ] Resend dashboard shows no delivery failures for test submissions

---

## Storage Validation

- [ ] RFQ files upload to Supabase Storage bucket
- [ ] Admin can download uploaded files via signed URLs
- [ ] Customer re-upload via additional-info token works
- [ ] Storage bucket RLS policies allow authenticated admin access

---

## Admin Validation

- [ ] Admin login works at `/admin/login`
- [ ] RFQ dashboard loads at `/admin/rfqs`
- [ ] Operations command center loads at `/admin/rfq-operations`
- [ ] Go-Live Command Center loads at `/admin/go-live`
- [ ] Status updates persist and reflect on customer status lookup
- [ ] Follow-up reminders visible in admin

---

## Launch Approval

Launch is approved when:

1. All Phase 1 and Phase 2 checklist items are verified
2. Smoke-test RFQ completed end-to-end without errors
3. No CRITICAL or HIGH severity open issues
4. Owner / operations lead signs off in Go-Live Command Center

**Approved by:** ___________________________  
**Date:** ___________________________

---

## Related Documents

- [First RFQ Monitoring Plan](./FIRST_RFQ_MONITORING_PLAN.md)
- [First 30 Day Operations Plan](./FIRST_30_DAY_OPERATIONS_PLAN.md)
- [Go-Live Issue Response Playbook](./GO_LIVE_ISSUE_RESPONSE_PLAYBOOK.md)
