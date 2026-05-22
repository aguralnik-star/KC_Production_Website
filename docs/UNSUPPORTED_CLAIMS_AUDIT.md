# Unsupported Claims Audit

## Purpose

Identify and prevent unsupported claims on the K&C Design and Manufacturing public website. Unsupported claims create legal, credibility, and customer expectation risks — especially around certifications, compliance, equipment ownership, and performance guarantees.

## Unsupported Claims List

### Certifications

| Claim | Risk | Action |
|-------|------|--------|
| ISO certified / ISO 9001 | Critical | Do not use |
| AS9100 | Critical | Do not use |
| ITAR registered | Critical | Do not use |
| FDA approved / medical certified | Critical | Do not use |
| Aerospace certified | Critical | Do not use |
| Military / defense certified | Critical | Do not use |

### Compliance

| Claim | Risk | Action |
|-------|------|--------|
| Certified medical manufacturing | Critical | Do not use |
| Certified aerospace supplier | Critical | Do not use |
| Certified defense supplier | Critical | Do not use |
| Regulated medical device manufacturer | Critical | Do not use |
| ITAR compliant | Critical | Do not use |
| Government-approved supplier | High | Do not use unless verified |

### Equipment

| Claim | Risk | Action |
|-------|------|--------|
| Haas UMC-750 ownership | High | Do not claim unless confirmed |
| 5-axis machining capability | High | Do not claim unless confirmed |
| Live tooling capability | Medium | Do not claim unless confirmed |
| Bar feed capability | Medium | Removed from Capabilities page |
| Lights-out automation | High | Do not claim unless confirmed |

### Customer Claims

| Claim | Risk | Action |
|-------|------|--------|
| Named customers without approval | High | Do not use |
| Customer logos without approval | High | Do not use |
| Fortune 500 customers | High | Do not use |
| OEM-approved supplier | High | Do not use unless confirmed |
| Preferred vendor (unconfirmed) | Medium | Do not use unless confirmed |

### Performance Claims

| Claim | Risk | Action |
|-------|------|--------|
| Guaranteed fastest turnaround | High | Do not use |
| Guaranteed lowest price | High | Do not use |
| Zero defects / perfect quality | High | Do not use |
| Guaranteed tolerances without qualification | Medium | Do not use |
| Same-day quotes (unconfirmed) | Medium | Do not use unless confirmed |
| Emergency machining (unconfirmed) | Medium | Do not use unless confirmed |

### Industry Claims

| Claim | Risk | Action |
|-------|------|--------|
| Military certification implied | Critical | Use "industry served" language only |
| Medical device certification implied | Critical | Use "industry served" language only |

## Why Each Category Is Risky

**Certifications** — Claiming ISO, AS9100, ITAR, or FDA approval without verification is misleading and may violate advertising standards or customer contract requirements.

**Compliance** — Implying regulated manufacturing status (medical devices, defense) creates legal exposure if customers rely on unverified compliance.

**Equipment** — Claiming machines or capabilities K&C does not own sets false expectations for quoting, scheduling, and technical review.

**Customer claims** — Named customers, logos, and Fortune 500 references require explicit approval. Unauthorized use damages trust and may violate confidentiality.

**Performance claims** — Guarantees about speed, price, or zero defects are rarely supportable and create contractual risk.

**Industry claims** — Serving an industry (medical, military) is different from being certified for that industry. The distinction must remain clear.

## Acceptable Replacement Language

| Instead of | Use |
|------------|-----|
| ISO-certified quality | Inspection-driven quality process |
| Medical certified machining | Machining support for medical industry applications |
| Military certified supplier | Machining support for military-related industry applications |
| 5-axis machining capability | CNC machining capability (unless 5-axis equipment is confirmed) |
| Guaranteed fastest turnaround | Prompt quotations and responsive communication |
| Bar-fed turning | Short-run and production CNC turning |
| Zero defects | Inspection-focused manufacturing and repeatability |
| OEM-approved supplier | Machining support for industrial OEM applications |

## Current Site Status

Initial codebase grep found **no ISO, AS9100, ITAR, FDA, 5-axis, UMC-750, or guaranteed performance claims** in public-facing copy. One fix applied: removed unsupported "bar-fed" language from the Capabilities page CNC Turning section.

Testimonials and project showcase content are labeled as **representative examples only**.

Medical and military industries include explicit disclaimers that industry listing does not imply certification.

## Ongoing Monitoring

Before any content update, search for risky terms:

`ISO`, `AS9100`, `ITAR`, `FDA`, `certified`, `certification`, `aerospace`, `defense`, `guaranteed`, `zero defect`, `Fortune`, `OEM approved`, `5-axis`, `UMC-750`, `live tooling`, `bar feed`

Track review status in `/admin/content-qa`.
