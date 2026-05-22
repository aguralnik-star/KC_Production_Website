# Customer Approval Email Templates

K&C Design and Manufacturing uses a manual-send approval workflow for testimonials, case studies, and project photos. This document describes the unified template system and admin workflow.

## Overview

The Customer Approvals admin page (`/admin/customer-approvals`) provides:

- Six default email templates for the full approval lifecycle
- A request builder for generating drafts with customer and content context
- A documented approval trail in `customer_approval_requests`
- Template management for customizing subject lines and body copy

**No emails are sent automatically.** Admins copy drafts, send via their email client, and record each workflow step manually.

## Template Types

| Template Type | Purpose |
|---------------|---------|
| `testimonial_request` | Initial request for customer testimonial and display preferences |
| `testimonial_approval` | Final approval of testimonial wording and display format |
| `case_study_request` | Permission to create a case study from a project |
| `case_study_approval` | Final approval of case study summary and publication mode |
| `photo_approval` | Permission to publish selected project photographs |
| `final_publication_confirmation` | Confirmation after customer approves publication |

## Template Variables

Templates support placeholder substitution:

| Variable | Used In |
|----------|---------|
| `{customer_name}` | All templates |
| `{customer_company}` | All templates |
| `{customer_email}` | All templates |
| `{testimonial_text}` | Testimonial final approval |
| `{display_format}` | Testimonial final approval |
| `{project_title}` | Case study request |
| `{case_study_summary}` | Case study final approval |
| `{publication_mode}` | Case study final approval |
| `{approved_usage}` | Final publication confirmation |

## Request Status Workflow

```
draft → copied → sent_manually → awaiting_response → approved | declined
                                                          ↓
                                                      archived
```

| Status | Meaning |
|--------|---------|
| `draft` | Draft generated, not yet copied or sent |
| `copied` | Email copied to clipboard for manual send |
| `sent_manually` | Admin confirmed email was sent |
| `awaiting_response` | Waiting for customer reply |
| `approved` | Customer approval documented |
| `declined` | Customer declined publication |
| `archived` | Closed without further action |

## Publication Rules

1. **Never publish without approval** — Testimonials, case studies, and photos require documented customer approval before public use.
2. **Respect anonymous requests** — If a customer requests anonymous publication, use anonymous display modes only.
3. **Confidentiality review** — Review all content for drawings, pricing, proprietary details, and protected customer information before sending approval requests.
4. **Two-step approval** — Use request templates first, then final approval templates before publication.
5. **Record retention** — Keep approval request records, dates, and notes for audit purposes.

## Database Tables

- `customer_approval_templates` — Reusable email templates
- `customer_approval_requests` — Approval trail linked to testimonials and case studies

Both tables are admin-only via Row Level Security (`public.is_admin()`).

## Related Documentation

- [Testimonial Approval Email Process](./TESTIMONIAL_APPROVAL_EMAIL_PROCESS.md)
- [Case Study Approval Email Process](./CASE_STUDY_APPROVAL_EMAIL_PROCESS.md)
- [Photo Publication Approval Process](./PHOTO_PUBLICATION_APPROVAL_PROCESS.md)
- [Testimonial Capture Workflow](./TESTIMONIAL_CAPTURE_WORKFLOW.md)
- [Case Study Approval Checklist](./CASE_STUDY_APPROVAL_CHECKLIST.md)
