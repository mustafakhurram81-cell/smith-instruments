import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from './Shared';
import { Product } from '../data/products';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    return (
        <div
            className="bg-white border border-stone-100 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer"
            onClick={onClick}
        >
            {/* Image */}
            <div className="h-48 overflow-hidden relative bg-stone-50 border-b border-stone-50">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold tracking-widest text-brand-charcoal border border-stone-200 rounded-sm">
                    {product.sku}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-1 text-xs font-bold text-brand-gold uppercase tracking-wider">{product.category.replace('-', ' ')}</div>
                <h3 className="font-serif text-lg text-brand-charcoal leading-tight mb-2 group-hover:text-brand-gold transition-colors">{product.name}</h3>
                <p className="text-stone-500 text-xs line-clamp-2 mb-4 flex-grow">{product.description}</p>

                {/* Specs Mini-Table */}
                <div className="bg-stone-50 p-3 rounded-sm text-xs text-stone-600 space-y-1 mb-4">
                    <div className="flex justify-between">
                        <span className="text-stone-400">Material:</span>
                        <span>{product.specifications.material}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-400">Finish:</span>
                        <span>{product.specifications.finish}</span>
                    </div>
                </div>

                <Button
                    variant="primary"
                    className="w-full text-xs py-2 gap-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/923302449855?text=Hi, I am interested in ${product.name} (SKU: ${product.sku})`, '_blank');
                    }}
                >
                    <MessageCircle size={14} /> Request Quote
                </Button>
            </div>
        </div>
    );
};
