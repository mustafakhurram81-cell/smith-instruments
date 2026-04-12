import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Loader2 } from 'lucide-react';
import { FadeIn } from './Shared';
import { LazyImage } from './ui/LazyImage';

interface Product {
    id: string;
    sku: string;
    name: string;
    image_url?: string;
}

interface ProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'compact';
    index?: number;
    onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    viewMode = 'grid',
    index = 0,
    onClick
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/product/${encodeURIComponent(product.sku)}`);
        }
    };

    const isCompact = viewMode === 'compact';

    return (
        <div
            onClick={handleClick}
            className="group cursor-pointer h-full bg-white border border-stone-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col"
        >
            <div className={`bg-stone-50 relative overflow-hidden flex items-center justify-center p-6 ${isCompact ? 'aspect-video' : 'aspect-square'}`}>

                {product.image_url ? (
                    <LazyImage
                        src={product.image_url}
                        alt={product.name}
                        className="relative z-10 w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        containerClassName="w-full h-full"
                        placeholder={
                            <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="animate-spin text-stone-300" size={24} />
                            </div>
                        }
                    />
                ) : (
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <Package className="text-stone-300" size={isCompact ? 24 : 40} strokeWidth={1.5} />
                    </div>
                )}
            </div>

            <div className={`border-t border-stone-100 bg-white flex flex-col justify-between flex-grow ${isCompact ? 'p-3' : 'p-5'}`}>
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <span className={`font-mono text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded text-[10px] tracking-wide`}>
                            {product.sku}
                        </span>
                    </div>

                    <h3 className={`font-heading text-brand-charcoal group-hover:text-brand-orange transition-colors ${isCompact ? 'text-sm line-clamp-1' : 'text-lg leading-tight line-clamp-2'}`}>
                        {product.name}
                    </h3>
                </div>

                {!isCompact && (
                    <div className="mt-4 pt-3 border-t border-stone-50 flex items-center justify-between text-xs text-stone-400">
                        <span>Medical Grade Steel</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300 text-brand-orange font-bold">View Details →</span>
                    </div>
                )}
            </div>
        </div>
    );
};
