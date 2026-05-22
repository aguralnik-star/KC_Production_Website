# Project Photo Approval Guide

**Project:** K&C Design and Manufacturing Website

---

## What Photos Are Acceptable

- General shop floor views without identifiable customer parts
- Machine and equipment photos with no proprietary work visible
- Generic fixture, gauge, or tooling examples with no customer markings
- Facility and team photos approved by all individuals shown
- De-identified part photos with no part numbers, drawings, or labels

---

## What Photos Must NOT Show

- Customer engineering drawings or prints
- Customer part numbers, PO numbers, or job numbers
- Proprietary labels, logos, or customer branding on parts
- Confidential fixtures or tooling tied to a specific customer program
- Employee personal information (name badges, license plates, etc.)
- Pricing, quote documents, or internal paperwork

---

## Customer Approval Requirements

When a photo relates to customer work:

1. Mark **customer approval required** in the admin tracker
2. Send the photo to the customer contact for review
3. Specify intended usage (website, proposals, social media)
4. Obtain written approval before setting `approvalReceived = true`
5. Complete the photo safety checklist in admin

Internal-only photos with no customer work may not require customer approval, but still require confidentiality review.

---

## Image Optimization Requirements

Before publication:

- [ ] Resize for web (recommended max width 1600px for hero, 800px for cards)
- [ ] Compress to reasonable file size (target under 300KB for cards)
- [ ] Use `.jpg` or `.webp` format
- [ ] Provide descriptive alt text with no confidential details
- [ ] Verify image loads correctly on mobile

Store optimized files in the appropriate folder under `public/images/{category}/`.

---

## Filename Naming Conventions

**Pattern:** `{category}-{subject}-{sequence}.{ext}`

**Example:** `fixtures-aluminum-plate-001.jpg`

**Rules:**

- Use lowercase and hyphens only
- Start with category folder name (facility, shop, machines, inspection, gauges, fixtures, tooling, parts, team)
- No customer names or part numbers in filename
- Use sequential numbering for multiple shots of the same subject

---

## If No Approved Photo Exists

The public site shows an **industrial placeholder** with a "Representative Example" label. Replace with approved photos once available.
