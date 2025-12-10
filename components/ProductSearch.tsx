import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Package, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
    id: string;
    sku: string;
    name: string;
    category: string;
    subcategory: string;
    image_url: string | null;
}

interface ProductSearchProps {
    className?: string;
    placeholder?: string;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
    className = '',
    placeholder = 'Search products...'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search debounce
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('products')
                .select('id, sku, name, category, subcategory, image_url')
                .or(`name.ilike.%${query}%,sku.ilike.%${query}%,category.ilike.%${query}%`)
                .limit(8);

            if (!error && data) {
                setResults(data);
            }
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            navigateToProduct(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    const navigateToProduct = (product: SearchResult) => {
        setIsOpen(false);
        setQuery('');
        navigate(`/products/${product.category}/${product.subcategory}/${product.sku}`);
    };

    const handleViewAll = () => {
        setIsOpen(false);
        navigate(`/products?search=${encodeURIComponent(query)}`);
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-100 border border-stone-200 rounded-lg text-sm outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-200 rounded-full text-stone-400"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && query && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="p-6 text-center">
                            <Loader2 className="animate-spin mx-auto text-brand-gold" size={24} />
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-6 text-center text-stone-500">
                            <Package size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No products found for "{query}"</p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-stone-100">
                                {results.map((product, idx) => (
                                    <button
                                        key={product.id}
                                        onClick={() => navigateToProduct(product)}
                                        className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${idx === selectedIndex
                                                ? 'bg-brand-gold/10'
                                                : 'hover:bg-stone-50'
                                            }`}
                                    >
                                        <div className="w-12 h-12 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                    <Package size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-brand-gold font-mono">{product.sku}</div>
                                            <div className="font-medium text-brand-charcoal truncate">{product.name}</div>
                                            <div className="text-xs text-stone-400">
                                                {product.category} / {product.subcategory}
                                            </div>
                                        </div>
                                        <ArrowRight size={16} className="text-stone-300 flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                            {results.length >= 8 && (
                                <button
                                    onClick={handleViewAll}
                                    className="w-full p-3 text-center text-sm text-brand-gold hover:bg-brand-gold/5 border-t font-medium"
                                >
                                    View all results for "{query}" →
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
