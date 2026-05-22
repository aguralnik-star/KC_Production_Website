# Testimonial Publication Policy

**Project:** K&C Design and Manufacturing Website

---

## Core Rules

1. **No publishing without approval** — Every real testimonial requires documented customer approval before publication.
2. **No confidential details** — Quotes must not include pricing, proprietary information, part numbers, or restricted project details.
3. **No fake testimonials** — Do not invent customer names, companies, logos, or quotes.
4. **Representative examples must be labeled** — Static representative testimonials display **Representative Example** until real approved testimonials are published.
5. **Respect display mode** — Public attribution must follow the customer's approved display mode only.

---

## What Is Never Published

- Customer email addresses
- Internal approval notes
- Unapproved customer name, company, or role fields
- Approval method or approval date on public pages
- Internal review checklist evidence

---

## Display Mode Rules

| Mode | Public display |
|------|----------------|
| anonymous | "Approved Customer" / "K&C Customer" |
| display_name_only | Approved display name only |
| company_only | Approved company display only |
| role_only | Approved role display only |
| name_and_company | Approved name + company |
| name_company_and_role | Approved name + company + role |

---

## Publishing Requirements

All must be true before `status = published`:

- `approval_received = true`
- `approval_date` is set
- `confidentiality_review_complete = true`
- `approved_for_public_use = true`
- All required checklist items passed
- Display fields match selected display mode

---

## SEO and Content Guidelines

- Keep testimonials natural — avoid keyword stuffing
- Do not overclaim quality or guaranteed outcomes
- Do not imply certifications or approvals K&C has not verified
- Approved testimonials may appear on Home, About, Quality, Projects, and Service pages

---

## Fallback Behavior

If no published testimonials exist or Supabase is unavailable, the public site shows representative testimonials with clear **Representative Example** labeling.
