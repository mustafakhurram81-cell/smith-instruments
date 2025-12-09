import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
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
        <FadeIn delay={Math.min(index * 0.02, 0.5)}>
            <div
                onClick={handleClick}
                className="group cursor-pointer bg-white border border-stone-100 hover:border-stone-200 hover:shadow-md transition-all duration-300"
            >
                <div className="bg-stone-50 relative overflow-hidden aspect-square">
                    {product.image_url ? (
                        <LazyImage
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            containerClassName="w-full h-full"
                            placeholder={
                                <div className="w-full h-full bg-stone-100 animate-pulse flex items-center justify-center">
                                    <Package className="text-stone-300" size={isCompact ? 32 : 48} />
                                </div>
                            }
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="text-stone-300" size={isCompact ? 32 : 48} />
                        </div>
                    )}
                </div>
                <div className={`border-t border-stone-100 ${isCompact ? 'p-3' : 'p-4'}`}>
                    <p className={`text-brand-gold font-mono mb-1 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
                        {product.sku}
                    </p>
                    <h3 className={`font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors ${isCompact ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'}`}>
                        {product.name}
                    </h3>
                </div>
            </div>
        </FadeIn>
    );
};
