import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

// ── Catalog index (public/catalog/index.json, built by `npm run catalog`) ──

type RawFamily = {
  c: string; cs?: string[]; n: string; t: string; st?: string; sp: string[]; f?: string[];
  i?: string; v: number; mn?: number; mx?: number;
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

// ── Variants for one product, live from Supabase ──

export type Variant = { sku: string; label: string; sizeCm: number | null; image: string | null };

// The part of a SKU's name that differs from the product name, e.g. "Jaw: 3 x 8 mm".
const variantLabel = (name: string, familyName: string) =>
  (name.startsWith(familyName) ? name.slice(familyName.length) : name).replace(/^[\s,.]+/, '').trim();

async function loadVariants(family: Family): Promise<Variant[]> {
  const { data, error } = await supabase
    .from('catalog_products')
    .select('sku, name, image_url, specifications')
    .or(family.codes.map(c => `sku.like.${c}-*`).join(','))
    .order('sku');
  if (error) throw error;
  return (data ?? []).map(r => {
    const size = Number((r.specifications as { size_cm?: number } | null)?.size_cm ?? 0);
    return { sku: r.sku, label: variantLabel(r.name, family.name), sizeCm: size > 0 ? size : null, image: r.image_url || null };
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
