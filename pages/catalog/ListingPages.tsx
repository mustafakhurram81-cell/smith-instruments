import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { CatalogHero } from '../../components/catalog/CatalogHero';
import { FamilyCard } from '../../components/catalog/FamilyCard';
import { FamilyBrowser } from '../../components/catalog/FamilyBrowser';
import { specialtyPath, subtypesOf, typePath, useCatalog, type Catalog, type Family } from '../../lib/catalog';
import { legacyTarget } from '../../lib/catalog/legacy';

export const CatalogLoading: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center pt-24">
    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
  </div>
);

const CatalogError: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center pt-24 px-6 text-center text-stone-500">
    The catalogue could not be loaded. Please refresh the page, or message us on WhatsApp.
  </div>
);

// Wraps a page that needs the catalog index, handling loading and error states once.
function withCatalog<P>(Page: React.FC<P & { catalog: Catalog }>): React.FC<P> {
  return props => {
    const { data, isLoading, isError } = useCatalog();
    if (isLoading) return <CatalogLoading />;
    if (isError || !data) return <CatalogError />;
    return <Page {...props} catalog={data} />;
  };
}

const Jump: React.FC<{ items: { slug: string; label: string; count: number }[] }> = ({ items }) => (
  <nav aria-label="Jump to category" className="flex flex-wrap gap-2 lg:justify-end lg:max-w-xl">
    {items.map(i => (
      <a key={i.slug} href={`#${i.slug}`} className="text-[13px] px-3 py-1.5 rounded-full border border-white/20 text-stone-200 hover:border-brand-orange hover:text-white transition-colors whitespace-nowrap">
        {i.label} <span className="font-mono text-[11px] text-stone-400">{i.count}</span>
      </a>
    ))}
  </nav>
);

const Group: React.FC<{ id: string; title: string; items: Family[]; to: string }> = ({ id, title, items, to }) => (
  <section id={id} className="scroll-mt-28 py-10 border-b border-stone-200 last:border-0">
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
      <h2 className="font-heading text-2xl text-brand-charcoal">{title}</h2>
      {items.length > 5 && (
        <Link to={to} className="text-sm font-semibold text-brand-orange hover:underline whitespace-nowrap">See all {items.length} →</Link>
      )}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.slice(0, 5).map((f, i) => (
        <div key={f.code} className={i >= 3 ? 'hidden lg:block' : i === 2 ? 'hidden md:block' : ''}>
          <FamilyCard family={f} />
        </div>
      ))}
    </div>
  </section>
);

const specialtyOptions = (catalog: Catalog) =>
  Object.entries(catalog.labels.specialties).map(([slug, label]) => ({ slug, label }));

// /products/type/:type
export const TypePage = withCatalog(({ catalog }) => {
  const { type = '' } = useParams();
  const label = catalog.labels.types[type];
  if (!label) return <Navigate to="/products" replace />;
  const items = catalog.families.filter(f => f.type === type);
  const subs = subtypesOf(catalog, type);
  return (
    <>
      <SEO title={`${label} | Surgical Instruments`} description={`${items.length} ${label.toLowerCase()} from Smith Instruments, grouped by pattern and use. Every size and SKU listed.`} />
      <CatalogHero
        crumbs={[{ to: '/products', label: 'Products' }, { to: typePath(type), label }]}
        title={label}
        lead={`${items.length} instruments, grouped by pattern and use.`}
      >
        {subs.length > 1 && <Jump items={subs.map(s => ({ slug: s.slug, label: s.label, count: s.items.length }))} />}
      </CatalogHero>
      <div className="bg-stone-50">
        <div className="container mx-auto px-6 py-6">
          {subs.length > 1
            ? subs.map(s => <Group key={s.slug} id={s.slug} title={s.label} items={s.items} to={typePath(type, s.slug)} />)
            : <div className="py-8"><FamilyBrowser items={items} group={{ key: 'specialties', title: 'Specialty', options: specialtyOptions(catalog) }} /></div>}
        </div>
      </div>
    </>
  );
});

// /products/type/:type/:subtype
export const SubtypePage = withCatalog(({ catalog }) => {
  const { type = '', subtype = '' } = useParams();
  const typeLabel = catalog.labels.types[type];
  const label = catalog.labels.subtypes[type]?.[subtype];
  if (!typeLabel || !label) return <Navigate to={typeLabel ? typePath(type) : '/products'} replace />;
  const items = catalog.families.filter(f => f.type === type && f.subtype === subtype);
  return (
    <>
      <SEO title={`${label} | Surgical Instruments`} description={`${items.length} ${label.toLowerCase()} from Smith Instruments. Filter by specialty, shape and length, with every size and SKU listed.`} />
      <CatalogHero
        crumbs={[{ to: '/products', label: 'Products' }, { to: typePath(type), label: typeLabel }, { to: typePath(type, subtype), label }]}
        title={label}
        lead={`${items.length} instruments, each with every size and SKU listed.`}
      />
      <div className="bg-stone-50">
        <div className="container mx-auto px-6 py-10">
          <FamilyBrowser items={items} group={{ key: 'specialties', title: 'Specialty', options: specialtyOptions(catalog) }} />
        </div>
      </div>
    </>
  );
});

// /products/specialty/:specialty
export const SpecialtyPage = withCatalog(({ catalog }) => {
  const { specialty = '' } = useParams();
  const label = catalog.labels.specialties[specialty];
  if (!label) return <Navigate to={legacyTarget(['specialty', specialty])} replace />;
  const items = catalog.families.filter(f => f.specialties.includes(specialty));
  const groups = Object.entries(catalog.labels.types)
    .map(([slug, l]) => ({ slug, label: l, items: items.filter(f => f.type === slug) }))
    .filter(g => g.items.length)
    .sort((a, b) => (a.slug === 'other' ? 1 : b.slug === 'other' ? -1 : b.items.length - a.items.length));
  return (
    <>
      <SEO title={`${label} Instruments`} description={`${items.length} ${label.toLowerCase()} instruments from Smith Instruments, grouped by instrument type.`} />
      <CatalogHero
        crumbs={[{ to: '/products', label: 'Products' }, { to: specialtyPath(specialty), label }]}
        title={`${label} instruments`}
        lead={`${items.length} instruments used in this specialty, grouped by instrument type.`}
      >
        {groups.length > 1 && <Jump items={groups.map(g => ({ slug: g.slug, label: g.label, count: g.items.length }))} />}
      </CatalogHero>
      <div className="bg-stone-50">
        <div className="container mx-auto px-6 py-6">
          {groups.map(g => <Group key={g.slug} id={g.slug} title={g.label} items={g.items} to={specialtyPath(specialty, g.slug)} />)}
        </div>
      </div>
    </>
  );
});

// /products/specialty/:specialty/:type
export const SpecialtyTypePage = withCatalog(({ catalog }) => {
  const { specialty = '', type = '' } = useParams();
  const specLabel = catalog.labels.specialties[specialty];
  const typeLabel = catalog.labels.types[type];
  if (!specLabel || !typeLabel) return <Navigate to={specLabel ? specialtyPath(specialty) : legacyTarget(['specialty', specialty, type])} replace />;
  const items = catalog.families.filter(f => f.specialties.includes(specialty) && f.type === type);
  const options = (catalog.labels.subtypeOrder[type] ?? []).map(slug => ({ slug, label: catalog.labels.subtypes[type][slug] }));
  return (
    <>
      <SEO title={`${typeLabel}: ${specLabel}`} description={`${items.length} ${typeLabel.toLowerCase()} for ${specLabel.toLowerCase()} from Smith Instruments.`} />
      <CatalogHero
        crumbs={[{ to: '/products', label: 'Products' }, { to: specialtyPath(specialty), label: specLabel }, { to: specialtyPath(specialty, type), label: typeLabel }]}
        title={typeLabel}
        lead={`${specLabel}. ${items.length} instruments.`}
      />
      <div className="bg-stone-50">
        <div className="container mx-auto px-6 py-10">
          <FamilyBrowser items={items} group={{ key: 'subtype', title: 'Category', options }} />
        </div>
      </div>
    </>
  );
});
