# Mobile QA Fix List

K&C Design and Manufacturing — prioritized mobile responsiveness fixes.

Track issue status in `/admin/mobile-browser-qa`.

---

## Critical Mobile Fixes

Fix before launch if observed:

| Issue | Page | Fix Applied |
|-------|------|-------------|
| Horizontal scroll on narrow viewports | All public pages | `overflow-x-hidden` on body; `min-w-0` on containers |
| Input zoom on Mobile Safari | Contact / RFQ | 16px minimum font size on inputs below 640px |
| Modal exceeds viewport | Projects | `max-h-[calc(100dvh-2rem)]` + scroll on project modal |
| Long email/phone overflow | Footer, Contact | `break-anywhere` utility on contact links |
| Hero headline too large at 320px | Home, Service pages | Responsive `text-3xl` base headline size |

---

## High-Priority Mobile Fixes

| Issue | Recommendation | Status |
|-------|----------------|--------|
| Mobile menu focus trap | Verify Escape closes menu; tab stays in menu | Test in QA dashboard |
| RFQ sticky sidebar on tablet | Confirm trust panel un-stacks below `lg` breakpoint | Verify on Contact page |
| Service dropdown on mobile | Confirm ServicesMobileSection links are tappable | Test in Header |
| File upload tap target | Ensure drag-drop zone meets 44px minimum height | Verify RFQForm |
| Status lookup result card | Confirm readable spacing on 320px | Test /rfq/status |

---

## Medium-Priority Mobile Fixes

| Issue | Recommendation |
|-------|----------------|
| Admin table overflow | Admin dashboards use `overflow-x-auto` wrappers |
| Category filter wrap | Project filters use flex-wrap |
| CTA button stacking | CTAs use `flex-col sm:flex-row` patterns |
| Footer grid stacking | Footer uses `md:grid-cols-2 lg:grid-cols-4` |
| Trust section cards | Trust components use responsive grids |

---

## Post-Launch Mobile Improvements

- Add real-device screenshot evidence to QA dashboard
- Test on additional Android screen sizes (360px, 412px)
- Review Core Web Vitals mobile field data after launch
- Consider sticky RFQ CTA on long Contact page scroll
- Evaluate PWA or add-to-home-screen for repeat RFQ customers

---

## Verification

After fixes:

1. Run `npm run build`
2. Test at 320px, 375px, and 390px widths
3. Test RFQ submit flow on Mobile Safari
4. Update page review table in admin QA dashboard
5. Mark issues resolved in Mobile Issue Tracker
