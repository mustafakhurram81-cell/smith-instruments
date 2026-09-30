import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { FamilyCard } from './FamilyCard';
import { FEATURE_LABELS, productPath, sizeSummary, type Family, type Feature } from '../../lib/catalog';

type Option = { slug: string; label: string };
type GroupFacet = { key: 'specialties' | 'subtype'; title: string; options: Option[] };

const PAGE = 48;
const FEATURE_ORDER: Feature[] = ['straight', 'curved', 'angled', 'bayonet', 'tc', 'titanium', 'micro', 'disposable'];
const LENGTHS = [
  { slug: 'lt12', min: 0, max: 12, label: '< 12 cm' },
  { slug: '12-16', min: 12, max: 16, label: '12–16 cm' },
  { slug: '16-20', min: 16, max: 20, label: '16–20 cm' },
  { slug: '20-25', min: 20, max: 25, label: '20–25 cm' },
  { slug: 'gt25', min: 25, max: Infinity, label: '> 25 cm' },
];

const overlaps = (f: Family, min: number, max: number) =>
  f.sizeMin !== null && f.sizeMax !== null && f.sizeMax >= min && f.sizeMin < max;
const groupValues = (f: Family, key: GroupFacet['key']) => (key === 'specialties' ? f.specialties : f.subtype ? [f.subtype] : []);

const chip = (on: boolean) =>
  `px-3 py-1.5 rounded-full border text-[13px] transition-colors ${on ? 'bg-brand-charcoal border-brand-charcoal text-white' : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'}`;

export const FamilyBrowser: React.FC<{ items: Family[]; group?: GroupFacet }> = ({ items, group }) => {
  const [q, setQ] = useState('');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [lengths, setLengths] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState(false);

  const featureOptions = useMemo(() => FEATURE_ORDER.filter(f => items.some(i => i.features.includes(f))), [items]);
  const lengthOptions = useMemo(() => LENGTHS.filter(l => items.some(i => overlaps(i, l.min, l.max))), [items]);
  const groupOptions = useMemo(
    () => (group ? group.options.filter(o => items.some(i => groupValues(i, group.key).includes(o.slug))) : []),
    [items, group],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(i => {
      if (needle && !i.name.toLowerCase().includes(needle) && !i.codes.some(c => c.includes(needle))) return false;
      if (features.length && !features.every(f => i.features.includes(f))) return false;
      if (lengths.length && !LENGTHS.filter(l => lengths.includes(l.slug)).some(l => overlaps(i, l.min, l.max))) return false;
      if (group && groups.length && !groupValues(i, group.key).some(v => groups.includes(v))) return false;
      return true;
    });
  }, [items, q, features, lengths, groups, group]);

  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) => {
    set(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
    setLimit(PAGE);
  };
  const active = features.length + lengths.length + groups.length;
  const shown = filtered.slice(0, limit);
  const clear = () => { setQ(''); setFeatures([]); setLengths([]); setGroups([]); setLimit(PAGE); };

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="lg:hidden justify-self-start inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-stone-300 bg-white text-sm font-medium"
      >
        <SlidersHorizontal size={16} /> {open ? 'Hide filters' : 'Filters'}
        {active > 0 && <span className="bg-brand-orange text-white text-xs rounded-full min-w-5 h-5 px-1.5 grid place-items-center">{active}</span>}
      </button>

      <aside className={`${open ? 'grid' : 'hidden'} lg:grid gap-7 lg:sticky lg:top-28 bg-white lg:bg-transparent p-4 lg:p-0 rounded-lg border lg:border-0 border-stone-200`}>
        <label className="relative block">
          <span className="sr-only">Filter this list</span>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={q}
            onChange={e => { setQ(e.target.value); setLimit(PAGE); }}
            placeholder="Filter by name or SKU"
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </label>

        {group && groupOptions.length > 1 && (
          <fieldset>
            <legend className="text-sm font-semibold text-brand-charcoal mb-3">{group.title}</legend>
            <div className="grid gap-2">
              {groupOptions.map(o => (
                <label key={o.slug} className="flex items-start gap-2.5 text-sm text-stone-700 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 accent-brand-orange" checked={groups.includes(o.slug)} onChange={() => toggle(groups, o.slug, setGroups)} />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {featureOptions.length > 0 && (
          <fieldset>
            <legend className="text-sm font-semibold text-brand-charcoal mb-3">Features</legend>
            <div className="flex flex-wrap gap-2">
              {featureOptions.map(f => (
                <button key={f} type="button" aria-pressed={features.includes(f)} onClick={() => toggle(features, f, setFeatures)} className={chip(features.includes(f))}>
                  {FEATURE_LABELS[f]}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {lengthOptions.length > 1 && (
          <fieldset>
            <legend className="text-sm font-semibold text-brand-charcoal mb-3">Length</legend>
            <div className="flex flex-wrap gap-2">
              {lengthOptions.map(l => (
                <button key={l.slug} type="button" aria-pressed={lengths.includes(l.slug)} onClick={() => toggle(lengths, l.slug, setLengths)} className={chip(lengths.includes(l.slug))}>
                  {l.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {(active > 0 || q) && (
          <button type="button" onClick={clear} className="justify-self-start inline-flex items-center gap-1 text-sm text-brand-orange hover:underline">
            <X size={14} /> Clear filters
          </button>
        )}
      </aside>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-4 mb-5">
          <p className="text-sm text-stone-500" aria-live="polite">
            {filtered.length === 1 ? '1 instrument' : `${filtered.length.toLocaleString()} instruments`}
          </p>
          <div className="flex items-center bg-stone-100 p-1 rounded-lg" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md ${view === 'grid' ? 'bg-white shadow-sm text-brand-charcoal' : 'text-stone-500'}`}>
              <LayoutGrid size={15} /> Cards
            </button>
            <button type="button" aria-pressed={view === 'table'} onClick={() => setView('table')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md ${view === 'table' ? 'bg-white shadow-sm text-brand-charcoal' : 'text-stone-500'}`}>
              <List size={15} /> Table
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg py-16 px-6 text-center text-stone-500">
            No instruments match these filters. Clear a filter or search by SKU.
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {shown.map(f => <FamilyCard key={f.code} family={f} />)}
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-stone-500 border-b border-stone-200">
                  <th className="py-3 px-4 w-16 hidden sm:table-cell"><span className="sr-only">Image</span></th>
                  <th className="py-3 px-4 font-medium">SKU</th>
                  <th className="py-3 px-4 font-medium">Instrument</th>
                  <th className="py-3 px-4 font-medium">Sizes</th>
                </tr>
              </thead>
              <tbody>
                {shown.map(f => {
                  const s = sizeSummary(f);
                  return (
                    <tr key={f.code} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                      <td className="py-2 px-4 hidden sm:table-cell">{f.image && <img src={f.image} alt="" loading="lazy" className="w-12 h-12 object-contain mix-blend-multiply" />}</td>
                      <td className="py-2 px-4 font-mono text-xs text-stone-500 whitespace-nowrap">{f.code}</td>
                      <td className="py-2 px-4"><Link to={productPath(f)} className="font-medium text-brand-charcoal hover:text-brand-orange">{f.name}</Link></td>
                      <td className="py-2 px-4 font-mono text-xs text-stone-500 whitespace-nowrap">
                        {s.range ? `${s.range[0]} – ${s.range[1]} (${f.count})` : s.label}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > limit && (
          <div className="flex flex-col items-center gap-3 mt-10">
            <p className="text-sm text-stone-500">Showing {shown.length} of {filtered.length.toLocaleString()}</p>
            <button type="button" onClick={() => setLimit(l => l + PAGE)} className="h-11 px-6 rounded-lg border border-brand-charcoal text-brand-charcoal font-medium hover:bg-brand-charcoal hover:text-white transition-colors">
              Show more instruments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

