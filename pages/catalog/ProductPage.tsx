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
  FEATURE_LABELS, cm, familyCodeOf, specialtyPath, typePath, useCatalog, useVariants, type Family, type Variant,
} from '../../lib/catalog';
import { CatalogLoading } from './ListingPages';

const WHATSAPP = CONTACT_INFO.phone.replace(/[^0-9]/g, '');
const clamp = (n: number) => Math.max(0, Math.min(9999, n));

const Gallery: React.FC<{ images: string[]; alt: string }> = ({ images, alt }) => {
  const [i, setI] = useState(0);
  if (!images.length) {
    return <div className="aspect-square flex items-center justify-center"><Package size={56} className="text-stone-300" strokeWidth={1.25} /></div>;
  }
  return (
    <div>
      <div className="aspect-square flex items-center justify-center">
        <img src={images[Math.min(i, images.length - 1)]} alt={alt} className="w-full h-full object-contain mix-blend-multiply" />
      </div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {images.map((src, n) => (
            <button key={src} type="button" onClick={() => setI(n)} aria-pressed={n === i} aria-label={`Image ${n + 1} of ${images.length}`}
              className={`w-16 h-16 p-1 rounded border bg-white ${n === i ? 'border-brand-charcoal ring-1 ring-brand-charcoal' : 'border-stone-200 hover:border-stone-400'}`}>
              <img src={src} alt="" className="w-full h-full object-contain mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SizeTable: React.FC<{ family: Family; variants: Variant[]; highlight?: string }> = ({ family, variants, highlight }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState<Record<string, number>>(() => (highlight ? { [highlight]: 1 } : {}));
  const [filter, setFilter] = useState('');
  const [warn, setWarn] = useState(false);

  const showLabel = variants.some(v => v.label);
  const showLength = variants.some(v => v.sizeCm !== null);
  const maxLen = Math.max(...variants.map(v => v.sizeCm ?? 0), 1);
  const rows = useMemo(() => {
    const n = filter.trim().toLowerCase();
    return n ? variants.filter(v => v.sku.toLowerCase().includes(n) || v.label.toLowerCase().includes(n)) : variants;
  }, [variants, filter]);
  const picked = variants.filter(v => (qty[v.sku] ?? 0) > 0);
  const describe = (v: Variant) => [v.label, v.sizeCm ? cm(v.sizeCm) : ''].filter(Boolean).join(', ');
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
              <th className="py-2 px-5 font-medium">SKU</th>
              {showLabel && <th className="py-2 px-3 font-medium">Option</th>}
              {showLength && <th className="py-2 px-3 font-medium">Length</th>}
              <th className="py-2 px-5 font-medium text-right">Qty</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(v => {
              const on = (qty[v.sku] ?? 0) > 0;
              return (
                <tr key={v.sku} className={`border-b border-stone-100 last:border-0 ${on ? 'bg-brand-orange/5' : ''}`}>
                  <td className="py-2.5 px-5 font-mono text-[13px] whitespace-nowrap">{v.sku}</td>
                  {showLabel && <td className="py-2.5 px-3 text-stone-700">{v.label || '—'}</td>}
                  {showLength && (
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {v.sizeCm !== null ? (
                        <span className="inline-flex items-center gap-3">
                          <span className="min-w-[56px]">{cm(v.sizeCm)}</span>
                          <span className="hidden sm:block w-16 h-1 bg-stone-100 rounded" aria-hidden="true">
                            <span className="block h-full bg-stone-400 rounded" style={{ width: `${(v.sizeCm / maxLen) * 100}%` }} />
                          </span>
                        </span>
                      ) : '—'}
                    </td>
                  )}
                  <td className="py-2.5 px-5 text-right">
                    <span className="inline-flex items-center border border-stone-200 rounded">
                      <button type="button" onClick={() => bump(v.sku, -1)} aria-label={`Less ${v.sku}`} className="w-8 h-8 grid place-items-center text-stone-500 hover:text-brand-charcoal"><Minus size={14} /></button>
                      <input inputMode="numeric" value={qty[v.sku] ?? 0} aria-label={`Quantity ${v.sku}`}
                        onChange={e => { const n = clamp(Number(e.target.value.replace(/\D/g, '')) || 0); setQty(s => ({ ...s, [v.sku]: n })); setWarn(false); }}
                        className="w-10 text-center tabular-nums border-0 focus:outline-none" />
                      <button type="button" onClick={() => bump(v.sku, 1)} aria-label={`More ${v.sku}`} className="w-8 h-8 grid place-items-center text-stone-500 hover:text-brand-charcoal"><Plus size={14} /></button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 px-5 pt-4">
        <button type="button" onClick={add} className="h-12 rounded-lg bg-brand-orange text-white font-semibold hover:brightness-95 transition">Add to Quote Cart</button>
        <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"
          className="h-12 rounded-lg bg-[#1f7a4d] text-white font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition">
          <MessageCircle size={18} /> Ask on WhatsApp
        </a>
      </div>
      <p className="px-5 pt-3 text-sm min-h-[24px] text-brand-orange" role="status">{warn ? 'Set a quantity for at least one size.' : ''}</p>
      <p className="px-5 pb-5 text-[13px] text-stone-500">Prices depend on quantity and destination. We reply with a quote on WhatsApp or email.</p>
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
  const { data: catalogue } = useCatalogueForProduct(family ? ({ id: family.code, sku: `${family.code}-00` } as Product) : null);
  const highlight = param !== code ? param : undefined;

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
  const images = [...new Set([family.image, ...variants.map(v => v.image)].filter((x): x is string => !!x))].slice(0, 8);
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
            <Gallery images={images} alt={family.name} />
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
                <SizeTable key={family.code} family={family} variants={variants} highlight={highlight} />
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
                    <dd><Link to="/catalogues" className="inline-flex items-center gap-1.5 hover:text-brand-orange"><BookOpen size={15} /> {catalogue.title}</Link></dd>
                  </div>
                )}
              </dl>
            </section>
          </div>
        </div>

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

