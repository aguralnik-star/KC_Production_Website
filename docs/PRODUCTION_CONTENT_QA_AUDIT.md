# Production Content QA Audit

## Purpose

This audit verifies all public K&C Design and Manufacturing website content before production launch. The goal is to ensure accuracy, credibility, legal safety, SEO quality, and consistency with verified business information — without overstating capabilities, certifications, or customer relationships.

## Pages Reviewed

| Path | Page |
|------|------|
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

## Allowed Verified Facts

### Company Identity

- **Name:** K&C Design and Manufacturing, Inc.
- **Address:** 422 S. Irmen Drive, Addison, IL 60101
- **Phone:** (630) 543-3386
- **Email:** info@kcdesignmfg.com
- **Founded:** 1987
- **Founder:** Keith Clark

### Company History

- Founded in Carol Stream, Illinois
- Started with inspection gauging, production tooling, and manufacturing fixtures
- Machining capabilities added in 1992
- First dedicated facility in 1997
- Expanded into current Addison facility in 2011

### Allowed Capabilities

CNC machining, CNC milling, CNC turning, prototype machining, production machining, tooling, fixtures, gauges, inspection fixtures, custom machined components, quality inspection, CAD/CAM programming, Mastercam programming.

### Allowed Equipment

Haas VF-2, Haas VF-3 vertical machining centers, 4-axis rotary table capability, Haas ST-10 CNC lathe, Mitutoyo Crysta-Plus M574 CMM, optical comparator, profilometer, air gauging equipment, inspection microscope, video borescope systems, thread/plug/ring/pin gauges, micrometers, calipers, bore gauges, Mastercam.

### Allowed Materials

Carbon steels, tool steels, stainless steels, aluminum alloys, brass, copper, bronze, cast iron, Delrin, Nylon, UHMW, PVC, Lexan, engineering plastics.

### Allowed Industries (Served — Not Certified)

Transportation, medical, automotive, hydraulics, valves, heavy equipment, material handling, gaming, electronics, food service, military, custom inspection fixtures, gauges.

## Content QA Checklist

### 1. Business Identity Accuracy

- [ ] Company name consistent
- [ ] Address consistent
- [ ] Phone consistent
- [ ] Email consistent
- [ ] Founded date consistent
- [ ] Founder/history accurate

### 2. Capability Accuracy

- [ ] CNC machining language accurate
- [ ] CNC milling language accurate
- [ ] CNC turning language accurate
- [ ] Tooling language accurate
- [ ] Fixture language accurate
- [ ] Gauge language accurate
- [ ] Prototype/production language accurate

### 3. Equipment Accuracy

- [ ] Only verified equipment listed as owned
- [ ] Representative equipment clearly labeled
- [ ] No unsupported 5-axis ownership claims
- [ ] No unsupported machine specs

### 4. Certification / Compliance Safety

- [ ] No ISO claim
- [ ] No AS9100 claim
- [ ] No ITAR claim
- [ ] No FDA/medical certification claim
- [ ] No aerospace certification claim
- [ ] No defense certification claim

### 5. Customer / Industry Safety

- [ ] No fake testimonials presented as real
- [ ] Representative testimonials clearly labeled
- [ ] No customer logos unless approved
- [ ] Industry served language does not imply certification

### 6. SEO Quality

- [ ] No keyword stuffing
- [ ] Unique title/meta per page
- [ ] Natural internal links
- [ ] Accurate service descriptions
- [ ] Local SEO information consistent

### 7. RFQ Conversion Content

- [ ] CTA text clear
- [ ] RFQ instructions accurate
- [ ] File upload instructions accurate
- [ ] Confirmation/status language clear
- [ ] No promise of quote turnaround unless confirmed

## Codebase Audit Summary (Initial Pass)

| Area | Status | Notes |
|------|--------|-------|
| Certifications (ISO, AS9100, ITAR, FDA) | Pass | No public certification claims found |
| Equipment (UMC-750, 5-axis) | Pass | Not referenced in public copy |
| Bar feed capability | Fixed | Removed from Capabilities page |
| Military industry language | Fixed | Softened in company.js; industriesData already disclaims certification |
| Testimonials | Pass | All labeled as representative examples |
| Projects | Pass | Clearly labeled as representative only |
| NAP consistency | Pass | company.js matches footer, contact, schema |

## Admin Dashboard

Track review progress at `/admin/content-qa` (admin authentication required).

## Final Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Content Reviewer | | | Pending |
| Marketing / SEO | | | Pending |
| Operations / Shop Floor | | | Pending |
| Final Launch Sign-Off | | | Pending |

**Launch criteria:** All 17 public pages approved, zero flagged high/critical unsupported claims, all 7 QA categories marked reviewed.
