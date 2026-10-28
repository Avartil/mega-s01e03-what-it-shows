# Booking-v3 date hint says MM/DD/YYYY for day-first tenants — 33 reports

Source ticket: #4471. Course dataset: export dated 2026-10-04.
Cause key: `hint`.
Report count: **33 unique reports**, across **3 tenants**, received **2026-04-17 through 2026-09-22**.

## Engineering outcome

The course's engineering update states #4471 closed on 5 October: hint **WON'T FIX**, because the **booking-v3 form was retired**. Close this ticket as **not planned**. Retirement removes the affected form; it does not demonstrate that the misleading hint was repaired.

## Problem and scope

The booking-v3 form shows `MM/DD/YYYY` beneath its date field. People follow that hint, but the form reads their input in the day-first tenant's order. This differs from the shared parser failure and requires its own fix. The affected tenants are Alder Physio (`de-DE`), Copper Studio (`es-ES`) and Pale Harbour (`pt-PT`), on the form channel.

R-41230 (Copper Studio, form) describes 6 January becoming 1 June despite intake labeling it parser. R-41241 (Alder Physio, form) reports 6 August becoming 8 June. R-41251 is a Pale Harbour form example.

## Reproduction and expected result

1. Open the booking-v3 form for a day-first tenant.
2. Follow the printed `MM/DD/YYYY` hint and type an ambiguous date such as `08/06/2026` for 6 August.
3. The tenant-order form interpretation produces 8 June. The expected date is the date the displayed hint instructed the user to enter.
4. Verify the displayed hint and actual parsing agree for all three affected tenants, with booking-v2 and app/email controls.

This reproduction is derived from the export's code and reports; production was not accessed.

## Count method and evidence

Deduplicate by report ID, keep reports merged into #4471, join tenant data and execute `causeOf`. A day-first tenant using booking-v3 is classified as hint only on the form channel. There are 33 reports: intake tagged 18 hint and 15 parser. Browser locale and intake labels are not authoritative.

## Fix and acceptance

Make the visible date hint match the tenant-aware input contract, and test the hint and parsing together. Do not treat a change to the shared parser as sufficient. Subject matching must not merge this back into the parser ticket: equal subjects can describe different mechanisms.

Evidence: `src/lib/kb/causes.ts` (`DATE_HINT`, `causeOf`), `src/lib/data/tenants/*.json`, `src/lib/data/reports-4471.json`, and `rendered/kb/incidents/4471-review/index.html`.
