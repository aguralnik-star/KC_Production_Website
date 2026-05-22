# Handoff Notes

**K&C Design and Manufacturing Website & RFQ Platform**  
**Audience:** Developers, operations, and technical maintainers

---

## Project Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, React Router 7 |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| Email | Resend (via Edge Functions) |
| Hosting | Vercel |
| Charts | Recharts (lazy-loaded in operations dashboard) |
| Icons | lucide-react (tree-shaken per route) |

---

## Repo Structure

```
KC_Production_Website/
├── docs/                    # Launch, handoff, and operations documentation
├── public/                  # robots.txt, sitemap.xml, site.webmanifest, favicon
├── src/
│   ├── components/          # Shared UI, admin panels, RFQ components
│   ├── config/              # siteConfig.js (SEO, URLs)
│   ├── data/                # company.js (static marketing content)
│   ├── lib/                 # supabaseClient.js
│   ├── pages/               # Route pages (public + admin)
│   ├── services/            # API / Supabase service modules
│   └── utils/               # SEO, a11y, performance helpers
├── supabase/
│   ├── functions/           # Edge Functions (Deno)
│   └── migrations/          # SQL migrations (001–016)
├── vercel.json              # SPA rewrite for React Router
└── .env.example             # Environment variable reference
```

---

## Key Frontend Routes

### Public

| Route | Component |
|---|---|
| `/` | `Home.jsx` |
| `/about` | `About.jsx` |
| `/capabilities` | `Capabilities.jsx` |
| `/equipment` | `Equipment.jsx` |
| `/quality` | `Quality.jsx` |
| `/industries` | `Industries.jsx` |
| `/contact` | `Contact.jsx` (includes `RFQForm`) |
| `/rfq/confirmation` | `RFQConfirmation.jsx` |
| `/rfq/status` | `RFQStatusLookup.jsx` |
| `/rfq/additional-info/:token` | `AdditionalInfoUpload.jsx` |

### Admin (protected)

| Route | Component |
|---|---|
| `/admin/login` | `AdminLogin.jsx` |
| `/admin/rfqs` | `AdminRFQDashboard.jsx` |
| `/admin/rfq-readiness` | `AdminRFQProductionReadiness.jsx` |
| `/admin/rfq-operations` | `AdminRFQOperationsCommandCenter.jsx` |
| `/admin/launch-checklist` | `LaunchChecklist.jsx` |
| `/admin/launch-go-no-go` | `AdminLaunchGoNoGoReview.jsx` |
| `/admin/handoff` | `AdminHandoffCenter.jsx` |

---

## Supabase Tables Overview

| Table | Purpose |
|---|---|
| `rfq_requests` | Customer RFQ submissions, status, reference numbers |
| `rfq_files` | Metadata for files uploaded with RFQ |
| `admin_profiles` | Authorized admin users (links to `auth.users`) |
| `rfq_internal_notes` | Admin-only notes on RFQs |
| `rfq_quote_email_drafts` | Generated quote email drafts |
| `rfq_manual_send_events` | Manual quote send tracking |
| `rfq_alerts` | Follow-up reminder / alert queue |
| `rfq_customer_status_email_drafts` | Customer status update drafts |
| `rfq_customer_status_email_events` | Sent status update history |
| `rfq_customer_status_lookup_events` | Public lookup audit log |
| `rfq_additional_info_requests` | Additional info request tokens |
| `rfq_customer_info_submissions` | Customer text responses |
| `rfq_customer_uploaded_files` | Re-uploaded file metadata |
| `rfq_production_readiness_audits` | Readiness audit runs |
| `rfq_production_readiness_checks` | Individual readiness check results |
| `launch_checklist_items` | Optional remote launch checklist sync |

**Views (migration 013):** Operations/analytics views for command center KPIs.

---

## Supabase Edge Functions

| Function | Purpose |
|---|---|
| `send-rfq-notification` | Internal + customer confirmation emails on new RFQ |
| `public-rfq-status-lookup` | Public status lookup by reference + email |
| `send-customer-status-update` | Send customer status update email |
| `send-additional-info-request` | Email secure additional-info link |
| `validate-additional-info-token` | Validate customer upload token |
| `create-additional-info-upload-session` | Create upload session for token |
| `finalize-additional-info-submission` | Finalize customer re-upload |

Deploy all:

```bash
supabase functions deploy send-rfq-notification
supabase functions deploy public-rfq-status-lookup
supabase functions deploy send-customer-status-update
supabase functions deploy send-additional-info-request
supabase functions deploy validate-additional-info-token
supabase functions deploy create-additional-info-upload-session
supabase functions deploy finalize-additional-info-submission
```

---

## Storage Bucket

| Bucket | Access |
|---|---|
| `rfq-files` | **Private** — anonymous upload to `rfq/` prefix only; admin read via signed URLs |

Path pattern: `rfq/{rfq_request_id}/{timestamp}-{filename}`

---

## Environment Variables

### Vercel (frontend)

```env
VITE_SUPABASE_URL=https://uukrvhyepqloqwekzppm.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
VITE_SITE_URL=https://www.kcdesignmfg.com
```

### Supabase Edge Function secrets

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
RESEND_API_KEY=
RFQ_NOTIFICATION_TO=info@kcdesignmfg.com
RFQ_FROM_EMAIL=
RFQ_REPLY_TO=info@kcdesignmfg.com
PUBLIC_SITE_URL=https://www.kcdesignmfg.com
```

Never put `SUPABASE_SERVICE_ROLE_KEY` in Vite env vars.

---

## Deployment Process

### Database

```bash
supabase link --project-ref uukrvhyepqloqwekzppm
supabase db push
```

### Edge Functions

Deploy each function (see list above) after setting secrets.

### Frontend (Vercel)

```bash
npm install
npm run build
vercel deploy --prod
```

- Build command: `npm run build`
- Output directory: `dist`
- SPA routing: `vercel.json` rewrites to `index.html`

### Admin user setup

1. Create user in Supabase Auth (Dashboard → Authentication).
2. Insert profile:

```sql
insert into public.admin_profiles (id, email, role, is_active)
values ('USER_UUID', 'admin@example.com', 'owner', true);
```

---

## Common Troubleshooting

| Issue | Likely cause | Action |
|---|---|---|
| RFQ form shows “not configured” | Missing Vite env vars | Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on Vercel; redeploy |
| RFQ insert fails (42501) | RLS / trigger permissions | Verify `anon_insert_rfq_requests` policy; apply migrations 015–016 |
| Emails not sending | Missing `RESEND_API_KEY` | Add secret; verify sender domain in Resend |
| Admin login works but dashboard empty | No `admin_profiles` row | Seed admin profile for auth user UUID |
| File download fails | Expired signed URL or bucket policy | Regenerate from admin; confirm `rfq-files` is private |
| Status lookup returns not found | Email/reference mismatch | Confirm exact email used on submission |
| Additional info link expired | Token TTL passed | Create new request from admin panel |
| 404 on direct URL refresh | SPA routing | Confirm `vercel.json` rewrite is deployed |

**Logs:**

- Supabase Dashboard → Logs (API, Auth, Edge Functions)
- Vercel Dashboard → Deployments → Function/runtime logs

---

## Known Limitations

1. **Custom domain** — `www.kcdesignmfg.com` may still point to legacy site until DNS is updated.
2. **Quote emails** — Drafted in admin; manual send only (not automated).
3. **Launch checklist / go-no-go** — Stored in localStorage by default; optional Supabase sync for checklist items.
4. **Admin list cap** — RFQ dashboard query capped at 250 rows (pagination pattern for future).
5. **Anonymous RFQ insert** — Was blocked by RLS during validation; verify fix before launch.
6. **No multi-tenant admin roles UI** — Roles exist in DB; UI assumes approved admin users.
7. **Export** — Launch checklist export is print-based; CSV export placeholder.

---

## Future Improvements

- Fix and regression-test anonymous RFQ RLS path
- Connect production custom domain and retire legacy static site
- Add CSV/PDF export for launch and go/no-go reviews
- Paginate admin RFQ table beyond 250 rows
- Automated E2E tests for RFQ + email workflows
- Search Console / analytics integration for marketing KPIs
- Optional SMS notifications for high-priority RFQs
- Admin audit log for status and email changes
- Dynamic sitemap generation from `VITE_SITE_URL`

---

## Quick Links

| Resource | Location |
|---|---|
| Handoff Center (admin) | `/admin/handoff` |
| Launch package | `docs/PUBLIC_LAUNCH_PACKAGE.md` |
| Go/No-Go review | `docs/LAUNCH_GO_NO_GO_REVIEW.md` |
| Monitoring plan | `docs/POST_LAUNCH_MONITORING_PLAN.md` |
| Admin guide | `docs/ADMIN_USER_GUIDE.md` |
