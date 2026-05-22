# Content Fix List

## Critical Fixes

| ID | Issue | Location | Status | Resolution |
|----|-------|----------|--------|------------|
| C-01 | No ISO/AS9100/ITAR/FDA claims in public copy | Site-wide | Pass | Verified via codebase grep — no claims found |
| C-02 | Military industry must not imply certification | Industries, company.js | Fixed | Softened military description; industriesData includes disclaimer |
| C-03 | Medical industry must not imply certification | Industries | Pass | Listed as industry served only |

## High-Priority Fixes

| ID | Issue | Location | Status | Resolution |
|----|-------|----------|--------|------------|
| H-01 | Unsupported bar feed capability claim | Capabilities.jsx | Fixed | Changed to "Short-run and production quantities" |
| H-02 | No UMC-750 or 5-axis equipment claims | Equipment, services | Pass | Verified — not referenced |
| H-03 | Testimonials must be labeled representative | TestimonialSection | Pass | All testimonials marked `isRepresentative: true` with section disclaimer |
| H-04 | Projects must be labeled representative | Projects page, modals | Pass | Clear "representative only" language throughout |

## Medium-Priority Fixes

| ID | Issue | Location | Status | Resolution |
|----|-------|----------|--------|------------|
| M-01 | Gaming industry in allowed list but not on Industries page | industriesData.js | Open | Add Gaming industry card when approved |
| M-02 | "OEM applications" in company.js industries | company.js | Review | Generic "industrial OEM applications" — acceptable if not claiming approval |
| M-03 | NAP consistency across schema and pages | company.js, siteConfig | Pass | Address, phone, email match |

## Approved Language Replacements

| Remove / Avoid | Approved Alternative |
|----------------|---------------------|
| ISO-certified quality | Inspection-driven quality process |
| Medical certified machining | Machining support for medical industry applications |
| Military certified supplier | Machining support for military-related industry applications |
| 5-axis machining capability | CNC machining capability |
| Guaranteed fastest turnaround | Prompt quotations and responsive communication |
| Bar-fed turning | Short-run and production CNC turning |
| Zero defects | Inspection-focused manufacturing and repeatability |

## Pages Requiring Manual Review

Use `/admin/content-qa` to mark each page:

1. Home — verify hero claims, trust signals, representative testimonials
2. About — verify timeline dates and founder history
3. Capabilities — verify capability bullets match shop floor
4. Equipment — verify only listed equipment is owned
5. Quality — verify no certification overstatement
6. Industries — verify industry-served vs certified distinction
7. Projects — verify representative labeling
8. Contact / RFQ — verify upload instructions and CTA accuracy
9. All 8 service pages — verify capability and application language

## Final Sign-Off

| Checkpoint | Owner | Date | Approved |
|------------|-------|------|----------|
| Unsupported claims grep clean | | | |
| All 17 pages reviewed | | | |
| Equipment list verified with shop | | | |
| Testimonials/projects labeled | | | |
| RFQ copy accurate | | | |
| SEO titles/descriptions unique | | | |
| **Production content approved** | | | |

**Do not launch until:** Zero critical/high unsupported claims flagged, all pages marked approved in Content QA dashboard.
