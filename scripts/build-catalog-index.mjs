// Builds the website catalogue from Snaa ERP v3, the one source of products:
//   public/catalog/index.json      every product page with its type, subtype, specialties, features and size range,
//                                  plus the category labels;
//   public/catalog/variants/NN.json every SKU (name, picture, size) by its two-digit prefix, for the size tables;
//   lib/catalog/catalogues.json    the PDF catalogues, each chapter catalogue with its two-digit SKU chapter.
//
// The ERP keeps the website categories in its website_* tables; a family (NN-NNN) not given a page there yet still
// shows, classified by name with the rules in scripts/catalog. Run `npm run catalog` with ERP_SUPABASE_URL and
// ERP_SUPABASE_PUBLISHABLE_KEY set (.env.local); the output is committed.
import fs from 'node:fs';
import path from 'node:path';
import { TYPE_RULES, CHAPTER_SPECIALTY } from './catalog/taxonomy-rules.mjs';
import { classifySubtype } from './catalog/subtypes.mjs';
// Each code's page in its chapter's PDF catalogue, read from the printed catalogues (28 Oct 2026).
const CATALOGUE_PAGES = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'catalog', 'catalogue-pages.json'), 'utf8'));

const root = path.join(import.meta.dirname, '..');
for (const line of fs.existsSync(path.join(root, '.env.local')) ? fs.readFileSync(path.join(root, '.env.local'), 'utf8').split('\n') : []) {
  const m = line.match(/^(ERP_[A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, '');
}
const { ERP_SUPABASE_URL: url, ERP_SUPABASE_PUBLISHABLE_KEY: key } = process.env;
if (!url || !key) throw new Error('Set ERP_SUPABASE_URL and ERP_SUPABASE_PUBLISHABLE_KEY (see .env.example).');

// A slow connection gets three tries before the build gives up.
async function get(address, headers) {
  for (let attempt = 1; ; attempt++) {
    try { return await fetch(address, { headers }); } catch (err) { if (attempt === 3) throw err; }
  }
}

// Reads a whole table or the catalogue function, 1000 rows at a time.
async function read(resource, query = '') {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const res = await get(`${url}/rest/v1/${resource}?${query}`, { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + 999}` });
    if (!res.ok) throw new Error(`${resource}: ${res.status} ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

const [items, pages, families, pageSpecialties, types, subtypes, specialties, catalogues, setRows] = await Promise.all([
  read('rpc/website_catalogue_items'),
  read('website_pages', 'select=code,name,type_slug,subtype_slug&visible=is.true'),
  read('website_families', 'select=family_code,page_code&order=family_code'),
  read('website_page_specialties', 'select=page_code,specialty_slug,is_main'),
  read('website_types', 'select=slug,label&order=sort'),
  read('website_subtypes', 'select=type_slug,slug,label&order=sort'),
  read('website_specialties', 'select=slug,label&order=sort'),
  read('website_catalogues', 'select=id,title,description,file_size,pdf_url,thumbnail_url,chapter,sort,active,created_at&order=sort'),
  read('rpc/website_set_contents'),
]);
items.sort((a, b) => (a.sku < b.sku ? -1 : a.sku > b.sku ? 1 : 0));

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
const shortImg = u => (u?.startsWith(IMG_PREFIX) ? u.slice(IMG_PREFIX.length) : u);

const specialtyOrder = new Map(specialties.map((s, i) => [s.slug, i]));
const specsOf = new Map();
for (const s of pageSpecialties) {
  if (!specsOf.has(s.page_code)) specsOf.set(s.page_code, []);
  specsOf.get(s.page_code).push(s);
}
const pageByCode = new Map(pages.map(p => [p.code, {
  name: p.name, type: p.type_slug, subtype: p.subtype_slug,
  specialties: (specsOf.get(p.code) ?? [])
    .sort((a, b) => Number(b.is_main) - Number(a.is_main) || specialtyOrder.get(a.specialty_slug) - specialtyOrder.get(b.specialty_slug))
    .map(s => s.specialty_slug),
}]));

// A family the ERP has not given a page yet: its own page, named by the shared start of its SKU names and
// typed by the strongest name rule (the same rules that first sorted the catalogue).
function guessType(name) {
  let best = null;
  for (const [re, type, pri] of TYPE_RULES) {
    const m = name.match(re);
    if (m && (!best || pri > best.pri || (pri === best.pri && m.index + m[0].length > best.end))) best = { type, pri, end: m.index + m[0].length };
  }
  return best?.type ?? 'other';
}
function sharedName(names) {
  const parts = names.map(n => n.split(/,\s*/));
  const out = [];
  for (let i = 0; i < parts[0].length && parts.every(p => p[i] === parts[0][i]); i++) out.push(parts[0][i]);
  return (out.length ? out.join(', ') : names[0].split(/,\s*/)[0]).trim();
}

const groups = new Map();
const unplaced = new Map();
for (const it of items) {
  const fam = it.sku.slice(0, 6);
  if (!it.page_code) { if (!unplaced.has(fam)) unplaced.set(fam, []); unplaced.get(fam).push(it); }
  const code = it.page_code ?? fam;
  if (!groups.has(code)) groups.set(code, { codes: [], items: [] });
  const g = groups.get(code);
  if (!g.codes.includes(fam)) g.codes.push(fam);
  g.items.push(it);
}
const subtypeSlugs = new Set(subtypes.map(s => `${s.type_slug}|${s.slug}`));
for (const [fam, rows] of unplaced) {
  const name = sharedName(rows.map(r => r.name));
  const type = guessType(name);
  const subtype = classifySubtype(type, rows.map(r => r.name).join(' | '));
  pageByCode.set(fam, {
    name, type: types.some(t => t.slug === type) ? type : 'other',
    subtype: subtypeSlugs.has(`${type}|${subtype}`) ? subtype : null,
    specialties: [CHAPTER_SPECIALTY[fam.slice(0, 2)]].filter(Boolean),
  });
}

// Parts and accessories: a name that mentions other codes ("Blade for Henley Retractor, used with ref. 06-540-00",
// "Used with: 04-168-04 - 04-182-09") links its page to theirs, and theirs back to it.
const pageOfFamily = new Map();
for (const [code, { codes }] of groups) for (const f of codes) pageOfFamily.set(f, code);
const familyCodes = [...pageOfFamily.keys()].sort();
const usedWith = new Map(), partsFor = new Map();
const link = (map, from, to) => { if (!map.has(from)) map.set(from, new Set()); map.get(from).add(to); };
for (const [page, { items: rows }] of groups) {
  for (const it of rows) {
    const text = it.name.replace(/[‐–—]/g, '-');
    const targets = new Set();
    for (const m of text.matchAll(/\b(\d{2}-\d{3})-[0-9A-Z]{1,2}\b(?:\s*-\s*(\d{2}-\d{3})-[0-9A-Z]{1,2}\b)?/g)) {
      const [from, to] = [m[1], m[2] ?? m[1]].sort();
      for (const f of familyCodes) if (f >= from && f <= to && f.slice(0, 2) === from.slice(0, 2)) targets.add(pageOfFamily.get(f));
    }
    for (const t of targets) if (t !== page) { link(usedWith, page, t); link(partsFor, t, page); }
  }
}
const firstFew = set => (set?.size ? [...set].sort().slice(0, 12) : undefined);

// What is in each set: [code, name, quantity, on the website] by the set's code.
const sets = {};
for (const r of setRows) (sets[r.set_sku] ??= []).push([r.sku, r.name, Number(r.quantity), r.on_website]);
const setPages = new Set(Object.keys(sets).map(sku => pageOfFamily.get(sku.slice(0, 6))).filter(Boolean));

const index = [];
for (const [code, { codes, items: rows }] of groups) {
  const p = pageByCode.get(code);
  const sizes = rows.map(i => Number(i.size_cm)).filter(s => s > 0);
  const features = FEATURES.filter(([, re]) => rows.some(i => re.test(i.name))).map(([f]) => f);
  index.push({
    c: code,
    cs: codes.length > 1 ? codes : undefined,
    n: p.name,
    t: p.type,
    st: p.subtype ?? undefined,
    sp: p.specialties,
    f: features.length ? features : undefined,
    i: shortImg(rows.find(i => i.image_url)?.image_url) ?? undefined,
    v: rows.length,
    mn: sizes.length ? Math.min(...sizes) : undefined,
    mx: sizes.length ? Math.max(...sizes) : undefined,
    w: firstFew(usedWith.get(code)),
    pa: firstFew(partsFor.get(code)),
    k: setPages.has(code) ? 1 : undefined,
  });
}

const labels = {
  types: Object.fromEntries(types.map(t => [t.slug, t.label])),
  specialties: Object.fromEntries(specialties.map(s => [s.slug, s.label])),
  subtypes: {},
  subtypeOrder: {},
};
// Subtypes grouped in the types' order.
const typeOrder = new Map(types.map((t, i) => [t.slug, i]));
for (const s of [...subtypes].sort((a, b) => typeOrder.get(a.type_slug) - typeOrder.get(b.type_slug))) {
  (labels.subtypes[s.type_slug] ??= {})[s.slug] = s.label;
  (labels.subtypeOrder[s.type_slug] ??= []).push(s.slug);
}

const out = path.join(root, 'public', 'catalog', 'index.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), imgPrefix: IMG_PREFIX, labels, families: index }));

// Variants as [sku, name, image (short when on the CDN folder), size_cm, catalogue page], in SKU order.
const variantsDir = path.join(root, 'public', 'catalog', 'variants');
fs.rmSync(variantsDir, { recursive: true, force: true });
fs.mkdirSync(variantsDir, { recursive: true });
const byPrefix = new Map();
for (const it of items) {
  const prefix = it.sku.slice(0, 2);
  if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
  byPrefix.get(prefix).push([it.sku, it.name, shortImg(it.image_url) ?? null, Number(it.size_cm) > 0 ? Number(it.size_cm) : null, CATALOGUE_PAGES[it.sku] ?? null]);
}
for (const [prefix, rows] of byPrefix) fs.writeFileSync(path.join(variantsDir, `${prefix}.json`), JSON.stringify(rows));

fs.writeFileSync(path.join(root, 'public', 'catalog', 'sets.json'), JSON.stringify(sets));
fs.writeFileSync(path.join(root, 'lib', 'catalog', 'catalogues.json'), `${JSON.stringify(catalogues.map(c => ({
  id: c.id, title: c.title, description: c.description, size: c.file_size, pdf_url: c.pdf_url,
  thumbnail_url: c.thumbnail_url, chapter: c.chapter, display_order: c.sort, is_active: c.active, created_at: c.created_at,
})), null, 2)}\n`);

console.log(`catalog: ${index.length} products from ${items.length} SKUs, ${catalogues.length} catalogues -> public/catalog (${Math.round(fs.statSync(out).size / 1024)} KB)`);
if (unplaced.size) console.log(`${unplaced.size} families have no page in the ERP yet and were classified by name: ${[...unplaced.keys()].join(', ')}`);
