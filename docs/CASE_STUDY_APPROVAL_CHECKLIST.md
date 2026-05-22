# Case Study Approval Checklist

Complete all sections before publishing a real K&C case study.

---

## Customer Approval

- [ ] Customer approved case study wording
- [ ] Customer approved testimonial if included
- [ ] Customer approved company/name usage
- [ ] Customer approved industry reference
- [ ] Customer approved public display mode

**Admin fields:** `customer_approval_received`, `customer_approval_date`

---

## Photo Approval

- [ ] Photos approved for public website use
- [ ] No customer drawings visible
- [ ] No part numbers visible
- [ ] No proprietary details visible
- [ ] No confidential notes visible
- [ ] Photos optimized for web

**Admin fields:** `photo_approval_received`, `photo_approval_date`, per-photo approve action

---

## Confidentiality Review

- [ ] No customer drawings in text or photos
- [ ] No part numbers in text or photos
- [ ] No proprietary geometry if restricted
- [ ] No pricing in text or photos
- [ ] No customer secrets
- [ ] No employee private information
- [ ] No unsupported claims

**Admin field:** `confidentiality_review_complete`

---

## Public Use Approval

- [ ] Case study approved for public use (`approved_for_public_use`)
- [ ] All attached photos approved for public use
- [ ] All attached photos confidentiality review complete
- [ ] Customer display mode matches approved usage
- [ ] Internal notes excluded from preview

---

## Final Publish Approval

Publishing requires:

| Requirement | Verified |
|-------------|----------|
| Status = `approved` or `pending_approval` with all checklist passed | ☐ |
| Customer approval documented | ☐ |
| Photo approval documented (if photos attached) | ☐ |
| Confidentiality review complete | ☐ |
| Approved for public use | ☐ |
| All checklist items passed | ☐ |
| All photos approved | ☐ |

When all requirements are met, use **Publish Case Study** in `/admin/case-studies/{id}`.

---

## Do Not Publish If

- Customer approval is not documented
- Any photo shows drawings, part numbers, or proprietary labels
- Pricing or confidential manufacturing details are included
- Checklist items are pending or failed
- Customer has not approved the chosen display mode (anonymous vs named)
