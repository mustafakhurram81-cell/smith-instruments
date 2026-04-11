import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Section, Button, Pagination } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { ProductGridSkeleton } from '../../components/ui/Skeleton';
import { useProductsBySubcategory } from '../../lib/queries';
import { ChevronRight, Package, Grid, LayoutGrid, Search, X } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';

export const SubcategoryView: React.FC = () => {
    const { categoryName, subcategoryName } = useParams<{ categoryName: string; subcategoryName: string }>();
    const navigate = useNavigate();

    const category = decodeURIComponent(categoryName || '');
    const subcategory = decodeURIComponent(subcategoryName || '');

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 24;
    const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
    const [searchTerm, setSearchTerm] = useState('');

    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search term to prevent hammering the database on every keystroke
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset pagination when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    // Perform the server-side paginated request (with search)
    const { data: productsResult, isLoading: loading } = useProductsBySubcategory(
        category, 
        subcategory, 
        currentPage, 
        ITEMS_PER_PAGE, 
        debouncedSearch
    );

    const visibleProducts = productsResult?.data ?? [];
    const totalCount = productsResult?.count ?? 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${subcategory} - ${category}`}
                description={`Browse our range of ${subcategory} for ${category}.`}
            />

            <div className="bg-brand-charcoal text-white py-12 md:py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest flex-wrap">
                        <Link to="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={12} />
                        <Link to={`/products/${encodeURIComponent(category)}`} className="hover:text-white">{category}</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-orange">{subcategory}</span>
                    </div>

                    <h1 className="font-serif text-4xl md:text-6xl mb-4">{subcategory}</h1>
                    <p className="text-stone-400 font-light max-w-2xl text-lg">
                        {!loading && <>{totalCount} precision instruments available</>}
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-orange blur-[150px] rounded-full"></div>
                </div>
            </div>

            <Section className="bg-stone-50 !py-12">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <ProductGridSkeleton count={12} />
                    ) : visibleProducts.length > 0 ? (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-20 z-30 bg-stone-50/95 backdrop-blur-sm p-4 rounded-xl border border-stone-100 shadow-sm">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search instruments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2 rounded-lg border border-stone-200 outline-none focus:!border-stone-400 focus:!ring-0 bg-white"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <p className="text-stone-500 text-sm">
                                        Showing {visibleProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-orange text-white' : 'bg-white text-stone-500 hover:bg-stone-100'}`}
                                        >
                                            <Grid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('compact')}
                                            className={`p-2 rounded-lg transition-colors ${viewMode === 'compact' ? 'bg-brand-orange text-white' : 'bg-white text-stone-500 hover:bg-stone-100'}`}
                                        >
                                            <LayoutGrid size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'}`}>
                                {visibleProducts.map((product, idx) => (
                                    <ProductCard
                                        key={product.sku}
                                        product={product}
                                        viewMode={viewMode}
                                        index={idx}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <Package className="mx-auto text-stone-300 mb-4" size={64} />
                            <h3 className="text-xl font-serif text-brand-charcoal mb-2">No products found</h3>
                            <p className="text-stone-500 mb-6">We are adding products to this category soon.</p>
                            <Button variant="primary" onClick={() => navigate(`/products/${encodeURIComponent(category)}`)}>
                                Back to {category}
                            </Button>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
};
