# First Case Study Build Guide

**Project:** K&C Design and Manufacturing Website

---

## How to Choose the First Project

Select a completed project that:

- Has documented customer approval for public storytelling
- Does not expose confidential drawings, part numbers, or proprietary details
- Demonstrates a clear K&C capability (machining, fixture, gauge, tooling, or production support)
- Has at least one photo approved for public website use
- Can be anonymized if the customer prefers

Avoid using rush jobs, disputed projects, or programs under NDA as the first published case study.

---

## How to Write Challenge / Solution / Result

**Challenge:** Describe the manufacturing problem in general terms. Do not include confidential dimensions, customer part numbers, or restricted geometry.

**Solution:** Explain what K&C delivered — process, capability, and collaboration — without proprietary customer secrets.

**Result:** Share outcome in factual, measured language. Do not include unsupported performance guarantees or pricing.

Use the admin builder at `/admin/case-studies` to draft and preview before customer review.

---

## How to Anonymize Customer Details

1. Set **Customer display mode** to `anonymous`
2. Public page will show **"Representative Customer Project"**
3. Do not enter customer name or company in public-facing approved fields
4. Keep real customer details in internal notes only (never published)
5. Confirm anonymization with the customer in writing

---

## How to Collect Approval

1. Send draft case study wording to the customer contact
2. Send photo selections for separate photo approval
3. Document approval dates in the admin builder
4. Complete all checklist items in the approval checklist tab
5. Mark `customer_approval_received` and `photo_approval_received` only after written confirmation

---

## How to Publish Safely

Publishing is blocked until:

- Customer approval is documented
- Photo approval is documented (when photos are attached)
- Confidentiality review is complete
- All checklist items are passed
- All photos are approved for public use
- `approved_for_public_use` is enabled

When ready, click **Publish Case Study** in the admin builder. The case study appears at `/projects/{slug}` and on the Projects page under **Approved Case Studies**.

---

## Related Documents

- [Case Study Photo Upload Workflow](./CASE_STUDY_PHOTO_UPLOAD_WORKFLOW.md)
- [Case Study Approval Checklist](./CASE_STUDY_APPROVAL_CHECKLIST.md)
