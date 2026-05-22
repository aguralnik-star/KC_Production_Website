# Content Confidentiality Review Checklist

Complete this review before publishing any real testimonial, photo, or case study.

---

## Review Items

- [ ] **No customer drawings** — Engineering prints, CAD screenshots, or technical drawings are not visible or described
- [ ] **No part numbers** — Customer part numbers, PO numbers, or internal job numbers are removed
- [ ] **No proprietary geometry if restricted** — Restricted feature details, tolerances, or geometry are not disclosed
- [ ] **No pricing** — Quote values, unit pricing, or commercial terms are not included
- [ ] **No customer secrets** — Proprietary processes, materials, or program details are not revealed
- [ ] **No employee private information** — Name badges, personal contact info, or private details are not shown
- [ ] **No unsupported claims** — Performance, certification, or capability claims are accurate and verifiable
- [ ] **Approval documented** — Written customer approval is on file with date and contact

---

## When to Use

- Before setting `confidentialityReviewed = true` in admin
- Before adding content to `REAL_TESTIMONIALS`, `REAL_PHOTOS`, or `REAL_CASE_STUDIES`
- During case study and photo preparation
- As part of the Global Confidentiality Review tab in `/admin/real-content`

---

## Risk Escalation

| Finding | Action |
|---------|--------|
| Customer drawing visible | Do not publish — obtain new photo or redact |
| Part number visible | Do not publish — crop or retake photo |
| Pricing mentioned | Remove before customer review |
| Unsupported claim | Revise wording or remove claim |
| No written approval | Set status to `pending_customer_approval` |

---

## Print-Friendly Use

This checklist is available in the admin **Confidentiality Review** tab and can be printed for sign-off meetings with customers or internal review.
