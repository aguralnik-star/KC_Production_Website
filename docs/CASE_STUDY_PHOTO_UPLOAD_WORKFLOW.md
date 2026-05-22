# Case Study Photo Upload Workflow

**Project:** K&C Design and Manufacturing Website

---

## Photo Requirements

- Maximum **10 photos** per case study
- Maximum **10MB** per file
- Allowed types: **JPG, JPEG, PNG, WEBP**
- Private storage bucket: `case-study-photos`
- Storage path: `case-studies/{case_study_id}/{timestamp}-{safeFileName}`
- No anonymous upload or browsing — admin only

---

## Upload Steps

1. Open the case study in `/admin/case-studies/{id}`
2. Complete **alt text**, **caption**, and **category** metadata
3. Drag and drop or select a photo in the Photo Upload section
4. Review the photo in the Photo Review Grid
5. Complete the photo safety checklist before approving
6. Click **Approve** to mark the photo for public use

---

## Metadata Requirements

| Field | Required | Notes |
|-------|----------|-------|
| Alt text | Yes | Accessibility — describe the image without confidential details |
| Caption | No | Optional public caption |
| Category | Yes | Finished Part, Fixture, Gauge, Tooling, Machine Setup, Inspection, Process, Before/After, Facility |

---

## Safety Checklist (Per Photo)

- [ ] No customer drawings visible
- [ ] No customer part numbers visible
- [ ] No proprietary labels visible
- [ ] No confidential geometry if restricted
- [ ] No pricing visible
- [ ] No employee personal data visible
- [ ] Approved for public website use
- [ ] Optimized for web

---

## Approval Process

1. Upload photo → status `pending_review`
2. Admin reviews photo and safety checklist
3. **Approve** → `approved_for_public_use = true`, `confidentiality_review_complete = true`
4. **Reject** → photo excluded from publication
5. On case study publish → approved photos set to `published`
6. Public display uses signed URLs only — no raw storage paths exposed

---

## Public Display

Only photos with:

- `status = published`
- `approved_for_public_use = true`
- `confidentiality_review_complete = true`

…on a published case study are shown on `/projects/{slug}`.
