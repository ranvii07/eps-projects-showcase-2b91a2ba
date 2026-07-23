-- QA Batch 1 (item 5): seed the public FAQ section shown on /contact so the page
-- no longer renders the "No FAQs available." empty state.
--
-- Content is derived ONLY from facts already approved in docs/WEBSITE_CONTENT_GUIDE.md
-- (Services taxonomy, Industries list, the Engineering -> Procurement -> Supply ->
-- Installation -> Automation -> Testing -> Commissioning capability chain, the
-- PLC/DCS/SCADA + SIS capabilities, and the approved Public Contact Roster / Delhi
-- corporate office). No new business facts, no marketing promises, and no quantified
-- commercial/performance claims (per the Copy Rules no-quantified-claims policy).
-- These remain fully CMS-editable rows in public.faq; this migration only seeds them.
--
-- Idempotent: public.faq has no unique constraint on `question`, so ON CONFLICT is not
-- applicable here. Each row is instead guarded by a NOT EXISTS on the question text
-- (the equivalent "do nothing if already present"), so re-running the migration — or a
-- later CMS edit — will not create duplicates. All rows are published so the existing
-- "faq public read" (anon) policy surfaces them.

insert into public.faq (question, answer, category, sort_order, published)
select v.question, v.answer, v.category, v.sort_order, true
from (values
  ('What services does EPS Projects provide?',
   'EPS Projects provides integrated Electrical & Instrumentation (E&I) project solutions, including engineering, procurement, supply, installation, testing and commissioning services, along with material supply. Work spans six service areas: Engineering, Procurement, Electrical, Instrumentation, Process Control Systems, and Testing & Commissioning.',
   'Services', 1),
  ('Which industries does EPS Projects serve?',
   'EPS Projects serves industrial and clean-energy sectors across India, including Sugar & Distillery, Cement & Steel, Oil & Gas, Petrochemical, Mining, Hydro Power, Infrastructure, and Co-generation / Captive Power plants.',
   'Industries', 2),
  ('Does EPS Projects handle turnkey project execution?',
   'EPS Projects can support projects from engineering and procurement through installation, testing and commissioning, depending on project requirements. This covers engineering, procurement, supply, installation, automation, testing and commissioning services.',
   'Projects', 3),
  ('What automation and control system capabilities does EPS Projects offer?',
   'EPS Projects designs and integrates PLC, DCS and SCADA systems, HMI development, panel integration and relay logic, and Safety Instrumented Systems (SIS) for industrial process control.',
   'Automation', 4),
  ('Where is EPS Projects located and which areas do you cover?',
   'The EPS Projects corporate office is at 212, 2nd Floor, Ansal Chamber-2, 6 Bhikaji Cama Place, New Delhi – 110 066. EPS Projects executes Electrical & Instrumentation projects for clients across India.',
   'Company', 5),
  ('How can I request a quotation?',
   'To request a quotation, contact EPS Projects at info@epsprojects.in or +91 98107 31116, or use the enquiry form on the Contact page. Share your project scope and requirements, and the team will respond.',
   'Contact', 6)
) as v(question, answer, category, sort_order)
where not exists (
  select 1 from public.faq f where f.question = v.question
);
