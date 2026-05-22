# Post-Launch Support Plan

**K&C Design and Manufacturing Website**

---

## First 24 Hours

Complete immediately after production launch or domain cutover:

| # | Task | Owner |
|---|------|-------|
| 1 | Check production site loads at https://www.kcdesignmfg.com | Owner / Admin |
| 2 | Submit test RFQ with contact info and at least one file | Admin |
| 3 | Verify internal notification email received by K&C | Admin |
| 4 | Verify customer confirmation email received | Admin |
| 5 | Verify file upload and admin download | Admin |
| 6 | Verify admin login and RFQ appears in dashboard | Admin |
| 7 | Check Supabase and Vercel logs for errors | Technical |

**Success criteria:** Test RFQ visible in admin, both emails delivered, file downloadable, no critical errors in logs.

---

## First 7 Days

Monitor daily during the first week:

| # | Task | Frequency |
|---|------|-----------|
| 1 | Monitor incoming RFQs — review and respond promptly | Daily |
| 2 | Monitor GA4 analytics and RFQ conversion events | Daily |
| 3 | Monitor email delivery failures in operations dashboard | Daily |
| 4 | Review customer questions and RFQ submission quality | Daily |
| 5 | Review RFQ conversion rate (form starts vs submissions) | End of week |
| 6 | Complete mobile/browser QA spot checks on key pages | Mid-week |
| 7 | Review post-launch dashboard at `/admin/post-launch` | Daily |

Use `/admin/owner-handoff` post-launch checklist to track completion.

---

## First 30 Days

Complete during the first month:

| # | Task | Target |
|---|------|--------|
| 1 | Add real facility and equipment photos | Week 2–4 |
| 2 | Improve project showcase with approved examples | Week 2–4 |
| 3 | Review SEO ranking in Google Search Console | Week 3–4 |
| 4 | Add approved customer testimonials (replace representative) | When available |
| 5 | Review RFQ form — adjust fields or guidance if needed | Week 4 |
| 6 | Run full Content QA audit | Week 4 |
| 7 | Executive review of analytics and RFQ pipeline | End of month |

---

## Monitoring Tools

| Tool | Route / Location |
|------|------------------|
| Post-Launch Dashboard | `/admin/post-launch` |
| Operations Command Center | `/admin/rfq-operations` |
| Analytics | `/admin/rfq-operations#analytics` |
| Content QA | `/admin/content-qa` |
| Owner Handoff | `/admin/owner-handoff` |

---

## Escalation Contacts

| Issue | Contact |
|-------|---------|
| Website / RFQ technical issues | Website administrator |
| Email delivery | Website administrator + Resend dashboard |
| Content updates | K&C marketing / owner |
| Admin access | Website administrator |

**K&C:** info@kcdesignmfg.com · (630) 543-3386

---

## Related Documentation

- [FINAL_PRODUCTION_LAUNCH_PACKAGE.md](./FINAL_PRODUCTION_LAUNCH_PACKAGE.md)
- [POST_LAUNCH_7_DAY_MONITORING_PLAN.md](./POST_LAUNCH_7_DAY_MONITORING_PLAN.md)
- [WEBSITE_MAINTENANCE_PLAN.md](./WEBSITE_MAINTENANCE_PLAN.md)
