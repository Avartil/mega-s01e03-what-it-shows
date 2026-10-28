import fs from 'node:fs';
import path from 'node:path';
import { renderPages } from '../dist/render-entry.js';

for (const page of renderPages()) {
  const out = path.join('rendered', page.route, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page.html);
  console.log(`Rendered ${page.route}`);
}
