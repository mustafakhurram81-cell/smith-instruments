// Builds public/catalog/index.json: every instrument family on the website with its category,
// subtype, specialties, features and size range, plus the category labels.
//
// Source data: web/data/catalog-snapshot.json (refresh with `npm --prefix web run snapshot`) and the
// taxonomy in web/data/taxonomy.json + web/scripts. Run locally with `npm run catalog`; the output
// is committed, so the Vercel build does not depend on the web/ folder.
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const web = path.join(root, 'web');
const { TYPES, SPECIALTIES } = await import(path.join(web, 'scripts/taxonomy-rules.mjs'));
const { SUBTYPES } = await import(path.join(web, 'scripts/subtypes.mjs'));
const snapshot = JSON.parse(fs.readFileSync(path.join(web, 'data/catalog-snapshot.json'), 'utf8'));
const taxonomy = JSON.parse(fs.readFileSync(path.join(web, 'data/taxonomy.json'), 'utf8'));

const FEATURES = [
  ['straight', /\bstr(aight|\.)?\b|\bstr\b/i],
  ['curved', /\bcurved\b|\bcvd\b/i],
  ['angled', /angled|angular|\d+\s?[°º]/i],
  ['bayonet', /bayonet/i],
  ['tc', /\bT\.?\s?C\.?(?=[\s,)]|$)|tungsten|carbide/i],
  ['titanium', /titan/i],
  ['micro', /\bmicro/i],
  ['disposable', /disposable|single[- ]use/i],
];

// Most images share one CDN folder; storing only the file name keeps the index small.
const IMG_PREFIX = 'https://assets.smithinstruments.net/legacy-products/';
const shortImg = url => (url?.startsWith(IMG_PREFIX) ? url.slice(IMG_PREFIX.length) : url);


// SKU families (NN-NNN) with the same name and type are merged into one product.
const groups = new Map();
for (const p of snapshot.products) {
  const code = p.sku.match(/^\d+-\d+/)?.[0];
  if (!code) continue;
  const t = taxonomy[code];
  const name = t?.name ?? p.name.split(',')[0];
  const key = `${t?.type ?? 'other'}|${name.toLowerCase()}`;
  if (!groups.has(key)) groups.set(key, { name, t, codes: [], items: [] });
  const g = groups.get(key);
  if (!g.codes.includes(code)) g.codes.push(code);
  g.items.push(p);
}

const families = [];
for (const { name, t, codes, items } of groups.values()) {
  const sizes = items.map(i => i.size_cm).filter(s => s > 0);
  const features = FEATURES.filter(([, re]) => items.some(i => re.test(i.name))).map(([f]) => f);
  const specialties = [...new Set(codes.flatMap(c => taxonomy[c]?.specialties ?? []))];
  families.push({
    c: codes[0],
    cs: codes.length > 1 ? codes : undefined,
    n: name,
    t: t?.type ?? 'other',
    st: t?.subtype ?? undefined,
    sp: specialties,
    f: features.length ? features : undefined,
    i: shortImg(items.find(i => i.image_url)?.image_url) ?? undefined,
    v: items.length,
    mn: sizes.length ? Math.min(...sizes) : undefined,
    mx: sizes.length ? Math.max(...sizes) : undefined,
  });
}

const labels = {
  types: Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [k, v.en])),
  specialties: Object.fromEntries(Object.entries(SPECIALTIES).map(([k, v]) => [k, v.en])),
  subtypes: Object.fromEntries(Object.entries(SUBTYPES).map(([type, def]) => [
    type,
    Object.fromEntries([...def.rules.map(r => [r.slug, r.en]), [def.rest[0], def.rest[1]]]),
  ])),
  subtypeOrder: Object.fromEntries(Object.entries(SUBTYPES).map(([type, def]) => [type, [...def.rules.map(r => r.slug), def.rest[0]]])),
};

const out = path.join(root, 'public', 'catalog', 'index.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ generatedAt: snapshot.generatedAt, imgPrefix: IMG_PREFIX, labels, families }));
console.log(`catalog index: ${families.length} products from ${snapshot.products.length} SKUs -> public/catalog/index.json (${Math.round(fs.statSync(out).size / 1024)} KB)`);
