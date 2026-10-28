# Shared parser reads day-first tenant dates month first — 379 reports

Source ticket: #4471. Course dataset: export dated 2026-10-04.
Cause key: `parser`.
Report count: **379 unique reports**, across **11 tenants**, received **2026-04-01 through 2026-10-04**.

## Problem and scope

The shared parser reads input month first even when the tenant writes day first. It can swap day and month in invites and reminders. R-41200 (Harbour Dental, app) reports 7 April becoming 4 July; R-41201 reports the reverse. Booking-v2 form reports and app/email reports belong to this group. A booking-v3 tenant's app or email report still belongs here.

## Reproduction and expected result

1. Use a day-first tenant such as Harbour Dental (`en-GB`, booking-v2).
2. Supply `07/04/2026` through the affected path and create an invite/reminder.
3. The observed report describes 4 July. The intended date is 7 April.
4. Repeat for app, email and booking-v2 form, plus a booking-v3 tenant's app path.

This reproduction is derived from the export's code and reports; production was not accessed.

## Count method and evidence

Run `uniqueById`, filter `mergedInto === 4471`, join on tenant handle, then execute `causeOf`. The source assigns day-first tenants to parser unless the channel is form and their booking-v3 hint starts with MM. Do not count overlapping export rows or classify from browser locale/intake tags. Of these 379, intake tagged 356 parser and 23 hint.

The group includes five reports that the desk read as one-day/timing anomalies: R-41202, R-41209, R-41236, R-41344, R-41620. Their bodies do not prove a month/day swap. These are included in 379 because that is the executable classifier's assignment; inspect them separately before asserting that this parser fix resolves them. A timezone explanation remains unproven. Do not add these five again when totaling the two tickets.

## Fix and acceptance

Make parsing respect the tenant's declared date contract and use an unambiguous representation between systems. Add meaningful coverage for ambiguous day/month values and all affected paths. Keep the independent booking-v3 hint ticket separate. Track the five unresolved examples until their symptoms are explained.

Evidence: `src/lib/kb/causes.ts`, `src/lib/kb/locales.ts`, `src/lib/data/reports-4471.json`, `src/lib/data/desk-notes.json`, and the rendered review at `rendered/kb/incidents/4471-review/index.html`.
