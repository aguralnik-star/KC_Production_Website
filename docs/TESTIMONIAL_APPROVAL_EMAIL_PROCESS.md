# Testimonial Approval Email Process

This document describes the email-based approval process for customer testimonials at K&C Design and Manufacturing.

## Required Approvals

Before publishing any testimonial, obtain:

1. **Initial permission** — Customer agrees to provide a testimonial and understands display options (including anonymous publication).
2. **Final wording approval** — Customer approves the exact quote text and display format before publication.
3. **Publication confirmation** — Optional confirmation email after approval is recorded.

## Workflow Steps

### Step 1: Send Testimonial Request

1. Open `/admin/customer-approvals` → **Request Builder**
2. Select template: **Testimonial Request**
3. Enter customer name, company, and email
4. Optionally link a related testimonial record from `/admin/testimonials`
5. Generate draft → Copy email → Send manually via email client
6. Mark **Sent Manually** → **Awaiting Response**

### Step 2: Capture Testimonial Content

1. When customer replies, enter quote and display preferences in `/admin/testimonials`
2. Complete the approval checklist
3. Run confidentiality review

### Step 3: Send Final Approval Request

1. Select template: **Testimonial Final Approval**
2. Pre-fill `{testimonial_text}` and `{display_format}`
3. Generate draft and send manually
4. Record workflow status in Customer Approvals history

### Step 4: Record Approval

1. When customer confirms, click **Record Approval** in the Request Builder
2. Enter approval notes (date, method, any display restrictions)
3. Update testimonial record: `approval_received`, `approval_date`, display mode
4. Send **Final Publication Confirmation** if desired

### Step 5: Publish

Only publish from `/admin/testimonials` when:

- Customer approval is documented
- Confidentiality review is complete
- Display mode matches customer approval
- Anonymous mode is used if requested

## Anonymous Publication Options

Customers may request:

- Anonymous testimonial (default label: "Approved Customer" / "K&C Customer")
- First name only
- Role/title only
- Company name only
- Name and company (if explicitly approved)

**Never add identifying information beyond what the customer approved.**

## Confidentiality Review Requirements

Before sending any testimonial for approval or publishing:

- [ ] No confidential project details
- [ ] No pricing information
- [ ] No proprietary customer information
- [ ] No unsupported performance claims
- [ ] No certification claims unless verified
- [ ] Display mode matches customer permission

## Record Retention Recommendations

Retain for a minimum of 3 years:

- All `customer_approval_requests` records for testimonial workflow
- Approval dates and notes
- Final approved quote text
- Display mode selection
- Internal notes on anonymous or restricted usage

## Related Resources

- [Customer Approval Email Templates](./CUSTOMER_APPROVAL_EMAIL_TEMPLATES.md)
- [Testimonial Capture Workflow](./TESTIMONIAL_CAPTURE_WORKFLOW.md)
- [Testimonial Approval Checklist](./TESTIMONIAL_APPROVAL_CHECKLIST.md)
- [Testimonial Publication Policy](./TESTIMONIAL_PUBLICATION_POLICY.md)
