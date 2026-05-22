# K&C Production Launch Checklist

This document supports the final production launch of the K&C Design and Manufacturing website and RFQ platform.

## Vercel Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL for the frontend client |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_SITE_URL` | Public site origin for canonical URLs and email links |

## Supabase Edge Function Secrets

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key |
| `SUPABASE_ANON_KEY` | Admin JWT verification |
| `RESEND_API_KEY` | Resend email API key |
| `RFQ_NOTIFICATION_TO` | Internal notification inbox |
| `RFQ_FROM_EMAIL` | Outbound sender |
| `RFQ_REPLY_TO` | Reply-to address |
| `PUBLIC_SITE_URL` | Public site URL for secure customer links |

## Migration Order

Apply migrations in numeric order through `014_launch_checklist_items.sql`, then run:

```bash
supabase db push
```

## Edge Function Deployment

```bash
supabase functions deploy send-rfq-notification
supabase functions deploy public-rfq-status-lookup
supabase functions deploy send-customer-status-update
supabase functions deploy send-additional-info-request
supabase functions deploy validate-additional-info-token
supabase functions deploy create-additional-info-upload-session
supabase functions deploy finalize-additional-info-submission
```

## Resend Setup

1. Verify production sender domain in Resend.
2. Configure SPF, DKIM, and DMARC.
3. Test internal notification, customer confirmation, status update, and additional info request emails.

## Admin User Creation

```sql
insert into public.admin_profiles (id, email, role, is_active)
values ('USER_UUID_HERE', 'admin@example.com', 'owner', true);
```

## Storage and RLS Verification

- Keep `rfq-files` private with signed admin downloads only.
- Verify RLS on all RFQ, email, additional info, readiness, and launch checklist tables.

## Final Go / No-Go

Track completion in `/admin/launch-checklist`:

- **Ready for Launch**: 95%+ and no unresolved critical blockers
- **Nearly Ready**: 80–94%
- **Not Ready**: below 80% or unresolved critical blockers

## Vercel Deployment

- Build command: `npm run build`
- Output directory: `dist`
- Verify HTTPS, custom domain, redirects, `robots.txt`, `sitemap.xml`, and `site.webmanifest`
