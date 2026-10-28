import fs from 'node:fs';
import { uniqueById, groupByCause } from '../src/lib/kb/causes.ts';

const data = new URL('../src/lib/data/', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name, data), 'utf8'));
const raw = read('reports-4471.json');
const notes = read('desk-notes.json');
const tenants = new Map(fs.readdirSync(new URL('tenants/', data)).map(name => {
  const tenant = read(`tenants/${name}`);
  return [tenant.handle, tenant];
}));
const reports = uniqueById(raw).filter(r => r.mergedInto === 4471);
const groups = groupByCause(reports, r => tenants.get(r.tenant));
const evidence = {
  dataset: 'support-kb export 2026-10-04, ticket 4471',
  rawRows: raw.length,
  uniqueReports: reports.length,
  repeatedRows: raw.length - reports.length,
  groups: groups.map(({reports: rs, ...group}) => ({
    ...group, count: rs.length, reportIds: rs.map(r => r.id),
  })),
  unresolvedSubsetOfParser: reports.filter(r => notes.oneDayMove.includes(r.id)).map(r => r.id),
};
fs.mkdirSync(new URL('../evidence/', import.meta.url), {recursive:true});
fs.writeFileSync(new URL('../evidence/report-membership.json', import.meta.url), JSON.stringify(evidence, null, 2)+'\n');
console.log(`${raw.length} rows; ${reports.length} unique reports; ${raw.length-reports.length} repeated rows`);
for (const group of evidence.groups) console.log(`${group.cause}: ${group.count} reports; ${group.tenants} tenants; ${group.firstSeen} to ${group.lastSeen}`);
console.log(`Unresolved subset of parser: ${evidence.unresolvedSubsetOfParser.join(', ')}`);
