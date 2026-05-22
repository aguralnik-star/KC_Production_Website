# Testimonial Approval Checklist

Complete all sections before publishing a real customer testimonial.

---

## Customer Approval

- [ ] Customer approved quote wording
- [ ] Customer approved name usage
- [ ] Customer approved company usage
- [ ] Customer approved role/title usage
- [ ] Customer approved website publication
- [ ] Customer approved sales material usage (if selected)

**Admin fields:** `approval_received`, `approval_date`, `approval_method`

---

## Display Approval

- [ ] Display mode matches customer approval
- [ ] Anonymous mode used if requested
- [ ] Public quote matches approved version
- [ ] Approved display fields match selected display mode

**Display modes:**

| Mode | Required fields |
|------|-----------------|
| anonymous | None (shows Approved Customer / K&C Customer) |
| display_name_only | approved_display_name |
| company_only | approved_company_display |
| role_only | approved_role_display |
| name_and_company | approved_display_name + approved_company_display |
| name_company_and_role | All three approved fields |

---

## Usage Approval

- [ ] Allowed usage selections match customer permission
- [ ] Website usage approved (if `website` selected)
- [ ] Proposals usage approved (if `proposals` selected)
- [ ] Sales materials approved (if `sales_materials` selected)
- [ ] Social media approved (if `social_media` selected)
- [ ] Anonymous-only restriction honored (if `anonymous_only` selected)

---

## Confidentiality Review

- [ ] No confidential project details
- [ ] No pricing details
- [ ] No proprietary customer information
- [ ] No unsupported performance claims
- [ ] No certification claims unless verified
- [ ] No sensitive business details

**Admin field:** `confidentiality_review_complete`

---

## Final Publication Approval

| Requirement | Verified |
|-------------|----------|
| Quote is not empty | ☐ |
| Approval received | ☐ |
| Approval date recorded | ☐ |
| Confidentiality review complete | ☐ |
| Approved for public use | ☐ |
| All checklist items passed | ☐ |
| Display fields valid for mode | ☐ |

Use **Publish Testimonial** in `/admin/testimonials` only when all items are complete.
