# Case Study Approval Email Process

This document describes the email-based approval process for project case studies at K&C Design and Manufacturing.

## Required Approvals

Before publishing any case study:

1. **Project permission** — Customer agrees to a case study based on the described project scope
2. **Draft review** — Customer approves summary content and publication format
3. **Photo approval** — Separate approval if project photos are included (see [Photo Publication Approval Process](./PHOTO_PUBLICATION_APPROVAL_PROCESS.md))
4. **Publication confirmation** — Optional confirmation after all approvals are recorded

## Workflow Steps

### Step 1: Send Case Study Request

1. Open `/admin/customer-approvals` → **Request Builder**
2. Select template: **Case Study Request**
3. Enter customer information and `{project_title}`
4. Link related case study from `/admin/case-studies` if available
5. Generate draft → Copy → Send manually
6. Record status: **Sent Manually** → **Awaiting Response**

### Step 2: Build Case Study Draft

1. Create or edit case study in `/admin/case-studies`
2. Write public summary focusing on challenge, solution, and general results
3. Exclude pricing, confidential drawings, and proprietary details
4. Complete case study approval checklist

### Step 3: Send Final Approval Request

1. Select template: **Case Study Final Approval**
2. Pre-fill `{case_study_summary}` and `{publication_mode}`
3. Send manually for customer review
4. Document request in approval history

### Step 4: Record Approval

1. When customer approves, use **Record Approval** in Request Builder
2. Update case study: approval fields, display mode, allowed usage
3. Send **Final Publication Confirmation** with `{approved_usage}`

### Step 5: Publish

Publish from `/admin/case-studies` only when:

- Customer approval is documented
- Confidentiality checklist is complete
- Publication mode matches customer permission (anonymous if requested)
- All included photos have separate photo approval

## Anonymous Publication Options

Customers may choose:

- **Anonymous publication** — No customer or company identification
- **Company-only identification** — Company name without individual names
- **Named publication** — Only with explicit written approval

Default to the most restrictive option the customer approves.

## Confidentiality Review Requirements

Before sending or publishing:

- [ ] No pricing details
- [ ] No confidential drawings or CAD visible in text or photos
- [ ] No proprietary customer information
- [ ] No protected project details beyond approved scope
- [ ] No unsupported claims about results or certifications
- [ ] Publication mode matches customer approval

## Record Retention Recommendations

Retain for a minimum of 3 years:

- Case study approval request records
- Approved summary text and publication mode
- Photo approval records (if applicable)
- Approval dates and customer correspondence notes

## Related Resources

- [Customer Approval Email Templates](./CUSTOMER_APPROVAL_EMAIL_TEMPLATES.md)
- [Case Study Approval Checklist](./CASE_STUDY_APPROVAL_CHECKLIST.md)
- [Case Study Approval Template](./CASE_STUDY_APPROVAL_TEMPLATE.md)
- [Photo Publication Approval Process](./PHOTO_PUBLICATION_APPROVAL_PROCESS.md)
