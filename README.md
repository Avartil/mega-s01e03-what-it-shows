# S01E03 · what it shows

Local analysis of the MEGA.dev support-kb export, dated 2026-10-04. This repository is an exercise dataset, not a production support system.

## Findings

| Executable cause group | Unique reports | Intake tagged parser / hint |
| --- | ---: | ---: |
| Shared parser reads dates month first | 379 | 356 / 23 |
| Booking-v3 form hint contradicts day-first input | 33 | 15 / 18 |
| Total | 412 | 371 / 41 |

The export has 427 rows, including 15 repeated report IDs. Five anomalous reports remain within the source classifier's parser group; the review keeps their evidence and uncertainty visible. There is no proven timezone diagnosis in this export.

The course's later engineering update says #4471 closed on 5 October: parser fixed (`fix(dates): parse dd/mm for eu locales`), hint won't fix (booking-v3 form retired). The parser issue therefore closes as completed and the hint issue as not planned. Historical counts remain 379 and 33.

- Review source: [signed kb page](src/routes/kb/incidents/4471-review/+page.svx).
- Desk view: [rendered review HTML](rendered/kb/incidents/4471-review/index.html).
- Initial issue bodies: [parser](tickets/parser.md), [hint](tickets/hint.md).
- Original export conventions: [EXPORT-README.md](EXPORT-README.md).

## Reproduce the rendered evidence

Requires Node.js 24 or later. Install the locked dependencies with `npm ci`, then run `npm run build`. Vite, mdsvex and Svelte compile the original .svx pages and their imported components; the Svelte server renderer writes complete HTML into `rendered/`.

Run `npm run analyze` to reproduce the partition and [report ID membership](evidence/report-membership.json) directly from the exported classifier and tenant directory.

Run `npm run preview` to browse the rendered desk views on 127.0.0.1. The rendered HTML is a snapshot, including the explorer's initial state and example table. All counts and the desk ref come from executable components. No counts or desk refs are substituted into the HTML by hand. The existing accepted decision 0001 is preserved.

## Working notes

The July merge spike records desk work on an older backlog; reports start in April. Tenant locale, form version and channel determine the source's cause group. Subject matching, browser locale, and intake tags are unreliable substitutes. Re-read issue bodies, comments and states before claiming completion because the desk keeps working.
