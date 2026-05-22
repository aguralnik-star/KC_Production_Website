# Customer Reference Management System

K&C Design and Manufacturing uses a centralized admin system to track customer references, publication permissions, and linked content.

## Purpose

The Customer References admin page (`/admin/customer-references`) provides:

- One record per customer contact for permission tracking
- A permission matrix covering testimonials, case studies, photos, logos, and publication channels
- Linked testimonials, case studies, photos, and approval requests
- An activity feed for audit trail

**No customer reference data is exposed publicly.** Public website components only consume approved and published content.

## Customer Reference Record Structure

Each `customer_references` record includes:

| Field | Purpose |
|-------|---------|
| Contact info | Name, company, email, phone, role, industry |
| Relationship | customer, prospect, vendor, partner, other |
| Reference status | prospect → requested → approved → active_reference |
| Display mode | anonymous through name_company_and_role |
| Approved display fields | Exact approved public attribution text |
| do_not_contact | Blocks outreach; requires explicit approval documentation |

## Permission Tracking

Permissions are stored in `customer_reference_permissions` with one row per permission type:

- testimonial, case_study, project_photos
- company_name, customer_name, customer_role, logo
- anonymous_reference
- website_publication, sales_materials, social_media

Each permission tracks status, allowed usage, approval method, dates, evidence, and restrictions.

## Linked Content

Content tables link via `customer_reference_id`:

- `testimonials`
- `case_studies`
- `case_study_photos`
- `customer_approval_requests`

Publishing workflows check linked reference permissions before allowing publication.

## Activity History

`customer_reference_activity` records:

- Reference creation and contact updates
- Permission requests, approvals, declines, revocations
- Content linking and publication events
- Do-not-contact changes and notes

## Publication Safety

1. Never publish without documented permission
2. Respect anonymous publication requests
3. Block publication when permissions are declined, revoked, or expired
4. Honor do-not-contact unless approval is explicitly documented
5. Run confidentiality review before any publication

## Related Documentation

- [Customer Permission Matrix Guide](./CUSTOMER_PERMISSION_MATRIX_GUIDE.md)
- [Publication Permission Rules](./PUBLICATION_PERMISSION_RULES.md)
- [Customer Reference Operating Procedure](./CUSTOMER_REFERENCE_OPERATING_PROCEDURE.md)
