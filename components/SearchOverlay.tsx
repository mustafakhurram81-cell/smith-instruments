import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Loader2, ArrowRight, X, TrendingUp, Scissors, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchProducts } from '../lib/queries';
import type { Product } from '../types';
import { DEBOUNCE_MS, PAGE_SIZE } from '../constants';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
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
        const timeout = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, DEBOUNCE_MS.SEARCH);
        return () => clearTimeout(timeout);
    }, [query]);

    // React Query hook replaces old state
    const { data: results = [], isLoading: loading } = useSearchProducts(debouncedQuery);

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
                                className="flex-1 text-lg outline-none text-brand-charcoal placeholder-stone-300 font-heading"
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
                                    <Loader2 className="animate-spin text-brand-orange" />
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid gap-2">
                                    {results.map(prod => (
                                        <div
                                            key={prod.id}
                                            onClick={() => handleSelect(prod.sku)}
                                            className="flex items-center gap-4 p-3 hover:bg-stone-50 border-b border-stone-50 last:border-0 cursor-pointer transition-colors group"
                                        >
                                            <div className="w-12 h-12 bg-stone-200 rounded-md overflow-hidden flex-shrink-0 border border-stone-200">
                                                {prod.image_url ? (
                                                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">IMG</div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-brand-charcoal group-hover:text-brand-orange transition-colors">{prod.name}</h4>
                                                <p className="text-xs text-stone-500 font-mono">{prod.sku}</p>
                                            </div>
                                            <ArrowRight className="ml-auto text-gray-300 group-hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-all" size={16} />
                                        </div>
                                    ))}
                                </div>
                            ) : query.length > 1 ? (
                                <div className="text-center py-8 text-stone-400">
                                    No products found for "{query}"
                                </div>
                            ) : (
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
                                        <TrendingUp size={14} className="text-brand-orange" /> Quick Links
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <button onClick={() => { setQuery("Scissors"); inputRef.current?.focus(); }} className="flex items-center gap-2 p-3 bg-stone-50 hover:bg-white hover:shadow-md border border-stone-100 rounded-lg transition-all text-left group">
                                            <Scissors size={18} className="text-stone-400 group-hover:text-brand-orange" />
                                            <span className="text-sm font-medium text-brand-charcoal">Scissors</span>
                                        </button>
                                        <button onClick={() => { setQuery("Forceps"); inputRef.current?.focus(); }} className="flex items-center gap-2 p-3 bg-stone-50 hover:bg-white hover:shadow-md border border-stone-100 rounded-lg transition-all text-left group">
                                            <Stethoscope size={18} className="text-stone-400 group-hover:text-brand-orange" />
                                            <span className="text-sm font-medium text-brand-charcoal">Forceps</span>
                                        </button>
                                        <button onClick={() => { setQuery("Retractor"); inputRef.current?.focus(); }} className="flex items-center gap-2 p-3 bg-stone-50 hover:bg-white hover:shadow-md border border-stone-100 rounded-lg transition-all text-left group">
                                            <SearchIcon size={18} className="text-stone-400 group-hover:text-brand-orange" />
                                            <span className="text-sm font-medium text-brand-charcoal">Retractors</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
