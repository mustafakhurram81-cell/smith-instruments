import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Scissors, Search, Stethoscope, Package } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { ParallaxHeader } from '../../components/ui/ParallaxHeader';
import { Section } from '../../components/Shared';
import { counts, productPath, searchFamilies, specialtyPath, subtypesOf, typePath, useCatalog, type Catalog } from '../../lib/catalog';
import { CatalogLoading } from './ListingPages';

// Representative product per type for the thumbnails; otherwise the imaged product with the most sizes.
const TYPE_COVER: Record<string, string> = {
  'scissors': '02-134', 'needle-holders': '11-444', 'haemostats-clamps': '04-670', 'tissue-forceps': '03-196',
  'retractors': '06-310', 'rongeurs-bone-cutters': '15-571', 'osteotomes-chisels': '13-320',
};

function coverFor(catalog: Catalog, type: string) {
  const curated = TYPE_COVER[type] ? catalog.byCode.get(TYPE_COVER[type]) : undefined;
  if (curated?.image) return curated.image;
  return catalog.families.filter(f => f.type === type && f.image).sort((a, b) => b.count - a.count)[0]?.image ?? null;
}

const SearchBox: React.FC<{ catalog: Catalog }> = ({ catalog }) => {
  const [q, setQ] = useState('');
  const results = useMemo(() => searchFamilies(catalog, q), [catalog, q]);
  return (
    <div className="relative max-w-2xl mx-auto" role="search">
      <div className="bg-white p-2 rounded-full shadow-lg border border-stone-200 flex items-center gap-2">
        <Search size={18} className="ml-4 text-stone-400 shrink-0" />
        <label htmlFor="catalog-search" className="sr-only">Search instruments</label>
        <input
          id="catalog-search"
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={`Search ${catalog.families.length.toLocaleString()} instruments by name or SKU`}
          autoComplete="off"
          className="flex-grow bg-transparent border-none !outline-none !ring-0 text-brand-charcoal placeholder-stone-400 h-10"
        />
      </div>
      {q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl z-20 max-h-[60vh] overflow-y-auto text-left">
          {results.length === 0 ? (
            <p className="px-5 py-6 text-sm text-stone-500">No instruments found. Try a shorter name, or a SKU like 02-134.</p>
          ) : (
            <ul className="py-2">
              {results.map(f => (
                <li key={f.code}>
                  <Link to={productPath(f)} className="flex items-center gap-4 px-5 py-2.5 hover:bg-stone-50">
                    <span className="w-12 h-12 shrink-0 bg-stone-50 rounded flex items-center justify-center">
                      {f.image ? <img src={f.image} alt="" className="w-full h-full object-contain mix-blend-multiply" /> : <Package size={18} className="text-stone-300" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-brand-charcoal truncate">{f.name}</span>
                      <span className="block font-mono text-[11px] text-stone-500">{f.code}, {catalog.labels.types[f.type]}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export const CatalogIndex: React.FC = () => {
  const { data: catalog, isLoading } = useCatalog();
  const [params, setParams] = useSearchParams();
  const mode = params.get('by') === 'specialty' ? 'specialty' : 'type';

  if (isLoading || !catalog) return <CatalogLoading />;
  const c = counts(catalog);
  const types = Object.keys(catalog.labels.types)
    .filter(t => c.byType[t])
    .sort((a, b) => (a === 'other' ? 1 : b === 'other' ? -1 : c.byType[b] - c.byType[a]));
  const specialties = Object.keys(catalog.labels.specialties).filter(s => c.bySpecialty[s]).sort((a, b) => c.bySpecialty[b] - c.bySpecialty[a]);
  const tab = (active: boolean) => `flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md transition-all ${active ? 'bg-white text-brand-charcoal shadow-sm' : 'text-stone-500 hover:text-stone-700'}`;

  return (
    <div className="bg-stone-50 min-h-screen">
      <SEO
        title="Surgical Instruments Catalog"
        description={`Browse ${catalog.families.length.toLocaleString()} surgical instruments by instrument type or specialty, with every size and SKU listed. Request a quote on WhatsApp.`}
        keywords="surgical instruments catalog, surgical scissors, needle holders, haemostatic forceps, retractors, rongeurs, surgical instrument manufacturer"
      />
      <ParallaxHeader
        title="Precision Instruments"
        description={`${catalog.families.length.toLocaleString()} instruments across ${types.length} instrument types and ${specialties.length} specialties`}
        image="/images/headers/products-header.webp"
        breadcrumbs={<span className="text-brand-orange uppercase tracking-widest text-xs font-bold block">Our Catalog</span>}
      />

      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-6 py-8">
          <SearchBox catalog={catalog} />
          <div className="mt-6 flex justify-center">
            <div className="flex items-center bg-stone-100 p-1 rounded-lg">
              <button type="button" aria-pressed={mode === 'type'} onClick={() => setParams({}, { replace: true })} className={tab(mode === 'type')}>
                <Scissors size={16} /> By Instrument Type
              </button>
              <button type="button" aria-pressed={mode === 'specialty'} onClick={() => setParams({ by: 'specialty' }, { replace: true })} className={tab(mode === 'specialty')}>
                <Stethoscope size={16} /> By Specialty
              </button>
            </div>
          </div>
        </div>
      </div>

      <Section className="!py-12">
        <div className="container mx-auto px-6">
          {mode === 'type' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {types.map(t => {
                const cover = coverFor(catalog, t);
                const subs = subtypesOf(catalog, t).slice(0, 4);
                return (
                  <div key={t} className="bg-white border border-stone-200 rounded-lg p-5 flex gap-5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-shadow">
                    <Link to={typePath(t)} className="w-24 h-24 shrink-0 bg-stone-50 rounded-md p-2 flex items-center justify-center" aria-hidden="true" tabIndex={-1}>
                      {cover ? <img src={cover} alt="" loading="lazy" className="w-full h-full object-contain mix-blend-multiply" /> : <Package className="text-stone-300" />}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={typePath(t)} className="font-heading text-lg text-brand-charcoal hover:text-brand-orange transition-colors leading-snug block">
                        {catalog.labels.types[t]}
                      </Link>
                      <p className="font-mono text-[11px] text-stone-500 mt-0.5">{c.byType[t]} instruments</p>
                      {subs.length > 1 && (
                        <ul className="mt-3 space-y-1">
                          {subs.map(s => (
                            <li key={s.slug}>
                              <Link to={typePath(t, s.slug)} className="text-[13px] leading-snug text-stone-600 hover:text-brand-orange flex justify-between gap-3">
                                <span>{s.label}</span><span className="font-mono text-[11px] text-stone-400">{s.items.length}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-brand-charcoal">
              {specialties.map(s => (
                <Link key={s} to={specialtyPath(s)} className="flex items-baseline justify-between gap-4 py-5 border-b border-stone-200 text-lg text-brand-charcoal hover:text-brand-orange transition-colors">
                  {catalog.labels.specialties[s]}
                  <span className="font-mono text-xs text-stone-500">{c.bySpecialty[s]}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};
