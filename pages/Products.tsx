import React, { useState, useMemo, useEffect } from 'react';
import { Section, Button, FadeIn } from '../components/Shared';
import { useNavigate, useLocation } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Search, Filter, ChevronDown, ChevronRight, ChevronLeft, ShoppingCart, X, Check, MessageCircle } from 'lucide-react';
import { PRODUCTS_DATA, CATEGORIES, Product } from '../data/products';
import { AnimatePresence, motion } from 'framer-motion';

export const Products: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const ITEMS_PER_PAGE = 9;

    // Initial load: Check if category passed via navigation state or query param
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return PRODUCTS_DATA.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
            const matchesSubcategory = selectedSubcategory ? product.subcategory === selectedSubcategory : true;

            return matchesSearch && matchesCategory && matchesSubcategory;
        });
    }, [searchQuery, selectedCategory, selectedSubcategory]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handlers
    const handleCategorySelect = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
        } else {
            setSelectedCategory(category);
            setSelectedSubcategory(null);
        }
        setCurrentPage(1);
    };

    const handleSubcategorySelect = (sub: string) => {
        setSelectedSubcategory(selectedSubcategory === sub ? null : sub);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setCurrentPage(1);
    };

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title="Surgical Instruments Store"
                description="Browse thousands of high-quality surgical instruments. Search by SKU, category, or profession."
                keywords="surgical instruments store, buy surgical tools, medical equipment catalogue"
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-12 md:py-16 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="font-serif text-3xl md:text-5xl mb-4">Product Catalogue</h1>
                    <p className="text-stone-400 font-light max-w-2xl">
                        Explore our extensive range of precision instruments. Use the filters to find exactly what you need by code, name, or specialty.
                    </p>
                </div>
                {/* Abstract Background Pattern */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-800 to-transparent opacity-50 pointer-events-none"></div>
            </div>

            <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">

                {/* SIDEBAR FILTERS (Desktop) */}
                <aside className="hidden lg:block w-64 shrink-0 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-xl text-brand-charcoal">Categories</h3>
                            {(selectedCategory || selectedSubcategory) && (
                                <button onClick={clearFilters} className="text-xs text-brand-gold hover:underline">Reset</button>
                            )}
                        </div>

                        <div className="space-y-2">
                            {CATEGORIES.map((cat) => (
                                <div key={cat.name} className="border-b border-stone-200 last:border-0 pb-2">
                                    <button
                                        onClick={() => handleCategorySelect(cat.name)}
                                        className={`w-full flex items-center justify-between py-2 text-left transition-colors ${selectedCategory === cat.name ? 'text-brand-gold font-bold' : 'text-stone-600 hover:text-brand-charcoal'}`}
                                    >
                                        <span>{cat.name}</span>
                                        <ChevronDown size={14} className={`transform transition-transform ${selectedCategory === cat.name ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Subcategories Accordion */}
                                    <AnimatePresence>
                                        {selectedCategory === cat.name && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden pl-4"
                                            >
                                                <ul className="space-y-1 py-2">
                                                    {cat.subcategories.map(sub => (
                                                        <li key={sub}>
                                                            <button
                                                                onClick={() => handleSubcategorySelect(sub)}
                                                                className={`text-sm py-1 block w-full text-left transition-colors ${selectedSubcategory === sub ? 'text-brand-charcoal font-medium' : 'text-stone-400 hover:text-stone-600'}`}
                                                            >
                                                                {sub}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* MOBILE FILTERS TOGGLE */}
                <div className="lg:hidden">
                    <Button variant="outline" className="w-full flex justify-between" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
                        <span>Filters {selectedCategory ? `(${selectedCategory})` : ''}</span>
                        <Filter size={18} />
                    </Button>

                    <AnimatePresence>
                        {isMobileFiltersOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-white border border-stone-200 rounded-sm mt-4 p-4 shadow-lg"
                            >
                                {/* Mobile Filter Content (Simplified duplicate of sidebar) */}
                                <div className="space-y-2">
                                    {CATEGORIES.map((cat) => (
                                        <div key={cat.name}>
                                            <button
                                                onClick={() => handleCategorySelect(cat.name)}
                                                className={`w-full flex items-center justify-between py-2 text-left ${selectedCategory === cat.name ? 'text-brand-gold font-bold' : 'text-stone-600'}`}
                                            >
                                                {cat.name}
                                            </button>
                                            {selectedCategory === cat.name && (
                                                <div className="pl-4 pb-2 border-l-2 border-stone-100 ml-2">
                                                    {cat.subcategories.map(sub => (
                                                        <button
                                                            key={sub}
                                                            onClick={() => handleSubcategorySelect(sub)}
                                                            className={`text-sm py-1 block w-full text-left ${selectedSubcategory === sub ? 'text-brand-charcoal font-medium' : 'text-stone-400'}`}
                                                        >
                                                            {sub}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-grow">

                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-sm shadow-sm border border-stone-100 mb-8 flex items-center gap-4">
                        <Search className="text-stone-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Instrument Name, SKU (e.g., SI-100-01), or Description..."
                            className="flex-grow outline-none text-brand-charcoal placeholder-stone-400"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-brand-charcoal">
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Results Info */}
                    <div className="flex justify-between items-center mb-6 text-sm text-stone-500">
                        <p>Showing <span className="font-bold text-brand-charcoal">{filteredProducts.length}</span> products</p>
                        <div className="flex items-center gap-2">
                            <span>Sort by:</span>
                            <select className="bg-transparent border-none outline-none font-medium text-brand-charcoal cursor-pointer">
                                <option>Relevance</option>
                                <option>Name (A-Z)</option>
                                <option>SKU (Asc)</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {currentProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {currentProducts.map((product) => (
                                <FadeIn key={product.id}>
                                    <div className="bg-white border border-stone-100 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
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
                                            <div className="mb-1 text-xs font-bold text-brand-gold uppercase tracking-wider">{product.category}</div>
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
                                                onClick={() => window.open(`https://wa.me/923302449855?text=Hi, I am interested in ${product.name} (SKU: ${product.sku})`, '_blank')}
                                            >
                                                <MessageCircle size={14} /> Request Quote
                                            </Button>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border border-stone-100 rounded-sm">
                            <Search size={48} className="text-stone-200 mx-auto mb-4" />
                            <h3 className="text-xl font-serif text-brand-charcoal mb-2">No products found</h3>
                            <p className="text-stone-500 mb-6">Try adjusting your search or filters.</p>
                            <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="w-10 h-10 flex items-center justify-center border border-stone-200 rounded-sm hover:bg-brand-charcoal hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-stone-400 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 flex items-center justify-center border rounded-sm transition-colors ${currentPage === page
                                            ? 'bg-brand-charcoal text-brand-gold border-brand-charcoal'
                                            : 'border-stone-200 hover:bg-stone-100 text-stone-600'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="w-10 h-10 flex items-center justify-center border border-stone-200 rounded-sm hover:bg-brand-charcoal hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-stone-400 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
