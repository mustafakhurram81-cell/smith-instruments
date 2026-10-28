// Builds scripts/catalog/catalogue-pages.json (code -> its page in its chapter's PDF catalogue) from readings made by
// read-pdfs.py, for every code on the website (public/catalog/variants, so run `npm run catalog` first).
// Usage: node build-page-map.mjs <pages.jsonl> [<more pages.jsonl> ...]
// A code printed on several pages takes the page it is printed on most; a code inside a printed range
// ("02-100-12 - 02-100-25") takes the range's page; otherwise its model's page. A code found nowhere gets no page.
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..', '..', '..');
const readings = process.argv.slice(2);
if (!readings.length) throw new Error('Usage: node build-page-map.mjs <pages.jsonl> [...]');

// The text recognition reads 0 as O and 1 as l now and then, and dashes come in several kinds.
const norm = t => t.replace(/[‐–—−]/g, '-').replace(/(?<=\d)[Oo](?=[\d-])|(?<=[\d-])[Oo](?=\d)/g, '0').replace(/(?<=\d)[lI](?=\d)/g, '1');
const CODE = /\b(\d{2})\s?-\s?(\d{3})\s?-\s?([0-9A-Z]{1,2})\b/g;

const seen = new Map();   // code -> Map(page -> times)
const ranges = [];        // [from, to, page]
for (const file of readings) {
  for (const line of fs.readFileSync(file, 'utf8').trim().split('\n')) {
    const p = JSON.parse(line);
    const chapter = p.pdf.slice(0, 2);
    if (+chapter > 29) continue;
    for (const l of p.lines) {
      const t = norm(l.t);
      // Only codes of this catalogue's own chapter: a reference to another chapter is not where that code is printed.
      const codes = [...t.matchAll(CODE)].map(m => `${m[1]}-${m[2]}-${m[3]}`).filter(c => c.startsWith(chapter));
      for (const c of codes) {
        if (!seen.has(c)) seen.set(c, new Map());
        seen.get(c).set(p.page, (seen.get(c).get(p.page) ?? 0) + 1);
      }
      if (codes.length === 2 && / - |-\s*$|\s-\s?\d/.test(t.replace(CODE, 'X'))) ranges.push([codes[0], codes[1], p.page]);
    }
  }
}

const pageOf = new Map(), modelPage = new Map();
for (const [code, pages] of seen) {
  const page = [...pages.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
  pageOf.set(code, page);
  if (!modelPage.has(code.slice(0, 6))) modelPage.set(code.slice(0, 6), page);
}

const dir = path.join(root, 'public', 'catalog', 'variants');
const skus = fs.readdirSync(dir).flatMap(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).map(r => r[0]));
const out = {};
const count = { printed: 0, inRange: 0, model: 0, none: 0 };
for (const sku of skus) {
  if (pageOf.has(sku)) { out[sku] = pageOf.get(sku); count.printed++; continue; }
  const range = ranges.find(([from, to]) => sku.slice(0, 2) === from.slice(0, 2) && sku >= from && sku <= to);
  if (range) { out[sku] = range[2]; count.inRange++; continue; }
  if (modelPage.has(sku.slice(0, 6))) { out[sku] = modelPage.get(sku.slice(0, 6)); count.model++; continue; }
  count.none++;
}

const target = path.join(root, 'scripts', 'catalog', 'catalogue-pages.json');
fs.writeFileSync(target, `${JSON.stringify(Object.fromEntries(Object.entries(out).sort())).replace(/,"/g, ',\n"')}\n`);
console.log(`${skus.length} codes: ${count.printed} printed, ${count.inRange} inside a printed range, ${count.model} on their model's page, ${count.none} not found -> scripts/catalog/catalogue-pages.json`);
