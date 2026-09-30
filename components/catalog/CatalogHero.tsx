import React from 'react';
import { Link } from 'react-router-dom';

export const CatalogHero: React.FC<{
  crumbs: { to: string; label: string }[];
  title: string;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ crumbs, title, lead, children }) => (
  <header className="bg-brand-charcoal text-white pt-28 pb-12 md:pt-32 md:pb-14">
    <div className="container mx-auto px-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-stone-400">
          {crumbs.map((c, i) => (
            <li key={c.to} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === crumbs.length - 1
                ? <span className="text-brand-orange font-bold">{c.label}</span>
                : <Link to={c.to} className="hover:text-white transition-colors">{c.label}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl leading-tight max-w-3xl">{title}</h1>
          {lead && <p className="mt-3 text-stone-300 text-lg font-light">{lead}</p>}
        </div>
        {children}
      </div>
    </div>
  </header>
);
