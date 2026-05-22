# Final Mobile and Cross-Browser QA

K&C Design and Manufacturing — pre-launch responsive and browser compatibility verification.

**Admin dashboard:** `/admin/mobile-browser-qa`  
**Purpose:** Verify the public website and admin login work correctly across mobile, tablet, desktop viewports and major browsers before production launch.

---

## Purpose

This QA pass is the final gate before launch. It confirms:

- Public pages render without horizontal scrolling or broken layouts
- Mobile navigation, RFQ form, status lookup, and file upload workflows are usable
- Service pages, project showcase, and trust sections behave on small screens
- Admin login remains functional
- Major browsers render consistently

All QA state is stored in browser `localStorage` (`kc_mobile_browser_qa_v1`) for the signed-in admin session.

---

## Pages Reviewed

| Path | Label |
|------|-------|
| `/` | Home |
| `/about` | About |
| `/capabilities` | Capabilities |
| `/equipment` | Equipment |
| `/quality` | Quality |
| `/industries` | Industries |
| `/projects` | Projects |
| `/contact` | Contact / RFQ |
| `/rfq/status` | RFQ Status Lookup |
| `/services/cnc-machining` | CNC Machining |
| `/services/cnc-milling` | CNC Milling |
| `/services/cnc-turning` | CNC Turning |
| `/services/tooling` | Tooling |
| `/services/fixtures` | Fixtures |
| `/services/gauges` | Gauges |
| `/services/prototype-machining` | Prototype Machining |
| `/services/production-machining` | Production Machining |
| `/admin/login` | Admin Login |

---

## Viewport Matrix

| Category | Widths |
|----------|--------|
| Mobile | 320px, 375px, 390px, 414px, 430px |
| Tablet | 768px, 820px, 1024px |
| Desktop | 1280px, 1440px, 1920px |

Use browser DevTools responsive mode or physical devices. Record results in the admin dashboard.

---

## Browser Matrix

| Browser | Platform |
|---------|----------|
| Chrome | Desktop |
| Edge | Desktop |
| Safari | Desktop |
| Firefox | Desktop |
| Mobile Safari | iOS |
| Chrome Android | Android |

---

## Mobile QA Checklist

### Layout
- [ ] No horizontal scrolling
- [ ] Text does not overflow
- [ ] Cards stack correctly
- [ ] Images scale correctly
- [ ] Sections have proper spacing
- [ ] Hero sections fit mobile screens
- [ ] Footer columns stack cleanly

### Navigation
- [ ] Mobile menu opens
- [ ] Mobile menu closes
- [ ] All nav links work
- [ ] Dropdown/service links work
- [ ] Logo links to home
- [ ] Header does not overlap content
- [ ] CTA button remains usable

### RFQ Form
- [ ] Fields are readable
- [ ] Labels are visible
- [ ] Inputs are large enough (44px tap targets)
- [ ] File upload works
- [ ] Drag/drop fallback works
- [ ] Error messages display correctly
- [ ] Submit button is easy to tap
- [ ] Confirmation page is readable

### Public RFQ Status Lookup
- [ ] Form fits mobile
- [ ] Reference number field works
- [ ] Email field works
- [ ] Result card is readable
- [ ] CTA buttons stack cleanly

### Additional Info Upload
- [ ] Token page layout works
- [ ] File upload works
- [ ] Success/expired states are readable
- [ ] Upload progress does not overflow

### Service Pages
- [ ] Hero text fits
- [ ] Related service links wrap properly
- [ ] FAQ sections work
- [ ] CTA buttons stack correctly

### Project Showcase
- [ ] Project cards stack
- [ ] Modal works on mobile
- [ ] Modal close button accessible
- [ ] Category filters wrap correctly

### Accessibility on Mobile
- [ ] Tap targets at least 44px
- [ ] Focus states visible
- [ ] Keyboard navigation works where applicable
- [ ] Forms have labels
- [ ] No tiny unreadable text

---

## Cross-Browser QA Checklist

### Chrome
- [ ] Public pages render
- [ ] RFQ form works
- [ ] Admin login works

### Edge
- [ ] Public pages render
- [ ] RFQ form works
- [ ] Admin login works

### Safari
- [ ] Hero gradients render
- [ ] Forms behave correctly
- [ ] File upload works
- [ ] Sticky panels do not break

### Firefox
- [ ] Layout consistency
- [ ] Buttons render correctly
- [ ] Forms work
- [ ] Modals work

### Mobile Safari
- [ ] Viewport height issues checked
- [ ] Header/menu works
- [ ] File upload works
- [ ] Input zoom issues avoided (16px minimum font on inputs)

### Chrome Android
- [ ] Navigation works
- [ ] RFQ form works
- [ ] Status lookup works

---

## Launch Decision

| Status | Criteria |
|--------|----------|
| **Go** | All core pages pass mobile/tablet/desktop; no critical issues; RFQ and status lookup verified on Mobile Safari and Chrome Android; production build passes |
| **Conditional Go** | Minor non-blocking issues documented with owners and target fix dates |
| **No-Go** | Any launch blocker present (see below) |

### Launch Blockers

- Horizontal scrolling on core public pages
- Broken mobile navigation
- RFQ form unusable on mobile
- File upload broken on mobile
- Admin login broken
- Public status lookup broken
- Critical layout issue on homepage
- CTA buttons unusable
- Text unreadable
- Broken production build

Record the final decision in the admin dashboard evidence notes and launch go/no-go review.

---

## Related Documents

- [Mobile QA Fix List](./MOBILE_QA_FIX_LIST.md)
- [Cross-Browser QA Report](./CROSS_BROWSER_QA_REPORT.md)
