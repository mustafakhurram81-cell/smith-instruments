import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Loader2, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchProducts } from '../lib/database';
import type { Product } from '../types';
import { DEBOUNCE_MS, PAGE_SIZE } from '../constants';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        const doSearch = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const found = await searchProducts(query);
                setResults(found);
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };

        const timeout = setTimeout(doSearch, DEBOUNCE_MS.SEARCH);
        return () => clearTimeout(timeout);
    }, [query]);

    const handleSelect = (sku: string) => {
        navigate(`/product/${encodeURIComponent(sku)}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="bg-white w-full max-w-3xl mx-auto mt-20 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-stone-100 flex items-center gap-4">
                            <SearchIcon className="text-stone-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search for instruments (e.g., 'Iris Scissors', '10-105-02')..."
                                className="flex-1 text-lg outline-none text-brand-charcoal placeholder-stone-300 font-serif"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                                <X className="text-stone-400" size={20} />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-4">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-brand-gold" />
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid gap-2">
                                    {results.map(prod => (
                                        <div
                                            key={prod.id}
                                            onClick={() => handleSelect(prod.sku)}
                                            className="flex items-center gap-4 p-3 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors group"
                                        >
                                            <div className="w-12 h-12 bg-stone-200 rounded-md overflow-hidden flex-shrink-0 border border-stone-200">
                                                {prod.image_url ? (
                                                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">IMG</div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors">{prod.name}</h4>
                                                <p className="text-xs text-stone-500 font-mono">{prod.sku}</p>
                                            </div>
                                            <ArrowRight className="ml-auto text-stone-300 group-hover:text-brand-gold opacity-0 group-hover:opacity-100 transition-all" size={16} />
                                        </div>
                                    ))}
                                </div>
                            ) : query.length > 1 ? (
                                <div className="text-center py-8 text-stone-400">
                                    No products found for "{query}"
                                </div>
                            ) : (
                                <div className="text-center py-12 text-stone-300">
                                    Type to search our catalog...
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
