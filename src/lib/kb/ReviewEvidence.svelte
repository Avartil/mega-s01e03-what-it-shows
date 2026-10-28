<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, causeOf, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const raw = reports as Report[];
  const merged = uniqueById(raw).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const anomalies = merged.filter(r => notes.oneDayMove.includes(r.id));
  const dates = merged.map(r => r.receivedAt.slice(0, 10)).sort();
  const mergeDays = [...new Set(merged.flatMap(r => r.mergedAt ? [r.mergedAt.slice(0, 10)] : []))].sort();
  const firstMerge = mergeDays[0];
  const firstBatch = merged.filter(r => r.mergedAt?.startsWith(firstMerge));
  const lastMerge = mergeDays.at(-1);
  const misTagged = groups.reduce((n, g) => n + g.reports.filter(r => r.meta.intakeTag !== g.cause).length, 0);
</script>

<section aria-label="Evidence and scope">
  <p><strong>{raw.length}</strong> exported rows contain <strong>{merged.length}</strong> distinct reports merged into #4471. Deduplication by report ID removes <strong>{raw.length - merged.length}</strong> overlapping export rows. The classifier finds <strong>{groups.length}</strong> cause groups.</p>
  <p>Tenant locale, booking form and channel determine the code's classification. Intake tags disagree on <strong>{misTagged}</strong> reports. A browser locale is not the tenant's locale.</p>
  <p>Reports arrived from <strong>{dates[0]}</strong> through <strong>{dates.at(-1)}</strong>. The first merge batch was <strong>{firstMerge}</strong>, with <strong>{firstBatch.length}</strong> reports; merges continued through <strong>{lastMerge}</strong>. The July merge spike is processing activity, not the beginning of the incident.</p>
  <p>The source's two cause groups account for every unique report. The following <strong>{anomalies.length}</strong> reports remain classified as parser by the source code, but their wording does not establish a month/day swap. Keep them visible for investigation; a timezone cause is a hypothesis, not a demonstrated diagnosis.</p>
  <table>
    <thead><tr><th>Report</th><th>Tenant / channel</th><th>Reported symptom</th><th>Code assigns</th></tr></thead>
    <tbody>{#each anomalies as r (r.id)}<tr><td><code>{r.id}</code></td><td>{r.tenant} / {r.channel}</td><td>{r.body}</td><td>{causeOf(r, tenantOf(r))}</td></tr>{/each}</tbody>
  </table>
</section>

<style>
  td { vertical-align: top; }
</style>
