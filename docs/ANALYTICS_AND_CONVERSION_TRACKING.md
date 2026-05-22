# Analytics and Conversion Tracking

K&C Design and Manufacturing — GA4, Microsoft Clarity, Google Search Console, and RFQ conversion events.

---

## Overview

The site uses a privacy-conscious analytics layer that:

- Loads **Google Analytics 4** and **Microsoft Clarity** only on public pages
- Skips tracking on `/admin/*` routes
- Sends only approved, non-sensitive event parameters
- Tracks RFQ funnel events for post-launch conversion optimization

**Core files:**

| File | Purpose |
|------|---------|
| `src/config/analyticsConfig.js` | Environment variable config |
| `src/utils/analytics.js` | Event helpers and script initialization |
| `src/components/AnalyticsProvider.jsx` | GA4/Clarity bootstrap + Search Console meta |
| `src/components/ConversionTracker.jsx` | Route-based page view tracking |
| `src/hooks/usePageTracking.js` | React Router page view hook |
| `src/hooks/useConversionTracking.js` | RFQ form conversion hook |

---

## Required Vercel Environment Variables

Add these in **Vercel → Project → Settings → Environment Variables**:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=your_clarity_project_id
VITE_SITE_URL=https://www.kcdesignmfg.com
VITE_GOOGLE_SITE_VERIFICATION=your_google_verification_token
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GA4_MEASUREMENT_ID` | Recommended | GA4 Measurement ID (starts with `G-`) |
| `VITE_CLARITY_PROJECT_ID` | Optional | Microsoft Clarity project ID |
| `VITE_SITE_URL` | Recommended | Canonical site URL for SEO and analytics context |
| `VITE_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console HTML tag verification token |

The site **does not crash** if analytics variables are missing. Tracking is simply disabled.

For local development, add the same variables to a `.env` file (never commit secrets).

---

## How to Add GA4 Measurement ID

1. Create a GA4 property in [Google Analytics](https://analytics.google.com/)
2. Go to **Admin → Data Streams → Web**
3. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Add `VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX` to Vercel
5. Redeploy the site
6. Verify in GA4 **Realtime** report while browsing public pages

GA4 is configured with `send_page_view: false` so page views are sent explicitly on React Router navigation.

---

## How to Add Microsoft Clarity Project ID

1. Create a project at [clarity.microsoft.com](https://clarity.microsoft.com/)
2. Add your production domain
3. Copy the **Project ID** from setup instructions
4. Add `VITE_CLARITY_PROJECT_ID=your_project_id` to Vercel
5. Redeploy and confirm sessions appear in Clarity dashboard

Clarity is not loaded on `/admin/*` routes.

---

## How to Verify Google Search Console

1. Add your property in [Google Search Console](https://search.google.com/search-console)
2. Choose **HTML tag** verification method
3. Copy the `content` value from:
   ```html
   <meta name="google-site-verification" content="YOUR_TOKEN_HERE" />
   ```
4. Add `VITE_GOOGLE_SITE_VERIFICATION=YOUR_TOKEN_HERE` to Vercel
5. Redeploy
6. View page source on any public page and confirm the meta tag is present
7. Click **Verify** in Search Console

The tag is injected via `src/components/SEO.jsx` and `src/utils/seoUtils.js`.

---

## Tracked Events

| Event | When it fires |
|-------|---------------|
| `page_view` | Public route change |
| `cta_click` | CTA button or tracked link click |
| `rfq_form_start` | First RFQ form field focus (once per session location) |
| `rfq_form_submit_attempt` | RFQ form submit clicked |
| `rfq_form_submit_success` | Successful RFQ submission / confirmation dedupe |
| `rfq_form_submit_error` | RFQ validation or submit failure |
| `rfq_file_upload_added` | Files added to RFQ form |
| `rfq_file_upload_error` | Invalid file selection |
| `rfq_status_lookup_attempt` | Status lookup form submitted |
| `rfq_status_lookup_success` | Valid RFQ found |
| `rfq_status_lookup_not_found` | No matching RFQ |
| `rfq_status_lookup_error` | Lookup request failed |
| `additional_info_upload_start` | Additional info upload form loaded |
| `additional_info_upload_success` | Additional info submitted |
| `project_showcase_view` | Project details viewed |
| `service_page_view` | Service landing page viewed |
| `phone_click` | Phone link clicked |
| `email_click` | Email link clicked |

---

## Privacy Rules

**Never sent to analytics:**

- RFQ notes or project descriptions
- Uploaded file names
- Customer email addresses
- Phone numbers
- Internal admin data

**Allowed parameters:**

- Page path and title
- CTA label and location
- Service slug
- Project category and showcase title (representative examples only)
- RFQ reference number (validated `KC-RFQ-YYYYMMDD-0000` format only)
- Form status, file count, error category

Admin routes (`/admin/*`) skip public analytics initialization and event tracking.

---

## Conversion Definitions

| Conversion | Definition |
|------------|------------|
| **RFQ Start** | User focuses first RFQ form field |
| **RFQ Submit Attempt** | User clicks Submit RFQ |
| **RFQ Submit Success** | RFQ saved successfully (includes reference number when valid) |
| **RFQ Confirmation** | Confirmation page viewed once per reference number (sessionStorage dedupe) |
| **Status Lookup Success** | Valid reference + email match |
| **Additional Info Success** | Customer completes secure re-upload flow |
| **Primary CTA Click** | Request a Quote, Check RFQ Status, or equivalent tracked CTA |

Mark `rfq_form_submit_success` as a conversion event in GA4 for reporting.

---

## Production QA Checklist

After deploying with environment variables set:

- [ ] GA4 loads in production (check Network tab for `googletagmanager.com/gtag/js`)
- [ ] GA4 Realtime shows active user on public pages
- [ ] Page views fire on route changes (home → contact → capabilities)
- [ ] RFQ start event fires on first form field focus
- [ ] RFQ success event fires after test submission
- [ ] RFQ confirmation does not duplicate conversion for same reference number
- [ ] CTA click events fire from header Request a Quote
- [ ] Phone and email click events fire from header/footer
- [ ] Clarity loads when `VITE_CLARITY_PROJECT_ID` is set
- [ ] Google Search Console verification meta tag appears in page source
- [ ] Admin pages (`/admin/login`, `/admin/rfqs`) do **not** send public conversion events
- [ ] No customer email, phone, notes, or file names appear in GA4 event parameters

---

## Testing Locally

1. Copy analytics env vars to `.env`
2. Run `npm run dev`
3. Open browser DevTools console — in development mode, events log as `[analytics]`
4. Submit a test RFQ on staging Supabase if available
5. Run `npm run build` before deploying

---

## Related Documents

- [Post-Launch 7-Day Monitoring Plan](./POST_LAUNCH_7_DAY_MONITORING_PLAN.md)
- [RFQ Conversion Optimization Plan](./RFQ_CONVERSION_OPTIMIZATION_PLAN.md)
