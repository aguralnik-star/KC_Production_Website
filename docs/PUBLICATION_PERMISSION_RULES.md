# Publication Permission Rules

Rules enforced when publishing customer-related content on the K&C Design and Manufacturing website.

## General Rules

- **Admin only** — Permission data is never public
- **Documented approval required** — No publication without approval evidence
- **Linked reference preferred** — Content should link to a `customer_reference_id`
- **Manual fallback** — If no linked reference, manual approval fields must be complete (with warning)

## Testimonial Publishing

Requires when linked to customer reference:

1. `testimonial` permission — approved
2. `website_publication` permission — approved
3. Display permission matching `display_mode`:
   - anonymous → `anonymous_reference`
   - display_name_only → `customer_name`
   - company_only → `company_name`
   - role_only → `customer_role`
   - name_and_company → `customer_name` + `company_name`
   - name_company_and_role → all three identity permissions
4. Confidentiality review complete on testimonial record
5. Customer approval documented on testimonial record

**Blocked if:** permission declined, revoked, expired, or do-not-contact without documented approval.

## Case Study Publishing

Requires when linked to customer reference:

1. `case_study` permission — approved
2. `website_publication` permission — approved
3. Display permissions matching `customer_display_mode`:
   - anonymous → `anonymous_reference`
   - named_company → `company_name`
   - named_customer → `customer_name`
   - named_customer_and_company → both
4. `project_photos` permission — approved (if photos attached)
5. Confidentiality review complete
6. Customer approval documented

## Photo Publishing

Requires when linked to customer reference:

1. `project_photos` permission — approved
2. `website_publication` permission — approved
3. Photo confidentiality review complete
4. Photo approved for public use

## Anonymous Reference

When publishing without customer identification:

1. `anonymous_reference` permission — approved
2. `website_publication` permission — approved
3. No identifying names, logos, or photos that reveal customer identity

## Do-Not-Contact Rules

If `do_not_contact = true`:

- Do not send new approval requests without explicit business justification
- Publication requires documented approval on the content record
- Permission matrix must show approved status with evidence

## Expired and Revoked Permissions

- **Expired** — Treat as not approved; request renewal before publishing
- **Revoked** — Do not publish; remove or archive affected content
- **Declined** — Do not publish; do not re-request without new customer contact approval

## Warning: No Linked Reference

When content has no `customer_reference_id`:

> No linked customer reference. Permission must be verified manually.

Publishing is allowed only if legacy manual approval fields and checklists are complete.
