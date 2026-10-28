import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Loader2, MessageCircle, Minus, Package, Plus } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { useCart } from '../../components/CartProvider';
import { useToast } from '../../components/ToastProvider';
import { FamilyCard } from '../../components/catalog/FamilyCard';
import { CONTACT_INFO } from '../../constants';
import { useCatalogueForProduct } from '../../lib/queries';
import type { Product } from '../../lib/database';
import {
  FEATURE_LABELS, cm, familyCodeOf, specialtyPath, typePath, useCatalog, useSetContents, useVariants, type Family, type Variant,
} from '../../lib/catalog';
import { CatalogLoading } from './ListingPages';

const WHATSAPP = CONTACT_INFO.phone.replace(/[^0-9]/g, '');
const clamp = (n: number) => Math.max(0, Math.min(9999, n));

// Each distinct picture with the codes it shows, in SKU order.
type Picture = { src: string; skus: string[]; label: string };

const describe = (v: Variant) => [v.label, v.sizeCm ? cm(v.sizeCm) : ''].filter(Boolean).join(', ');

// The big picture says which code(s) it shows; a thumbnail picks the first of its codes.
const Gallery: React.FC<{ pictures: Picture[]; current: Picture | undefined; caption: React.ReactNode; alt: string; onPick: (p: Picture) => void }> = ({ pictures, current, caption, alt, onPick }) => {
  if (!current) {
    return <div className="aspect-square flex items-center justify-center"><Package size={56} className="text-stone-300" strokeWidth={1.25} /></div>;
  }
  return (
    <div>
      <div className="aspect-square flex items-center justify-center">
        <img src={current.src} alt={alt} className="w-full h-full object-contain mix-blend-multiply" />
      </div>
      <p className="mt-4 text-sm text-stone-600 min-h-[20px]" aria-live="polite">{caption}</p>
      {pictures.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {pictures.map(p => (
            <button key={p.src} type="button" onClick={() => onPick(p)} aria-pressed={p === current}
              aria-label={`Picture of ${p.skus.join(', ')}`} title={p.skus.join(', ')}
              className={`w-20 rounded border bg-white text-left ${p === current ? 'border-brand-charcoal ring-1 ring-brand-charcoal' : 'border-stone-200 hover:border-stone-400'}`}>
              <span className="block h-16 p-1"><img src={p.src} alt="" className="w-full h-full object-contain mix-blend-multiply" /></span>
              <span className="block px-1.5 pb-1 font-mono text-[11px] text-stone-500 truncate">{p.skus.length > 1 ? `${p.skus.length} codes` : p.skus[0]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SizeTable: React.FC<{
  family: Family; variants: Variant[]; highlight?: string;
  selected?: Picture; selectedSku?: string; showPictures: boolean; onSelect: (v: Variant) => void;
}> = ({ family, variants, highlight, selected, selectedSku, showPictures, onSelect }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState<Record<string, number>>(() => (highlight ? { [highlight]: 1 } : variants.length === 1 ? { [variants[0].sku]: 1 } : {}));
  const [filter, setFilter] = useState('');
  const [warn, setWarn] = useState(false);

  const showLabel = variants.some(v => v.label);
  const showLength = variants.some(v => v.sizeCm !== null);
  const maxLen = Math.max(...variants.map(v => v.sizeCm ?? 0), 1);
  // The length bar compares sizes; it makes room for the pictures, and says nothing when every size is the same.
  const showBar = !showPictures && new Set(variants.map(v => v.sizeCm).filter(s => s !== null)).size > 1;
  const rows = useMemo(() => {
    const n = filter.trim().toLowerCase();
    return n ? variants.filter(v => v.sku.toLowerCase().includes(n) || v.label.toLowerCase().includes(n)) : variants;
  }, [variants, filter]);
  const picked = variants.filter(v => (qty[v.sku] ?? 0) > 0);
  // Steppers work from the latest value so quick repeated taps all count.
  const bump = (sku: string, d: number) => { setQty(s => ({ ...s, [sku]: clamp((s[sku] ?? 0) + d) })); setWarn(false); };

  const add = () => {
    if (!picked.length) { setWarn(true); return; }
    let total = 0;
    for (const v of picked) {
      const extra = describe(v);
      addToCart({ id: v.sku, sku: v.sku, name: extra ? `${family.name}, ${extra}` : family.name, image_url: v.image ?? family.image ?? '' }, qty[v.sku]);
      total += qty[v.sku];
    }
    showToast('Added to Quote Cart', 'success', { productName: family.name, quantity: total });
    setQty({});
  };

  const message = picked.length
    ? `Hello Smith Instruments, I would like a quote for:\n${picked.map(v => `• ${v.sku} ${family.name}${describe(v) ? `, ${describe(v)}` : ''} × ${qty[v.sku]}`).join('\n')}`
    : `Hello Smith Instruments, I have a question about ${family.name} (${family.code}).`;

  const stepper = (v: Variant, big = false) => (
    <span className="inline-flex items-center border border-stone-200 rounded bg-white">
      <button type="button" onClick={() => bump(v.sku, -1)} aria-label={`Less ${v.sku}`} className={`${big ? 'w-10 h-10' : 'w-8 h-8'} grid place-items-center text-stone-500 hover:text-brand-charcoal`}><Minus size={14} /></button>
      <input inputMode="numeric" value={qty[v.sku] ?? 0} aria-label={`Quantity ${v.sku}`}
        onChange={e => { const n = clamp(Number(e.target.value.replace(/\D/g, '')) || 0); setQty(s => ({ ...s, [v.sku]: n })); setWarn(false); }}
        className={`${big ? 'w-12 text-base' : 'w-10'} text-center tabular-nums border-0 focus:outline-none`} />
      <button type="button" onClick={() => bump(v.sku, 1)} aria-label={`More ${v.sku}`} className={`${big ? 'w-10 h-10' : 'w-8 h-8'} grid place-items-center text-stone-500 hover:text-brand-charcoal`}><Plus size={14} /></button>
    </span>
  );

  const actions = (
    <>
      <div className="grid sm:grid-cols-2 gap-3 px-5 pt-4">
        <button type="button" onClick={add} className="h-12 rounded-lg bg-brand-orange text-white font-semibold hover:brightness-95 transition">Add to Quote Cart</button>
        <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"
          className="h-12 rounded-lg bg-[#1f7a4d] text-white font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition">
          <MessageCircle size={18} /> Ask on WhatsApp
        </a>
      </div>
      <p className="px-5 pt-3 text-sm min-h-[24px] text-brand-orange" role="status">{warn ? (variants.length === 1 ? 'Set a quantity first.' : 'Set a quantity for at least one size.') : ''}</p>
      <p className="px-5 pb-5 text-[13px] text-stone-500">Prices depend on quantity and destination. We reply with a quote on WhatsApp or email.</p>
    </>
  );

  // One code: nothing to choose, so the code, its details and the quantity sit together.
  if (variants.length === 1) {
    const v = variants[0];
    return (
      <div className="bg-white border border-stone-200 rounded-lg">
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 pt-5">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-stone-500">SKU</dt><dd className="font-mono text-[13px] text-brand-charcoal">{v.sku}</dd>
            {v.label && <><dt className="text-stone-500">Option</dt><dd className="text-stone-700">{v.label}</dd></>}
            {v.sizeCm !== null && <><dt className="text-stone-500">Length</dt><dd className="text-stone-700">{cm(v.sizeCm)}</dd></>}
          </dl>
          <label className="flex items-center gap-3 text-sm text-stone-500">Quantity {stepper(v, true)}</label>
        </div>
        {actions}
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4 pb-2">
        <h2 className="font-heading text-base text-brand-charcoal">Choose sizes and quantities</h2>
        {variants.length > 10 && (
          <input type="search" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter SKU or option" aria-label="Filter sizes"
            className="h-9 px-3 rounded-md border border-stone-200 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-brand-orange/40" />
        )}
      </div>
      <div className="max-h-[520px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-left text-xs text-stone-500 border-b border-stone-200">
              {showPictures && <th className="py-2 pl-3 sm:pl-5 pr-1 font-medium"><span className="sr-only">Picture</span></th>}
              <th className={`py-2 font-medium ${showPictures ? 'px-2' : 'pl-3 sm:pl-5 pr-2'}`}>{showLabel ? 'SKU and option' : 'SKU'}</th>
              {showLength && <th className="hidden sm:table-cell py-2 px-2 font-medium">Length</th>}
              <th className="py-2 pl-2 pr-3 sm:pr-5 font-medium text-right">Qty</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(v => {
              const on = (qty[v.sku] ?? 0) > 0;
              // The code chosen, or every code that shares the picture shown.
              const shown = showPictures && (v.sku === selectedSku || (!!selected && !!v.image && selected.skus.includes(v.sku)));
              return (
                <tr key={v.sku}
                  onClick={showPictures ? e => { if (!(e.target as HTMLElement).closest('button, input')) onSelect(v); } : undefined}
                  className={`border-b border-stone-100 last:border-0 ${shown ? 'bg-stone-100' : on ? 'bg-brand-orange/5' : ''} ${showPictures ? 'cursor-pointer hover:bg-stone-50' : ''}`}>
                  {showPictures && (
                    <td className={`py-1.5 pl-3 sm:pl-5 pr-1 ${shown ? 'shadow-[inset_3px_0_0_#FF5E00]' : ''}`}>
                      <button type="button" onClick={() => onSelect(v)} aria-label={`Show the picture of ${v.sku}`} aria-pressed={shown}
                        className={`w-14 h-11 rounded border bg-white p-0.5 flex items-center justify-center ${shown ? 'border-brand-charcoal' : 'border-stone-200 hover:border-stone-400'}`}>
                        {v.image
                          ? <img src={v.image} alt="" loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
                          : <Package size={16} className="text-stone-300" strokeWidth={1.5} />}
                      </button>
                    </td>
                  )}
                  <td className={`py-2.5 ${showPictures ? 'px-2' : 'pl-3 sm:pl-5 pr-2'}`}>
                    <span className="block font-mono text-[13px] whitespace-nowrap">{v.sku}</span>
                    {/* On a phone the length rides on this line instead of its own column. */}
                    {((showLabel && v.label) || v.sizeCm !== null) && (
                      <span className={`${showLabel && v.label ? 'block' : 'block sm:hidden'} text-[13px] leading-snug text-stone-600 mt-0.5`}>
                        {showLabel && v.label}
                        {v.sizeCm !== null && <span className="sm:hidden">{showLabel && v.label ? ' · ' : ''}{cm(v.sizeCm)}</span>}
                      </span>
                    )}
                  </td>
                  {showLength && (
                    <td className="hidden sm:table-cell py-2.5 px-2 whitespace-nowrap">
                      {v.sizeCm !== null ? (
                        <span className="inline-flex items-center gap-3">
                          <span className={showBar ? 'min-w-[56px]' : undefined}>{cm(v.sizeCm)}</span>
                          <span className={`${showBar ? 'hidden sm:block' : 'hidden'} w-16 h-1 bg-stone-100 rounded`} aria-hidden="true">
                            <span className="block h-full bg-stone-400 rounded" style={{ width: `${(v.sizeCm / maxLen) * 100}%` }} />
                          </span>
                        </span>
                      ) : '—'}
                    </td>
                  )}
                  <td className="py-2.5 pl-2 pr-3 sm:pr-5 text-right">{stepper(v)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {actions}
    </div>
  );
};

export const ProductPage: React.FC = () => {
  const { sku = '' } = useParams();
  const { data: catalog, isLoading } = useCatalog();
  const param = decodeURIComponent(sku).trim().toUpperCase();
  const code = /^\d+-\d+$/.test(param) ? param : familyCodeOf(param);
  const family = code ? catalog?.byCode.get(code) : undefined;
  const { data: variants = [], isLoading: variantsLoading } = useVariants(family);
  const { data: setContents } = useSetContents(family);
  const { data: catalogue } = useCatalogueForProduct(family ? ({ id: family.code, sku: `${family.code}-00` } as Product) : null);
  const highlight = param !== code ? param : undefined;
  // The code whose picture is shown: the one in the address, then whichever row or thumbnail was clicked.
  const [selectedSku, setSelectedSku] = useState<string | undefined>(highlight);
  useEffect(() => { setSelectedSku(highlight); }, [family?.code, highlight]);

  const pictures = useMemo<Picture[]>(() => {
    const bySrc = new Map<string, Picture>();
    for (const v of variants) {
      if (!v.image) continue;
      if (!bySrc.has(v.image)) bySrc.set(v.image, { src: v.image, skus: [], label: describe(v) });
      bySrc.get(v.image)!.skus.push(v.sku);
    }
    if (!bySrc.size && family?.image) bySrc.set(family.image, { src: family.image, skus: [], label: '' });
    return [...bySrc.values()];
  }, [variants, family?.image]);

  useEffect(() => {
    if (highlight && variants.length) document.getElementById('sizes')?.scrollIntoView({ block: 'center' });
  }, [highlight, variants.length]);

  if (isLoading) return <CatalogLoading />;
  if (!catalog || !family) {
    return (
      <div className="min-h-[70vh] pt-32 pb-20 container mx-auto px-6 text-center">
        <SEO title="Instrument not found" description="This instrument is not in our current catalogue." noIndex />
        <h1 className="font-heading text-3xl text-brand-charcoal mb-3">Instrument not found</h1>
        <p className="text-stone-500 mb-8">We couldn't find "{param}". It may have been renamed or removed from the catalogue.</p>
        <Link to="/products" className="inline-flex h-12 px-6 items-center rounded-lg bg-brand-orange text-white font-semibold">Browse all instruments</Link>
      </div>
    );
  }

  const typeLabel = catalog.labels.types[family.type];
  const subLabel = family.subtype ? catalog.labels.subtypes[family.type]?.[family.subtype] : undefined;
  const images = pictures.map(p => p.src);
  const selectedVariant = variants.find(v => v.sku === selectedSku);
  const current = (selectedVariant?.image && pictures.find(p => p.src === selectedVariant.image)) || pictures[0];
  // Row pictures only help when the codes don't all look the same.
  const showPictures = pictures.length > 1;
  const shownVariant = selectedVariant?.image === current?.src ? selectedVariant : variants.find(v => v.sku === current?.skus[0]);
  const caption = !current || !current.skus.length ? null
    : !showPictures ? (variants.length > 1 ? `Same design in all ${variants.length} sizes` : null)
    : (
      <>
        <span className="font-mono font-semibold text-brand-charcoal">{shownVariant?.sku}</span>
        {shownVariant && describe(shownVariant) && <> · {describe(shownVariant)}</>}
        {current.skus.length > 1 && <span className="text-stone-400"> · same picture for {current.skus.length} codes</span>}
      </>
    );
  const pick = (p: Picture) => setSelectedSku(p.skus[0]);
  // Sets on this page with their contents: the chosen code's set first.
  const setsHere = variants.flatMap(v => (setContents?.has(v.sku) ? [[v.sku, setContents.get(v.sku)!] as const] : []))
    .sort(([a], [b]) => Number(b === selectedSku) - Number(a === selectedSku));
  // Where the code shown is printed in its chapter's PDF catalogue.
  const cataloguePage = (shownVariant ?? variants[0])?.page ?? variants.find(v => v.page)?.page ?? null;
  const catalogueLink = catalogue ? `/catalogues?catalogue=${family.code.slice(0, 2)}${cataloguePage ? `&page=${cataloguePage}` : ''}` : null;
  const related = catalog.families.filter(f => f.code !== family.code && f.type === family.type && f.subtype === family.subtype).slice(0, 5);
  const hasRange = family.sizeMin !== null && family.sizeMax !== null && family.sizeMax > family.sizeMin;
  const material = family.features.includes('titanium') ? 'Titanium or stainless steel (by model)'
    : family.features.includes('tc') ? 'Stainless steel with tungsten carbide inserts' : 'Stainless steel';
  const crumbs = [
    { to: '/products', label: 'Products' },
    { to: typePath(family.type), label: typeLabel },
    ...(subLabel ? [{ to: typePath(family.type, family.subtype!), label: subLabel }] : []),
  ];
  const schema = {
    '@context': 'https://schema.org', '@type': 'Product', name: family.name, sku: family.code, mpn: family.code,
    image: images, category: typeLabel, brand: { '@type': 'Brand', name: 'Smith Instruments' },
  };

  return (
    <div className="bg-stone-50 pt-24 md:pt-28 pb-20">
      <SEO
        title={`${family.name} ${family.code}`}
        description={`${family.name} (${family.code}). ${typeLabel}, ${family.count} ${family.count === 1 ? 'model' : 'models'}. Request a quote on WhatsApp from Smith Instruments.`}
        image={family.image ?? undefined}
        structuredData={schema}
        breadcrumbs={crumbs.map(c => ({ name: c.label, item: `https://smithinstruments.net${c.to}` }))}
      />
      <div className="container mx-auto px-6">
        <nav aria-label="Breadcrumb" className="py-4">
          <ol className="flex flex-wrap gap-2 text-xs uppercase tracking-widest text-stone-500">
            {crumbs.map((c, i) => (
              <li key={c.to} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                <Link to={c.to} className="hover:text-brand-orange">{c.label}</Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid lg:grid-cols-[7fr_5fr] gap-8 lg:gap-10 items-start">
          <div className="lg:sticky lg:top-28 bg-white border border-stone-200 rounded-lg p-6 md:p-10">
            <Gallery pictures={pictures} current={current} caption={caption} onPick={pick}
              alt={shownVariant && showPictures ? `${family.name}, ${shownVariant.sku}` : family.name} />
            {catalogue && catalogueLink && cataloguePage && (
              <Link to={catalogueLink} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-charcoal hover:text-brand-orange">
                <BookOpen size={16} /> See it in the {catalogue.title} catalogue, page {cataloguePage}
              </Link>
            )}
            {hasRange && (
              <div className="mt-6 text-brand-orange">
                <div className="relative h-3" aria-hidden="true">
                  <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
                  <span className="absolute left-0 top-0 bottom-0 w-px bg-current" />
                  <span className="absolute right-0 top-0 bottom-0 w-px bg-current" />
                </div>
                <div className="mt-2 flex justify-between font-mono text-xs text-stone-600">
                  <span>{cm(family.sizeMin!)}</span><span className="text-stone-400">{family.count} sizes</span><span>{cm(family.sizeMax!)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 min-w-0">
            <div>
              <p className="font-mono text-xs text-stone-500">{family.codes.length > 1 ? family.codes.join(', ') : `Family ${family.code}`}</p>
              <h1 className="font-heading text-3xl md:text-4xl text-brand-charcoal leading-tight mt-2">{family.name}</h1>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link to={typePath(family.type)} className="text-[13px] px-3 py-1 rounded-full border border-stone-200 bg-white hover:border-stone-400">{typeLabel}</Link>
                {subLabel && <Link to={typePath(family.type, family.subtype!)} className="text-[13px] px-3 py-1 rounded-full border border-stone-200 bg-white hover:border-stone-400">{subLabel}</Link>}
                {family.features.filter(f => f !== 'straight' && f !== 'curved').map(f => (
                  <span key={f} className="text-[13px] px-3 py-1 rounded-full border border-stone-200 text-stone-600">{FEATURE_LABELS[f]}</span>
                ))}
              </div>
            </div>

            <div id="sizes">
              {variantsLoading ? (
                <div className="bg-white border border-stone-200 rounded-lg py-12 flex justify-center"><Loader2 className="animate-spin text-brand-orange" /></div>
              ) : (
                <SizeTable key={family.code} family={family} variants={variants} highlight={highlight}
                  selected={current} selectedSku={selectedSku} showPictures={showPictures} onSelect={v => setSelectedSku(v.sku)} />
              )}
            </div>

            <section aria-labelledby="details-h">
              <h2 id="details-h" className="font-heading text-lg text-brand-charcoal mb-1">Details</h2>
              <dl className="text-[15px]">
                <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-stone-200">
                  <dt className="text-stone-500">Instrument type</dt>
                  <dd><Link to={typePath(family.type)} className="hover:text-brand-orange">{typeLabel}</Link></dd>
                </div>
                {family.specialties.length > 0 && (
                  <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-stone-200">
                    <dt className="text-stone-500">Specialties</dt>
                    <dd>{family.specialties.map((s, i) => (
                      <span key={s}>{i > 0 && ', '}<Link to={specialtyPath(s)} className="hover:text-brand-orange">{catalog.labels.specialties[s]}</Link></span>
                    ))}</dd>
                  </div>
                )}
                <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-stone-200">
                  <dt className="text-stone-500">Material</dt><dd>{material}</dd>
                </div>
                {catalogue && (
                  <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-stone-200">
                    <dt className="text-stone-500">Catalogue</dt>
                    <dd><Link to={catalogueLink ?? '/catalogues'} className="inline-flex items-center gap-1.5 hover:text-brand-orange"><BookOpen size={15} /> {catalogue.title}{cataloguePage ? `, page ${cataloguePage}` : ''}</Link></dd>
                  </div>
                )}
              </dl>
            </section>
          </div>
        </div>

        {setsHere.length > 0 && (
          <section className="mt-12 pt-8 border-t border-stone-200" aria-labelledby="set-h">
            <h2 id="set-h" className="font-heading text-2xl text-brand-charcoal mb-6">What's in the set</h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {setsHere.map(([setSku, items]) => (
                <div key={setSku}>
                  {setsHere.length > 1 && <p className="font-mono text-sm text-stone-500 mb-2">{setSku}</p>}
                  <ul className="bg-white border border-stone-200 rounded-lg divide-y divide-stone-100 text-[15px]">
                    {items.map(it => (
                      <li key={it.sku} className="flex items-baseline gap-4 px-5 py-2.5">
                        <span className="tabular-nums text-stone-500 w-8 shrink-0">{it.quantity} ×</span>
                        <span className="flex-1 min-w-0">
                          {it.onWebsite ? <Link to={`/product/${it.sku}`} className="hover:text-brand-orange">{it.name}</Link> : it.name}
                        </span>
                        <span className="font-mono text-[13px] text-stone-500 whitespace-nowrap">{it.sku}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {[
          { id: 'used-with', title: 'Used with', codes: family.usedWith },
          { id: 'parts', title: 'Parts and accessories', codes: family.parts },
        ].map(({ id, title, codes }) => {
          const pages = codes.map(c => catalog.byCode.get(c)).filter((f): f is Family => !!f);
          return pages.length > 0 && (
            <section key={id} className="mt-12 pt-8 border-t border-stone-200" aria-labelledby={`${id}-h`}>
              <h2 id={`${id}-h`} className="font-heading text-2xl text-brand-charcoal mb-6">{title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {pages.map(f => <FamilyCard key={f.code} family={f} />)}
              </div>
            </section>
          );
        })}

        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-stone-200" aria-labelledby="related-h">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
              <h2 id="related-h" className="font-heading text-2xl text-brand-charcoal">More {subLabel ? subLabel.toLowerCase() : typeLabel.toLowerCase()}</h2>
              <Link to={subLabel ? typePath(family.type, family.subtype!) : typePath(family.type)} className="text-sm font-semibold text-brand-orange hover:underline">See all →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {related.map((f, i) => (
                <div key={f.code} className={i >= 3 ? 'hidden lg:block' : i === 2 ? 'hidden md:block' : ''}><FamilyCard family={f} /></div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

