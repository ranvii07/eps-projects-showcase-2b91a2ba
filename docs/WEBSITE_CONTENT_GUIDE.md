# EPS Projects — Website Content Guide

Version: 1.0
Status: Stable
Last Updated: 2026-07-15

**Canonical content reference for the EPS Projects website only.**
Created 2026-07-08. Documentation-only file. No code or workflow behavior depends on it.

---

## ⚠️ How to use this file (read first)

This document exists **solely** as a future content source, so the same approved
business information does not have to be re-requested every time a task needs website
copy. It is **not** a memory file, workflow file, implementation guide, or Blueprint
replacement.

**Do not use this document automatically.**

1. Continue following the existing workflow exactly as defined in the Blueprint, and the
   current implementation / Review-Gate process.
2. Consult this file **only** when a task **explicitly** requires website content,
   website copy, SEO copy, UI text, page messaging — or explicitly asks you to read it.
3. This document does **not** override, and is subordinate to:
   - `BLUEPRINT.md` (Downloads\EPS_Website_Opus_Blueprint.md)
   - `PROGRESS.md`
   - the Review-Gate workflow
   - `lessons/`
   - the approved implementation process
4. Do **not** reference this file during unrelated implementation tasks.
5. Do **not** create code or process dependencies on this file.
6. Do **not** change any current implementation because of this file.
7. Future approved business content is simply **appended** to the relevant section below,
   with its approval date.

**Business-data gate still applies.** Everything currently in this file was explicitly
approved by the user (2026-07-08, and earlier registry approvals as noted). Any _new_
fact must still pass the Review Gate before it is added here or shipped. Values marked
_(placeholder — needs approval)_ must NOT be published until approved.

---

## Scope

This document governs only website-facing content.

It does not govern:

- UI architecture
- component implementation
- routing
- backend
- database
- APIs
- performance
- accessibility
- testing
- project workflow

Those remain governed by the Blueprint and project documentation.

---

## Content Classification Policy (canonical, 2026-07-08)

Governs **where** each category of information may be published. Complements the
no-quantified-claims rule under Copy Rules; this section is the authoritative statement.

### 1. Public Website

The public website is a **marketing and lead-generation platform**.

**It should contain:**

- Company overview
- Services
- Industries
- Approved company facts and statistics
- General value propositions
- Contact information
- Careers (if applicable)

**It must NOT contain:**

- Quantified commercial claims
- Cost-saving percentages
- ROI figures
- OEE / PLF improvements
- Energy-saving figures
- Productivity improvements
- Execution speed improvements
- Client-specific performance outcomes
- Pricing
- Commercial commitments
- Negotiation-sensitive information

Only factual company metrics explicitly approved for publication (e.g. 25+ Years of Team
Experience, 1000+ Projects Delivered, 25+ Core Engineers, 150+ Technical Workforce, etc.)
may be published.

### 2. Credentials Portal (Restricted Access)

The Lovable credentials portal is intended for **qualified prospects, existing clients, and
sales-controlled access**. Appropriate location for:

- Detailed project case studies
- Technical documentation
- Project galleries
- Client references
- Performance metrics
- OEE improvements
- PLF improvements
- Energy-saving results
- Cost optimization examples
- ROI analyses
- Capability presentations
- Downloadable brochures
- Supporting engineering documentation

Quantified project outcomes may be included in the credentials portal **only after explicit
business approval** — it is restricted-access content, not public marketing content.

### 3. Proposals & Client Meetings

Commercial negotiations remain outside both the public website and the credentials portal
unless explicitly approved. Items such as:

- Pricing
- Commercial terms
- Negotiated savings
- Project-specific guarantees
- Financial analyses
- Custom ROI calculations

belong in proposals, technical presentations, and client meetings.

### Source Hierarchy (all future website work)

1. **Website Blueprint** — defines what is to be built.
2. **Approved Owner Decisions / Project Directives** — the latest canonical business
   decisions; they override earlier assumptions in the Blueprint or other documentation
   where applicable.
3. **WEBSITE_CONTENT_GUIDE.md** — the canonical website content and publication policies.
4. **EPS Projects Presentation Deck** — the primary source for business messaging,
   positioning, differentiators, and factual company information, but **subject to the
   governance established by the documents above**.

The deck governs **messaging, tone, differentiators, and positioning** within these bounds;
this Content Classification Policy governs **where** each category of information may be
published.

### Future Implementation Rule

This policy supersedes any previous assumption that quantified project outcomes from the PPT
deck should automatically appear on the public website. For future tasks (**including T3.11
Representative Projects**):

- Do NOT publish quantified commercial or performance outcomes on the public website simply
  because they exist in the PPT deck.
- If the deck contains OEE/PLF improvements, energy savings, ROI, efficiency gains, cost
  savings, or similar project metrics, treat them as **Credentials Portal content by
  default**, not public website content.
- Only factual company metrics explicitly approved for publication may appear on the public
  website.

---

## Company Highlights

Approved 2026-07-08 (highlight set for use on marketing surfaces).

- Electrical
- Instrumentation
- Automation
- Clean Energy
- 25+ Years of Team Experience
- 1000+ Projects Delivered
- ₹100 Cr+ Revenue in Last 5 Years
- 25+ Core Engineers
- 150+ Technical Workforce (including 25+ Core Engineers)

---

## Core Capabilities

Approved 2026-07-08.

- Engineering
- Procurement
- Supply
- Installation
- Automation
- Testing
- Commissioning

---

## Services

Approved & shipped in **T3.6** (2026-07-08). The six service categories live as CMS
`services` rows (descriptions stored as newline-separated bullet lines, rendered as a
bulleted capability list on `/services`); Material Supply and the industries strip are
hardcoded in `Services.tsx`. These are canonical — reuse verbatim.

### Six service categories (CMS `services` rows) — approved T3.6

1. **Engineering Services** — Electrical System Basic & Detail Design (up to 66KV) ·
   Design & Layout Services · ELV Systems: CCTV, Building Access, PAGA ·
   SCADA / PLC / Distributed Control Systems · Process Control Instrumentation & Metering Skids
2. **Procurement Services** — Contract Negotiation with Vendors · Procurement of Equipment
   & Materials · Purchasing and Expediting of Materials · Inspection Services (FAT & Site
   Inspections) · Material Control and Warehousing
3. **Electrical Services** — Earthing & Lightning Protection Systems · Lighting & Heat
   Tracing Systems · Electrical Sub-station up to 66KV and MCC · HV & LV Cable Installation
   & Termination · Power Transformer Installation up to 66KV
4. **Instrumentation Services** — Installation of Remote Instrument Enclosures · Integration
   of Analyzers in Shelters · Installation of SCADA/PLC/DCS Systems · Process Control Field
   Instruments · Metering Skids & Gas Detection Installation
5. **Process Control Systems** — DCS / PLC Programming · SCADA / HMI Development · Panel
   Integration & Relay Logic · Safety Integrated Systems (SIS) · Tank Gauging & Terminal
   Automation Systems
6. **Testing & Commissioning** — Transformer Testing · Electrical Testing & Inspection ·
   Switchgear (HV & LV) and MCC Testing · UPS, Battery & Charger Testing · Field Instrument
   Testing & Inspection

### Material Supply (hardcoded, three blocks) — approved T3.6

- **Instrumentation:** Field Instruments & Hardware · Instrument Fittings, Flow Meters ·
  Flow Elements, Valves, Cables · Cable Trays, JBs, Glands
- **Electrical Packages:** HT / LT Panels, DBs, Cables, Termination Kits · Cable Trays,
  Lighting Systems, Hardware · Earthing Protection, Bus Duct · Transformers, DG Sets,
  Battery Chargers
- **Sub-Station & Control:** Substations up to 132 KV Rating · Breaker, Isolator, CT, PT, LA
  · PLC, DCS, SCADA, EMS, VFDs · UPS, Battery, Charger Systems

### Industries Served (strip on /services) — approved T3.6

Pill strip reusing the already-approved §7.4 sectors, linking to `/industries`:
Sugar & Distillery · Cement & Steel · Mining · Petrochemical · Infrastructure · Clean Energy.
The full 8-industry list lives on `/industries` (T2.1).

### Capability facts (§7.5-C) — NOT yet used

Switchyards up to 132 KV · 11 kV / 33 kV Transmission Lines · Sub-Stations up to 132 KV ·
Power Transformer Installation up to 66 KV · SIS/ESD, Fire & Gas, PAGA & Telecom Systems ·
Loop Checking, Pre-commissioning, Final SAT · After-support: Virtual & On-site.
_Available if a future task wants to surface them; not on the page as of T3.6._

---

## Why Choose Us — RETIRED (not on any surface as of 2026-09-07)

> **Status: removed from the website.** The standalone `/why-choose-us` route was removed
> 2026-09-03; the homepage section and `WhyChooseUs.tsx` were removed 2026-09-07. This copy
> is **not published anywhere** and must not be reintroduced without a new approval. The
> section is kept only as a record of approved wording, in case the content is ever revived
> or reused elsewhere.

If this content is ever revived, it must **always** use **company-specific differentiators and
approved business facts** — never generic marketing statements. Prefer concrete, verifiable
claims (team experience, project volume, turnkey capability, pan-India reach, specific
sectors served, safety/quality posture) over interchangeable corporate filler.

### Six competitive advantages (was hardcoded in WhyChooseUs.tsx) — approved T3.7 (2026-07-08), retired 2026-09-07

Section intro: "What makes EPS outstanding — modern engineering, automation-first execution,
and customer-first delivery on every project." (heading: "Why Choose EPS Projects").

1. **Modern Industrial Units** — Establishment of advanced, highly-efficient industrial
   systems using the latest technology and engineering practices.
2. **Automation-First Approach** — Advanced automation for higher accuracy & control of the
   process — achieving efficient, reliable production output.
3. **Lower Project Costs** — A single, integrated partner for procurement and execution
   removes the overheads and coordination gaps of fragmented multi-vendor approaches.
4. **Higher Plant Efficiency** — Superior electrical design, precise instrumentation, and
   quality commissioning that deliver dependable, efficient plant performance.
5. **Fast-Track Execution** — Unconventional construction methods with prefab panels — fast
   execution, minimal rework, maximum quality.
6. **Customer-First Delivery** — We deliver time & cost benefits to customers through our
   engineering & execution capabilities — every project, every time.

Note (policy revision 2026-07-08): points 3 and 4 were rewritten to REMOVE the earlier
quantified/performance claims — "cost savings of 20–35%" and "High Plant Load Factor (PLF)" —
per the no-quantified-claims policy in Copy Rules. The revised wording above is aligned to the
deck's slide-12 positioning ("Smarter Design → Lower Capex", "superior performance"). Reuse the
revised text verbatim.

---

## Public Contact Roster

Approved for publication 2026-07-09 (T3.9 ⛔ checkpoint — user publication decisions). This is
the **canonical public subset** of §7.10. Only the items below may appear on the public website;
everything under "Internal — do NOT publish" stays off public surfaces. Reuse verbatim.

**Leadership contacts (display with name + title, this exact format):**

- Digvijay Tanwar, Director: +91 98107 31116 _(`tel:+919810731116`)_
- Surender Chahal, Chief Operating Officer: +91 90719 70000 _(`tel:+919071970000`)_

**Emails:** info@epsprojects.in · surender@epsprojects.in

**Office (public):** Corporate Office — 212, 2nd Floor, Ansal Chamber-2, 6 Bhikaji Cama Place,
New Delhi – 110 066.

**Internal — do NOT publish on the public website:**

- Technical/operational personnel: Nitesh Singh, Purnima Bhandari, Nitin Singh (and their
  numbers) — internal operational contacts only.
- Emails: dvt@epsprojects.in, nitesh@epsprojects.in.
- The Ghaziabad (UP) office / Govind Puram address, and any office other than Delhi Corporate.
- Bank / account details — **excluded unconditionally** (all surfaces).

Shipped in T3.9 on ContactInfo.tsx and Footer.tsx. As of **T4.2 (2026-07-09)** this same roster
is also emitted as structured data — the Organization + LocalBusiness JSON-LD in `__root.tsx`
carry the Delhi corporate address, both leadership numbers, and info@ + surender@ (shared
`POSTAL_ADDRESS` / `CONTACT_POINTS` constants). The contact/privacy/terms routes may use info@ +
the Director number (within this approved set). Any change to the public roster must be updated
in all three places: the contact components, the JSON-LD constants, and this section.

---

## Copy Rules

Currently approved rules (superset of Blueprint §7.9; this file records them for content
work, it does not replace §7.9):

- **Company established in 2021.** Use "Established 2021" / "Est. 2021".
- **"25+ years" always refers to the team / leadership, never the company.** Never state or
  imply the company itself is 25 years old. Canonical framing: "25+ Years of Team
  Experience".
- **Use canonical wording consistently** across every surface (reuse the exact approved
  strings; do not paraphrase approved facts).
- **Preserve factual accuracy** — no invented stats, dates, certifications, client names,
  or capability claims. All business facts pass the Review Gate first.
- **Maintain SEO-friendly copy** — clear, keyword-relevant, human-readable; no keyword
  stuffing.
- **Avoid generic corporate language where company-specific information exists** — replace
  filler with concrete EPS facts.
- **Banned phrasing** (Blueprint §7.9 / §0.5): "A Decade of Expertise"; bank / account
  details; the business-model revenue percentages; personal phone numbers not explicitly
  approved.
- **Brand name:** "EPS Projects Pvt. Ltd." (formal) / "EPS Projects" (running text). Domain
  family: epsprojects.in.
  - **Legal-entity exception (confirmed 2026-07-09):** the full registered legal name
    **"EPS Projects Private Limited"** is intentionally retained in legal/registration
    contexts — the footer copyright line (© notice) and registration notices (GSTIN/CIN/PAN).
    Do NOT "normalize" these to "Pvt. Ltd." The branding rule above governs marketing and
    running copy only.
- **Four pillars are always ordered:** Electrical · Instrumentation · Automation · Clean
  Energy.
- **Never infer new business claims.** If a business fact is not present in this document and has not been approved through the Review Gate, treat it as unknown rather than generating or assuming it.
- **No quantified commercial or performance claims in public copy (canonical policy, 2026-07-08).**
  Do NOT publish numerical commercial or performance figures on the public website — cost
  savings, efficiency/productivity gains, ROI, execution-speed improvements, PLF improvements,
  and the like. These values are reserved for proposals, technical presentations, and client
  negotiations, where they are discussed against the client's specific project. Only publish
  factual **company metrics** that have been explicitly approved (e.g. 25+ Years of Team
  Experience, 1000+ Projects Delivered, ₹100 Cr+ Revenue in Last 5 Years, 25+ Core Engineers,
  150+ Technical Workforce, years in business).
- **Primary messaging reference = the EPS Projects presentation deck.** When drafting or
  refining website copy, align tone, positioning, differentiators, and value proposition to
  `Downloads\EPS Projects Profile 2026 For Web.pptx`. Prefer the deck's own language over
  inventing new marketing copy. If sources conflict, the deck takes precedence for business
  messaging (subject to the no-quantified-claims policy above and §7.9).

---

## SEO / Messaging

Seed values below are drawn from currently shipped, approved copy where noted; keyword
lists are **placeholders pending approval** and must not be published as meta content until
approved.

### Primary keywords

_(placeholder — needs approval)_

- Electrical & Instrumentation engineering
- Industrial automation
- Turnkey electrical projects (India)

### Secondary keywords

_(placeholder — needs approval)_

- PLC / DCS / SCADA solutions
- Installation, testing & commissioning
- Clean energy / co-generation projects
- Distillery / ethanol / sugar / steel / cement plant electrical

### Homepage messaging

Currently shipped (approved):

- **Headline:** "Engineering Excellence in Electrical & Instrumentation Solutions"
- **Subhead (approved T3.5, 2026-07-08):** "Delivering End-to-End Electrical,
  Instrumentation & Automation Solutions for Efficient & Sustainable Industrial Energy
  Systems." _(supersedes the earlier "Delivering integrated … testing and commissioning."
  subhead.)_
- **Feature bullets:** ISO Certified Quality Standards · 25+ Years of Team Experience ·
  Clean Energy Focus · Turnkey Project Solutions _(kept as-is in T3.5; surfacing the four
  pillars visually deferred to the UI refinement phase)_
- _Future approved homepage copy appended here._

### About page messaging

Currently shipped (approved):

- "Established in 2021 and led by Mr. Digvijay Tanwar, EPS Projects Pvt. Ltd. provides
  integrated Electrical & Instrumentation engineering, supply, installation, testing,
  commissioning, and automation services across India."
- Leadership carries 25+ years of industry experience (team/leadership-framed).

**§7.3 About copy shipped in T3.8 (2026-07-09).** Now canonical on the About page — reuse
verbatim:

- **Who We Are:** "EPS Projects Pvt. Ltd. offers comprehensive Electrical & Instrumentation
  Project solutions — integrating design, supply, installation, automation, and commissioning
  under one expert roof." _(formal brand token per §7.9 #3, not the deck's "Private Limited".)_
- **Expertise list (7):** Electrical & Instrumentation Project Design & Engineering ·
  Instrumentation, Control & Automation — PLC, DCS, SCADA · Safety Instrumented System (SIS)
  Design & Implementation · Functional Safety Management Consulting · Construction, Erection &
  Commissioning Services · Low Voltage Electrical & ELV Systems · Engineering, Procurement,
  Supply, Installation, Automation, Testing, Commissioning.
- **Clean-energy specialisation:** "EPS leads integration of E&I solutions for India's clean
  energy plants:" Co-generation & Captive Power Plants · Distilleries & Ethanol Plants · Spent
  Wash Incineration Systems · Waste Heat Recovery Units · Pollution Control Systems.
- **Our Vision:** "To be focused, committed & challenging — delivering excellence and scale in
  Electrical, Instrumentation & Automation services across India's industrial energy sector."
- **Our Mission:** "To constantly deliver high-quality E&I services that satisfy the needs and
  expectations of our customers — on time, within budget, and with zero compromise on safety."
- **QHSE Policy:** "We are committed to doing it right the first time — continuously improving
  to meet customer satisfaction and regulatory requirements in quality, environmental
  protection, workplace safety, and health." _(rendered above the CMS `hse_content` block.)_
- _Future approved About copy appended here._

### Services messaging

- Positioning: "End-to-End Engineering & Execution Partner for Efficient & Sustainable
  Industrial Energy Systems."
- Core capability chain: Engineering → Procurement → Supply → Installation → Automation →
  Testing → Commissioning.
- _Detailed, de-generified per-service copy appended here when T3.6 is approved._

### Clients page messaging

Currently shipped (approved, T3.10 infra 2026-07-11):

- **Meta description (generic, no client names):** "EPS Projects is trusted by leading
  organizations across power, sugar, distillery, steel, and infrastructure sectors throughout
  India — delivering integrated Electrical & Instrumentation project solutions."
- The client showcase (/clients grid + homepage banner) is fully CMS-driven; **client names and
  logos must never be hardcoded** in copy or markup (the earlier hardcoded names in the SEO
  description were removed). Individual client names are published only as CMS rows, subject to
  the ⛔ publication approval for the client list.

### CTA messaging

Currently shipped (approved):

- "Explore Our Services"
- "Request Consultation"
- _Future approved CTA variants appended here._

### Future approved copy additions

_Append new approved copy blocks here, each with its approval date and the surface it
applies to._

---

## FAQ (Contact page)

Approved 2026-07-15 (QA Batch 1, item 5). The public FAQ shown on `/contact` is CMS-driven
(`public.faq` rows) and initially seeded by migration
`supabase/migrations/20260715000000_seed_faq_content.sql`. The copy below is **canonical** —
reuse verbatim if re-seeding. It is derived entirely from facts already approved elsewhere in
this guide (Services taxonomy, Industries list, the Engineering→…→Commissioning capability
chain, PLC/DCS/SCADA + SIS capabilities, and the Public Contact Roster). No new business facts,
no marketing promises, and no quantified commercial/performance claims. Rows remain fully
editable in the admin CMS.

1. **What services does EPS Projects provide?** — "EPS Projects provides integrated Electrical &
   Instrumentation (E&I) project solutions, including engineering, procurement, supply,
   installation, testing and commissioning services, along with material supply. Work spans six
   service areas: Engineering, Procurement, Electrical, Instrumentation, Process Control Systems,
   and Testing & Commissioning."
2. **Which industries does EPS Projects serve?** — "EPS Projects serves industrial and
   clean-energy sectors across India, including Sugar & Distillery, Cement & Steel, Oil & Gas,
   Petrochemical, Mining, Hydro Power, Infrastructure, and Co-generation / Captive Power plants."
3. **Does EPS Projects handle turnkey project execution?** — "EPS Projects can support projects
   from engineering and procurement through installation, testing and commissioning, depending on
   project requirements. This covers engineering, procurement, supply, installation, automation,
   testing and commissioning services."
4. **What automation and control system capabilities does EPS Projects offer?** — "EPS Projects
   designs and integrates PLC, DCS and SCADA systems, HMI development, panel integration and relay
   logic, and Safety Instrumented Systems (SIS) for industrial process control."
5. **Where is EPS Projects located and which areas do you cover?** — "The EPS Projects corporate
   office is at 212, 2nd Floor, Ansal Chamber-2, 6 Bhikaji Cama Place, New Delhi – 110 066. EPS
   Projects executes Electrical & Instrumentation projects for clients across India." _(Delhi
   corporate office only, per the Public Contact Roster; the Ghaziabad office stays internal.)_
6. **How can I request a quotation?** — "To request a quotation, contact EPS Projects at
   info@epsprojects.in or +91 98107 31116, or use the enquiry form on the Contact page. Share your
   project scope and requirements, and the team will respond." _(info@ + Director number, within
   the approved public roster.)_

---

## Change log

- 2026-07-08 — File created. Seeded with the approved Company Highlights, Core
  Capabilities, Services taxonomy (placeholders), Why Choose Us rule, Copy Rules, and
  SEO/Messaging seed + placeholders.
- 2026-07-08 — T3.5: recorded the approved Homepage Hero subheadline; noted the Hero
  value-prop bullets are retained (pillars-as-bullets deferred to UI refinement).
- 2026-07-08 — T3.6: recorded the approved Services content — six CMS service categories,
  the hardcoded Material Supply blocks, and the /services industries strip. Filled the
  earlier Services placeholders with the canonical §7.5 copy.
- 2026-07-08 — T3.7: recorded the six approved Why Choose Us competitive advantages (§7.6)
  - section intro; flagged the 20–35% cost-savings and PLF claims now live.
- 2026-07-08 — T3.7 revision + policy: added the canonical no-quantified-commercial/performance-
  claims rule and the deck-as-primary-messaging-reference rule; rewrote Why Choose Us points 3
  (removed "20–35%") and 4 (removed "PLF") to conform, aligned to deck slide 12.
- 2026-07-08 — Added the canonical **Content Classification Policy** (Public Website vs
  Credentials Portal vs Proposals), the Source Hierarchy, and the Future Implementation Rule
  (deck-sourced quantified outcomes → Credentials Portal by default; affects T3.11).
- 2026-07-08 — Finalized the **Source Hierarchy** to the actual governing artifacts:
  Website Blueprint → Approved Owner Decisions/Directives → WEBSITE_CONTENT_GUIDE.md →
  EPS deck (deck is primary for messaging but subject to the governance above).
- 2026-07-09 — T3.8: recorded the §7.3 About-page copy now shipped on the About page (Who We
  Are, 7-item expertise list, clean-energy specialisation, Vision/Mission, QHSE policy line).
  No new business facts (all from §7.3); brand token normalized to "Pvt. Ltd." per §7.9 #3.
- 2026-07-09 — T3.9 ⛔: added the canonical **Public Contact Roster** (user publication
  decisions) — public subset = two leadership contacts (name+title), info@/surender@ emails,
  Delhi Corporate office; technical personnel, dvt@/nitesh@, and the Ghaziabad office stay
  internal; bank details excluded. Shipped on ContactInfo.tsx + Footer.tsx (removed the
  unapproved +91 93156 17532 number and dvt@).
- 2026-07-09 — T4.2: the Public Contact Roster is now also emitted as Organization +
  LocalBusiness JSON-LD in \_\_root.tsx (no new facts); noted the three-places-to-update rule.
- 2026-07-11 — T3.10 (infra): recorded the generic (name-free) /clients meta description and
  the "never hardcode client names/logos" rule; client showcase is CMS-driven. (Storage: a
  bucket-scoped anon read policy now lets public visitors load client logos from the private
  client-images bucket — see lesson 16. No client rows seeded yet.)
- 2026-07-15 — QA Batch 1 (item 5): added the canonical **FAQ (Contact page)** section — six
  public FAQ Q&A entries seeded via migration `20260715000000_seed_faq_content.sql` to replace the
  "No FAQs available." empty state on `/contact`. No new business facts (all derived from the
  approved Services taxonomy, Industries list, capability chain, PLC/DCS/SCADA + SIS capabilities,
  and the Public Contact Roster); no quantified/commercial claims. FAQ rows remain CMS-editable.
- 2026-09-07 — **Why Choose Us retired.** The homepage section and `WhyChooseUs.tsx` were
  removed (the standalone `/why-choose-us` route had already gone on 2026-09-03), so the six
  §7.6 competitive advantages are no longer published on any surface. The section above is kept
  as an approved-copy record only and is marked RETIRED; reviving it needs fresh approval.
