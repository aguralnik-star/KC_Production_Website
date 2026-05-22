# Customer Permission Matrix Guide

This guide explains each permission type in the customer reference permission matrix.

## Permission Types

### Content Permissions

| Type | What It Allows | When Required |
|------|----------------|---------------|
| **testimonial** | Publish a customer quote or testimonial | Before any testimonial publication |
| **case_study** | Publish a project case study | Before any case study publication |
| **project_photos** | Use project photographs publicly | When photos are included in case studies or galleries |

### Identity Permissions

| Type | What It Allows | When Required |
|------|----------------|---------------|
| **company_name** | Display customer company name | When company name appears publicly |
| **customer_name** | Display customer individual name | When a person's name appears publicly |
| **customer_role** | Display job title or role | When role/title appears publicly |
| **logo** | Use customer company logo | Before any logo appears on website or materials |
| **anonymous_reference** | Publish without identifying customer | When using anonymous display mode |

### Channel Permissions

| Type | What It Allows | When Required |
|------|----------------|---------------|
| **website_publication** | Publish on kcdesignmfg.com | All public website content |
| **sales_materials** | Use in proposals and sales decks | When content appears in sales materials |
| **social_media** | Share on social channels | When content is posted to social media |

## Permission Statuses

| Status | Meaning |
|--------|---------|
| not_requested | Permission not yet requested |
| requested | Approval request sent, awaiting response |
| approved | Customer approval documented |
| declined | Customer declined — do not publish |
| expired | Approval past expiration date |
| revoked | Previously approved but revoked |

## Summary States

The system computes an overall summary:

- **Fully Approved** — All permission types approved
- **Partially Approved** — Some approved, others pending or missing
- **Pending** — Requests in progress
- **Declined / Revoked / Expired** — Blocks publication
- **Missing** — No permissions configured

## Example Approval Evidence

Record evidence in the permission record:

- Email reply: "Approved for website use, anonymous only, dated 2026-03-15"
- Signed form: Reference form ID or file location in internal notes
- Verbal: Document who received approval, when, and any restrictions
- Contract: Reference contract section or SOW clause

Always include:

- Approval date
- Approved usage scope (website, sales, social)
- Display restrictions (anonymous, company only, etc.)
- Expiration date if time-limited
