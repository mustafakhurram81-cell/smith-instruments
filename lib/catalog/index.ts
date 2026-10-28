import { useQuery } from '@tanstack/react-query';

// ── Catalog index (public/catalog/index.json, built by `npm run catalog`) ──

type RawFamily = {
  c: string; cs?: string[]; n: string; t: string; st?: string; sp: string[]; f?: string[];
  i?: string; v: number; mn?: number; mx?: number;
  w?: string[]; pa?: string[]; k?: 1;
};
type RawIndex = {
  generatedAt: string;
  imgPrefix: string;
  labels: {
    types: Record<string, string>;
    specialties: Record<string, string>;
    subtypes: Record<string, Record<string, string>>;
    subtypeOrder: Record<string, string[]>;
  };
  families: RawFamily[];
};

export type Feature = 'straight' | 'curved' | 'angled' | 'bayonet' | 'tc' | 'titanium' | 'micro' | 'disposable';

export type Family = {
  code: string;
  codes: string[];
  name: string;
  type: string;
  subtype: string | null;
  specialties: string[];
  features: Feature[];
  image: string | null;
  count: number;
  sizeMin: number | null;
  sizeMax: number | null;
  usedWith: string[];  // pages this one's parts fit (its names mention their codes)
  parts: string[];     // pages of parts and accessories that fit this one
  hasSet: boolean;     // one of its codes is a set whose contents are listed
};

export type Catalog = {
  families: Family[];
  labels: RawIndex['labels'];
  byCode: Map<string, Family>;
};

export const FEATURE_LABELS: Record<Feature, string> = {
  straight: 'Straight', curved: 'Curved', angled: 'Angled', bayonet: 'Bayonet',
  tc: 'Tungsten carbide (T.C.)', titanium: 'Titanium', micro: 'Micro', disposable: 'Disposable',
};

async function loadCatalog(): Promise<Catalog> {
  const res = await fetch('/catalog/index.json');
  if (!res.ok) throw new Error(`Catalog index failed to load (${res.status})`);
  const raw: RawIndex = await res.json();
  const families = raw.families.map(f => ({
    code: f.c,
    codes: f.cs ?? [f.c],
    name: f.n,
    type: f.t,
    subtype: f.st ?? null,
    specialties: f.sp,
    features: (f.f ?? []) as Feature[],
    image: f.i ? (f.i.startsWith('http') ? f.i : raw.imgPrefix + f.i) : null,
    count: f.v,
    sizeMin: f.mn ?? null,
    sizeMax: f.mx ?? null,
    usedWith: f.w ?? [],
    parts: f.pa ?? [],
    hasSet: f.k === 1,
  }));
  const byCode = new Map<string, Family>();
  for (const f of families) for (const c of f.codes) byCode.set(c, f);
  return { families, labels: raw.labels, byCode };
}

export function useCatalog(enabled = true) {
  return useQuery({ queryKey: ['catalog-index'], queryFn: loadCatalog, staleTime: Infinity, gcTime: Infinity, enabled });
}

// ── Helpers ──

export const familyCodeOf = (sku: string) => sku.match(/^\d+-\d+/)?.[0] ?? null;

export const cm = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} cm`;

export function sizeSummary(f: Pick<Family, 'sizeMin' | 'sizeMax' | 'count'>) {
  const options = f.count === 1 ? '1 option' : `${f.count} options`;
  const hasRange = f.sizeMin !== null && f.sizeMax !== null && f.sizeMax > f.sizeMin;
  if (hasRange) return { range: [cm(f.sizeMin!), cm(f.sizeMax!)] as const, label: f.count === 1 ? '1 size' : `${f.count} sizes` };
  if (f.sizeMin !== null) return { range: null, label: f.count === 1 ? cm(f.sizeMin) : `${cm(f.sizeMin)}, ${options}` };
  return { range: null, label: options };
}

export const productPath = (f: Pick<Family, 'code'>) => `/product/${f.code}`;
export const typePath = (type: string, subtype?: string) => `/products/type/${type}${subtype ? `/${subtype}` : ''}`;
export const specialtyPath = (specialty: string, type?: string) => `/products/specialty/${specialty}${type ? `/${type}` : ''}`;

export function subtypesOf(catalog: Catalog, type: string) {
  const order = catalog.labels.subtypeOrder[type] ?? [];
  return order
    .map(slug => ({ slug, label: catalog.labels.subtypes[type]?.[slug] ?? slug, items: catalog.families.filter(f => f.type === type && f.subtype === slug) }))
    .filter(s => s.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);
}

export function counts(catalog: Catalog) {
  const byType: Record<string, number> = {};
  const bySpecialty: Record<string, number> = {};
  for (const f of catalog.families) {
    byType[f.type] = (byType[f.type] ?? 0) + 1;
    for (const s of f.specialties) bySpecialty[s] = (bySpecialty[s] ?? 0) + 1;
  }
  return { byType, bySpecialty };
}

// Search: SKU hits first, then names containing every word.
export function searchFamilies(catalog: Catalog, query: string, limit = 20) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const words = q.split(/\s+/);
  const scored: { f: Family; score: number }[] = [];
  for (const f of catalog.families) {
    const name = f.name.toLowerCase();
    let score = 0;
    if (f.codes.some(c => c.startsWith(q) || q.startsWith(c + '-'))) score = 100;
    else if (words.every(w => name.includes(w))) score = name.startsWith(q) ? 60 : 40;
    if (score) scored.push({ f, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.f.name.length - b.f.name.length).slice(0, limit).map(s => s.f);
}

// ── Variants for one product (public/catalog/variants/NN.json, built by `npm run catalog`) ──

export type Variant = { sku: string; label: string; sizeCm: number | null; image: string | null; page: number | null };

// page: the code's page in its chapter's PDF catalogue.
type RawVariant = [sku: string, name: string, image: string | null, sizeCm: number | null, page?: number | null];

const IMG_PREFIX = 'https://assets.smithinstruments.net/legacy-products/';

// One file per two-digit SKU prefix, cached for the session.
const variantFiles = new Map<string, Promise<RawVariant[]>>();
function loadVariantFile(prefix: string) {
  if (!variantFiles.has(prefix)) {
    variantFiles.set(prefix, fetch(`/catalog/variants/${prefix}.json`).then(res => {
      if (!res.ok) { variantFiles.delete(prefix); throw new Error(`Variants failed to load (${res.status})`); }
      return res.json();
    }));
  }
  return variantFiles.get(prefix)!;
}

// Every catalogue SKU that shares a two-digit prefix with one of these codes, in SKU order.
export async function loadCatalogRows(codes: string[]) {
  const files = await Promise.all([...new Set(codes.map(c => c.slice(0, 2)))].sort().map(loadVariantFile));
  return files.flat().map(([sku, name, image, sizeCm, page]) => ({
    sku, name, sizeCm, page: page ?? null, image: image ? (image.startsWith('http') ? image : IMG_PREFIX + image) : null,
  }));
}

// The part of a SKU's name that differs from the product name, e.g. "Jaw: 3 x 8 mm".
const variantLabel = (name: string, familyName: string) =>
  (name.startsWith(familyName) ? name.slice(familyName.length) : name).replace(/^[\s,.]+/, '').trim();

async function loadVariants(family: Family): Promise<Variant[]> {
  const rows = await loadCatalogRows(family.codes);
  return rows
    .filter(r => family.codes.some(c => r.sku.startsWith(`${c}-`)))
    .map(r => ({ sku: r.sku, label: variantLabel(r.name, family.name), sizeCm: r.sizeCm, image: r.image, page: r.page }));
}

// ── Set contents (public/catalog/sets.json, built by `npm run catalog`) ──

export type SetItem = { sku: string; name: string; quantity: number; onWebsite: boolean };
type RawSetItem = [sku: string, name: string, quantity: number, onWebsite: boolean];

export function useSetContents(family: Family | undefined) {
  return useQuery({
    queryKey: ['sets'],
    queryFn: async () => {
      const res = await fetch('/catalog/sets.json');
      if (!res.ok) throw new Error(`Set contents failed to load (${res.status})`);
      const raw: Record<string, RawSetItem[]> = await res.json();
      return new Map(Object.entries(raw).map(([set, items]) => [set, items.map(([sku, name, quantity, onWebsite]) => ({ sku, name, quantity, onWebsite }))]));
    },
    enabled: !!family?.hasSet,
    staleTime: 1000 * 60 * 30,
  });
}

export function useVariants(family: Family | undefined) {
  return useQuery({
    queryKey: ['variants', family?.code],
    queryFn: () => loadVariants(family!),
    enabled: !!family,
    staleTime: 1000 * 60 * 30,
  });
}
