# RFQ Conversion Optimization Plan

K&C Design and Manufacturing — post-launch conversion improvements.

**Dashboard:** `/admin/post-launch` (Recommendation Center)  
**Goal:** Increase RFQ submissions, improve completion rate, and shorten quote response time.

---

## Current Conversion Funnel

```
Visitors → RFQ Started → RFQ Submitted → Quoted → Won
```

The dashboard tracks each stage and surfaces deterministic recommendations when thresholds are exceeded.

---

## Optimization Opportunities

### 1. Stronger Homepage CTA

**Problem:** Low RFQ volume in first week (< 3 RFQs).  
**Actions:**
- Prominent "Request a Quote" above the fold
- Repeat CTA after capabilities and projects sections
- Use action-oriented copy: "Get a Quote in 24 Hours"

**Measure:** RFQs received (7-day KPI), homepage CTA clicks (when analytics connected)

---

### 2. Simplified RFQ Form

**Problem:** Abandonment rate > 50%.  
**Actions:**
- Reduce required fields to essentials for initial submission
- Improve section progress indicator visibility
- Add inline validation messages
- Strengthen draft autosave messaging

**Measure:** RFQ completion rate, abandonment rate on dashboard

---

### 3. Better File Upload UX

**Problem:** Incomplete submissions missing drawings or specs.  
**Actions:**
- Clear file type and size guidance
- Drag-and-drop with upload progress
- Optional "upload later" path with additional info request
- Preview uploaded file names before submit

**Measure:** Customer reuploads, additional info requests

---

### 4. Faster Quote Response

**Problem:** Quote turnaround > 3 days (72 hours).  
**Actions:**
- Daily admin queue review
- Quote draft templates for common part types
- SLA reminder for follow-up_needed status
- Assign quote owner on each new RFQ

**Measure:** Average response time KPI, quote conversion rate

---

### 5. More Project Examples

**Problem:** Visitors hesitate without proof of capability.  
**Actions:**
- Add 2–3 new project case studies with photos
- Link relevant projects from service landing pages
- Include industry tags on project cards

**Measure:** Projects page engagement, RFQ starts from projects page

---

### 6. Additional Service Landing Pages

**Problem:** Long-tail search traffic not converting.  
**Actions:**
- Expand SEO service pages based on search queries
- Cross-link from capabilities and industries pages
- Add service-specific CTAs and FAQ blocks

**Measure:** Service page visits, RFQ starts from `/services/*`

---

### 7. Enhanced Trust Signals

**Problem:** B2B buyers need confidence before submitting RFQs.  
**Actions:**
- Certifications and quality badges on contact and RFQ pages
- Customer testimonial or partner logos where available
- Clear response time commitment on confirmation page

**Measure:** Contact page CTA clicks, RFQ submission rate

---

### 8. Expanded FAQ Content

**Problem:** Repeat customer questions slow conversion.  
**Actions:**
- FAQ on contact and RFQ confirmation pages
- Cover lead times, file formats, NDA process, MOQ
- Link FAQ from status lookup page

**Measure:** Public status lookup usage, support email volume

---

## Automated Recommendation Triggers

The Post-Launch dashboard generates recommendations when:

| Trigger | Recommendation |
|---------|----------------|
| RFQs < 3 (7 days) | Increase RFQ CTA visibility |
| Quote turnaround > 3 days | Review quote response workflow |
| Abandonment > 50% | Simplify RFQ form |
| Failed emails > 0 | Review email delivery configuration |
| Public lookups ≥ 5 | Expand self-service features |
| Critical issues open | Prioritize issue resolution |

---

## Prioritization Framework

| Priority | Criteria |
|----------|----------|
| P0 — Critical | Email failures, form broken, data loss |
| P1 — High | Low RFQ volume, high abandonment |
| P2 — Medium | Slow quotes, low conversion from quoted to won |
| P3 — Low | Content and SEO improvements |

---

## Week 2+ Roadmap

1. Connect analytics platform for real page performance data
2. A/B test homepage CTA placement
3. Implement quote SLA reminders in admin
4. Add 2 project case studies
5. Review and expand service page content based on Week 1 traffic

---

## Related Documents

- [Post-Launch 7-Day Monitoring Plan](./POST_LAUNCH_7_DAY_MONITORING_PLAN.md)
- [Week 1 Executive Summary Template](./WEEK_1_EXECUTIVE_SUMMARY.md)
