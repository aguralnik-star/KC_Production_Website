# Website Maintenance Plan

**K&C Design and Manufacturing Website**

---

## Monthly Maintenance

Complete these tasks each month:

| Task | Action |
|------|--------|
| **Check forms** | Submit a test RFQ on `/contact`; verify confirmation redirect |
| **Check emails** | Confirm internal notification and customer confirmation deliver |
| **Check Supabase usage** | Review database size, storage usage, and Edge Function logs |
| **Check Vercel deployment** | Verify latest deployment succeeded; review build logs if needed |
| **Check broken links** | Spot-check navigation, footer links, and service page links |
| **Review SEO performance** | Check Google Search Console for crawl errors and impressions |
| **Review analytics** | Review GA4 for traffic, RFQ events, and conversion trends |
| **Review photo updates** | Identify pages that need real facility or project photos |

---

## Quarterly Maintenance

Complete these tasks every quarter:

| Task | Action |
|------|--------|
| **Update project showcase** | Refresh representative projects on `/projects` if new examples available |
| **Add real photos** | Replace placeholders with approved facility, equipment, or project photos |
| **Review service page SEO** | Check titles, meta descriptions, and internal links on service pages |
| **Review testimonials** | Replace representative testimonials with approved customer quotes if available |
| **Review content accuracy** | Run Content QA audit at `/admin/content-qa`; verify no unsupported claims |
| **Update sitemap** | Regenerate sitemap if new pages added (`npm run build` regenerates automatically) |

---

## Content Accuracy Reminders

Do **not** add without verification:

- ISO, AS9100, ITAR, FDA, or certification claims
- Customer names, logos, or Fortune 500 references
- Equipment not owned by K&C (e.g. UMC-750, 5-axis, bar feed, live tooling)
- Guaranteed turnaround, lowest price, or zero defect claims

See [UNSUPPORTED_CLAIMS_AUDIT.md](./UNSUPPORTED_CLAIMS_AUDIT.md) for approved language.

---

## Infrastructure Checks

| System | What to Verify |
|--------|----------------|
| Vercel | Deployment health, environment variables, domain SSL |
| Supabase | RLS policies, storage bucket access, migration status |
| Resend | API key valid, sender domain verified, delivery rates |
| GA4 | Measurement ID active, events firing |
| Search Console | Property verified, sitemap submitted |
| Clarity | Project ID active (if configured) |

---

## When to Contact Support

- Repeated RFQ submission failures
- Email delivery failures across multiple RFQs
- Admin access issues for authorized staff
- Security concerns or unauthorized access attempts
- Major content or branding updates

---

## Related Documentation

- [PRODUCTION_CONTENT_QA_AUDIT.md](./PRODUCTION_CONTENT_QA_AUDIT.md)
- [POST_LAUNCH_SUPPORT_PLAN.md](./POST_LAUNCH_SUPPORT_PLAN.md)
