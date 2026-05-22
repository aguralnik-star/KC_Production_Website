# Photo Publication Approval Process

This document describes the approval process for publishing project photographs on the K&C Design and Manufacturing website and marketing materials.

## Required Approvals

Project photos require explicit customer approval before publication, even when included in an approved case study or testimonial workflow.

## Workflow Steps

### Step 1: Confidentiality Pre-Review

Before requesting photo approval, admin must verify each selected photo:

- [ ] No confidential drawings visible
- [ ] No proprietary information visible
- [ ] No pricing information visible
- [ ] No protected customer information visible
- [ ] No employee badges, license plates, or other identifying details (unless approved)

Complete this review in `/admin/case-studies` photo upload workflow or `/admin/real-content` before sending the approval request.

### Step 2: Send Photo Approval Request

1. Open `/admin/customer-approvals` → **Request Builder**
2. Select template: **Project Photo Approval**
3. Enter customer name, company, and email
4. Link related case study or testimonial if applicable
5. Generate draft → Copy → Send manually
6. Record: **Sent Manually** → **Awaiting Response**

Describe specific photos or photo sets in internal notes if not included in the template body.

### Step 3: Record Response

- **Approved** — Record approval with date and any usage restrictions in notes
- **Changes requested** — Update photo selection, re-review, and send revised request
- **Declined** — Do not publish; archive request and remove photos from publication queue

### Step 4: Publication Confirmation

After photo approval, optionally send **Final Publication Confirmation** with `{approved_usage}` describing where photos may appear (website, proposals, sales materials, etc.).

## Publication Rules

1. **Never publish unapproved photos** — Even if a case study is approved, each photo set needs explicit photo approval.
2. **Respect usage restrictions** — If customer approves website only, do not use in social media or proposals.
3. **Anonymous context** — If case study is anonymous, ensure photos do not reveal customer identity.
4. **Re-review on changes** — Any photo edits or replacements require a new approval request.

## Anonymous Publication Options

When customer requests anonymous publication:

- Crop or blur identifying marks, logos, or part numbers if needed
- Do not caption photos with customer or company names
- Use generic alt text (e.g., "CNC machined component")
- Verify EXIF metadata does not contain sensitive location or device info before upload

## Record Retention Recommendations

Retain for a minimum of 3 years:

- Photo approval request records
- List of approved photo IDs or filenames (in internal notes)
- Approved usage scope
- Approval date and customer response notes
- Confidentiality review completion date

## Related Resources

- [Customer Approval Email Templates](./CUSTOMER_APPROVAL_EMAIL_TEMPLATES.md)
- [Project Photo Approval Guide](./PROJECT_PHOTO_APPROVAL_GUIDE.md)
- [Case Study Approval Email Process](./CASE_STUDY_APPROVAL_EMAIL_PROCESS.md)
- [Real Content Replacement System](./REAL_CONTENT_REPLACEMENT_SYSTEM.md)
