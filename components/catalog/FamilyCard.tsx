import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { productPath, sizeSummary, type Family } from '../../lib/catalog';

// One card per instrument; its sizes live inside the product page.
export const FamilyCard: React.FC<{ family: Family }> = ({ family }) => {
  const size = sizeSummary(family);
  return (
    <Link
      to={productPath(family)}
      className="group h-full bg-white border border-stone-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col"
    >
      <div className="bg-stone-50 aspect-square p-5 flex items-center justify-center">
        {family.image ? (
          <img src={family.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <Package className="text-stone-300" size={40} strokeWidth={1.5} />
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="self-start font-mono text-[11px] text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">{family.code}</span>
        <h3 className="font-heading text-[15px] leading-snug text-brand-charcoal group-hover:text-brand-orange transition-colors line-clamp-3">{family.name}</h3>
        <div className="mt-auto pt-3 border-t border-stone-100">
          {size.range ? (
            <div className="text-brand-orange">
              <div className="relative h-2" aria-hidden="true">
                <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
                <span className="absolute left-0 top-0 bottom-0 w-px bg-current" />
                <span className="absolute right-0 top-0 bottom-0 w-px bg-current" />
              </div>
              <div className="mt-1.5 flex justify-between font-mono text-[11px] text-stone-500">
                <span>{size.range[0]}</span><span>{size.label}</span><span>{size.range[1]}</span>
              </div>
            </div>
          ) : (
            <p className="font-mono text-[11px] text-stone-500">{size.label}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
