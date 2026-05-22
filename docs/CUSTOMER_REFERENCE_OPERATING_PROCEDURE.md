# Customer Reference Operating Procedure

Standard operating procedure for managing customer references and publication permissions.

## 1. Create Customer Reference

1. Open `/admin/customer-references`
2. Click **New Customer Reference**
3. Enter customer name, company, email, phone, role, industry
4. Set relationship type and reference status (typically `prospect`)
5. Set public display mode (default: `anonymous`)
6. Save profile

All permission types are initialized as `not_requested`.

## 2. Request Permission

1. Open Customer Approvals (`/admin/customer-approvals`) or use permission matrix
2. Generate approval request email draft for the appropriate template
3. Link the customer reference record to the approval request
4. Send email manually and record status
5. In permission matrix, mark relevant permissions as **Requested**

## 3. Record Approval Evidence

When customer responds:

1. Open customer reference detail → Permission Matrix
2. Click **Approve** on each granted permission
3. Record:
   - Approval method (email, signed form, verbal, contract)
   - Approval date
   - Evidence (quote from customer email or form reference)
   - Allowed usage (website, sales_materials, social_media)
   - Restrictions (anonymous only, no logo, etc.)
   - Expiration date if applicable
4. Update reference status to `approved` or `active_reference`

## 4. Link Testimonial / Case Study / Photos

1. Create or edit content in `/admin/testimonials` or `/admin/case-studies`
2. In Customer References detail → Linked Content, link the record
3. Or set `customer_reference_id` when editing content
4. Verify linked content shows correct approval and publish state

## 5. Run Confidentiality Review

Before publication:

- [ ] No confidential drawings or part numbers
- [ ] No pricing information
- [ ] No proprietary customer details
- [ ] No unsupported claims
- [ ] Display mode matches customer approval
- [ ] Photos reviewed for visible sensitive information

Complete checklist items in testimonial or case study admin.

## 6. Confirm Permission Matrix

Before publishing, verify:

- Required permissions are **approved** (not pending, declined, revoked, or expired)
- Display permissions match chosen public display mode
- `website_publication` is approved
- Do-not-contact flag is respected

Publishing panels show blocked requirements and warnings.

## 7. Publish Content

1. Confirm publish readiness shows all requirements met
2. Publish from testimonial or case study admin panel
3. Activity feed records publication event on customer reference
4. Send final publication confirmation email if appropriate

## 8. Monitor Expiration and Revocation

Ongoing:

- Review permissions with approaching expiration dates
- Renew approvals before expiration
- If customer revokes permission, update matrix and unpublish or archive content
- Keep activity feed and approval evidence for audit retention (minimum 3 years recommended)

## Quick Reference

| Action | Location |
|--------|----------|
| Manage references | `/admin/customer-references` |
| Send approval emails | `/admin/customer-approvals` |
| Edit testimonials | `/admin/testimonials` |
| Edit case studies | `/admin/case-studies` |
