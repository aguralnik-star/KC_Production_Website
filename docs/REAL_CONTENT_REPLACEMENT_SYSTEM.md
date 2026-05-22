# Real Content Replacement System

**Project:** K&C Design and Manufacturing Website

---

## Purpose

This system provides a structured admin workflow to replace representative website content with real customer-approved testimonials, project photography, and case studies as they become available.

**Important:** Do not publish real customer names, testimonials, logos, or project photos unless explicitly approved. Do not expose confidential drawings, part numbers, proprietary customer details, pricing, or protected manufacturing information.

---

## Content Types

| Type | Public Data File | Admin Tracker |
|------|------------------|---------------|
| Testimonials | `src/data/testimonialsData.js` | Testimonials tab |
| Project Photography | `src/data/photoLibraryConfig.js` | Photos tab |
| Case Studies | `src/data/projectsData.js` | Case Studies tab |

---

## Approval Statuses

- `draft`
- `pending_customer_approval`
- `approved`
- `needs_revision`
- `rejected`
- `published`
- `archived`

---

## Risk Levels

- `low` — Internal review only, minimal customer exposure
- `medium` — Customer approval pending or partial checklist complete
- `high` — Missing safety checklist items or sensitive content
- `critical` — Multiple safety failures; must not publish

---

## Publication Rules

Real content appears publicly **only when all conditions are met:**

- `isCustomerApproved = true`
- `approvalStatus = approved`
- `publishReady = true`
- `confidentialityReviewed = true`
- `sourceType = real`

Until then, representative content remains visible with disclosure labels.

---

## Replacement Queue Priorities

1. Homepage testimonials
2. Project showcase images
3. Project detail case studies
4. Industries page proof points
5. Service page examples
6. Sales/quote support content

---

## Admin Access

- **Route:** `/admin/real-content`
- **Persistence:** localStorage (`kc_real_content_v1`)
- **Publishing:** After admin approval workflow, add approved items to the static data files (`REAL_TESTIMONIALS`, `REAL_PHOTOS`, `REAL_CASE_STUDIES` arrays)

---

## Related Documents

- [Customer Testimonial Approval Guide](./CUSTOMER_TESTIMONIAL_APPROVAL_GUIDE.md)
- [Project Photo Approval Guide](./PROJECT_PHOTO_APPROVAL_GUIDE.md)
- [Case Study Approval Template](./CASE_STUDY_APPROVAL_TEMPLATE.md)
- [Content Confidentiality Review Checklist](./CONTENT_CONFIDENTIALITY_REVIEW_CHECKLIST.md)
