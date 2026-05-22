# Post-Launch 7-Day Monitoring Plan

K&C Design and Manufacturing — first week after public launch.

**Dashboard:** `/admin/post-launch`  
**Launch date reference:** May 22, 2026  
**Owner:** Admin / operations lead

---

## Overview

This plan defines daily monitoring activities for the first seven days after launch. Use the Post-Launch Monitoring dashboard to track RFQ volume, conversion, email delivery, open issues, and daily review notes.

---

## Day 1 — Infrastructure Validation

**Focus:** Confirm core RFQ infrastructure is working end-to-end.

### Checklist
- [ ] Verify RFQ submissions appear in `/admin/rfqs`
- [ ] Verify customer confirmation emails send (or log failures)
- [ ] Verify admin notification emails / alerts
- [ ] Review Supabase logs and Vercel deployment logs
- [ ] Confirm public status lookup works at `/rfq/status`
- [ ] Log any blockers in the Issue Tracker

### Success Criteria
- At least one test RFQ completes successfully
- No critical email delivery failures without a documented workaround
- Admin dashboard loads KPI and funnel data

---

## Day 2 — Traffic Review

**Focus:** Understand initial visitor patterns and entry pages.

### Checklist
- [ ] Review traffic summary (analytics or hosting metrics)
- [ ] Review RFQ quality — complete fields, file uploads, company info
- [ ] Review page engagement placeholders on dashboard
- [ ] Note top entry pages and bounce patterns
- [ ] Save Day 2 daily review in dashboard

### Success Criteria
- Traffic baseline documented
- RFQ submissions meet minimum quality bar

---

## Day 3 — RFQ Review

**Focus:** Conversion from visit to submitted RFQ.

### Checklist
- [ ] Review RFQ completion rate on dashboard
- [ ] Review CTA effectiveness (homepage, contact, service pages)
- [ ] Review customer questions and incomplete submissions
- [ ] Check abandonment rate and form friction points
- [ ] Save Day 3 daily review

### Success Criteria
- Completion rate trend understood
- At least one optimization idea captured

---

## Day 4 — Workflow Review

**Focus:** Quote response workflow and customer self-service.

### Checklist
- [ ] Review quote turnaround time (avg response time KPI)
- [ ] Review quote draft and send workflow in admin
- [ ] Review public status lookup usage
- [ ] Review additional info request flow
- [ ] Save Day 4 daily review

### Success Criteria
- Quote workflow bottlenecks identified
- Self-service usage documented

---

## Day 5 — SEO Review

**Focus:** Search visibility and service page performance.

### Checklist
- [ ] Review service page engagement (Page Performance section)
- [ ] Confirm sitemap and robots.txt are correct
- [ ] Check Google Search Console indexing (if connected)
- [ ] Review meta titles and h1 structure on key pages
- [ ] Save Day 5 daily review

### Success Criteria
- Service landing pages indexed or submitted
- SEO issues logged if found

---

## Day 6 — Issue Resolution Review

**Focus:** Close open launch-week issues and response times.

### Checklist
- [ ] Review all open issues in Issue Tracker
- [ ] Assign owners to unresolved items
- [ ] Review average response time KPI
- [ ] Resolve or escalate critical issues
- [ ] Save Day 6 daily review

### Success Criteria
- No unresolved critical issues without owner and target date
- Response time within agreed SLA or improvement plan documented

---

## Day 7 — Executive Summary

**Focus:** Compile Week 1 findings and Week 2 priorities.

### Checklist
- [ ] Prepare launch-week summary using `docs/WEEK_1_EXECUTIVE_SUMMARY.md`
- [ ] Identify optimization opportunities (see `docs/RFQ_CONVERSION_OPTIMIZATION_PLAN.md`)
- [ ] Review Recommendation Center on dashboard
- [ ] Save Day 7 daily review with overall status
- [ ] Share summary with stakeholders

### Success Criteria
- Week 1 executive summary completed
- Week 2 priorities defined with owners

---

## Daily Review Fields

Each day, record in the dashboard Daily Checklist:

| Field | Description |
|-------|-------------|
| Traffic summary | Sessions, top pages, notable changes |
| RFQ summary | Count, quality, notable submissions |
| Issues found | Bugs, UX friction, email failures |
| Actions taken | Fixes deployed, follow-ups scheduled |
| Overall status | `healthy`, `attention_needed`, or `critical` |

---

## Escalation

| Condition | Action |
|-----------|--------|
| Critical issue open | Pause paid traffic; assign owner immediately |
| Failed emails > 0 | Verify Resend API key and domain |
| RFQs = 0 for 48h | Review CTA placement and form accessibility |
| Abandonment > 50% | Simplify RFQ form; review required fields |

---

## Related Documents

- [RFQ Conversion Optimization Plan](./RFQ_CONVERSION_OPTIMIZATION_PLAN.md)
- [Week 1 Executive Summary Template](./WEEK_1_EXECUTIVE_SUMMARY.md)
- [Production Deployment and RFQ Smoke Test](./PRODUCTION_DEPLOYMENT_AND_RFQ_SMOKE_TEST.md)
