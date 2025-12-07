import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Section, FadeIn, Button } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { ProductGridSkeleton } from '../../components/ui/Skeleton';
import { useProductsBySubcategory } from '../../lib/queries';
import { ChevronRight, Package, Grid, LayoutGrid } from 'lucide-react';

export const SubcategoryView: React.FC = () => {
    const { categoryName, subcategoryName } = useParams<{ categoryName: string; subcategoryName: string }>();
    const navigate = useNavigate();

    const category = decodeURIComponent(categoryName || '');
    const subcategory = decodeURIComponent(subcategoryName || '');

    const [displayCount, setDisplayCount] = useState(24);
    const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

    const { data: products = [], isLoading: loading } = useProductsBySubcategory(category, subcategory);

    const loadMore = () => {
        setDisplayCount(prev => prev + 24);
    };

    const visibleProducts = products.slice(0, displayCount);
    const hasMore = displayCount < products.length;

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${subcategory} - ${category}`}
                description={`Browse our range of ${subcategory} for ${category}.`}
            />

            <div className="bg-brand-charcoal text-white py-16 md:py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest flex-wrap">
                        <Link to="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={12} />
                        <Link to={`/products/${encodeURIComponent(category)}`} className="hover:text-white">{category}</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-gold">{subcategory}</span>
                    </div>

                    <h1 className="font-serif text-4xl md:text-6xl mb-4">{subcategory}</h1>
                    <p className="text-stone-400 font-light max-w-2xl text-lg">
                        {!loading && <>{products.length} precision instruments available</>}
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-gold blur-[150px] rounded-full"></div>
                </div>
            </div>

            <Section className="bg-stone-50">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <ProductGridSkeleton count={12} />
                    ) : products.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                                <p className="text-stone-500">
                                    Showing {Math.min(displayCount, products.length)} of {products.length}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-gold text-white' : 'bg-white text-stone-500 hover:bg-stone-100'}`}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('compact')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'compact' ? 'bg-brand-gold text-white' : 'bg-white text-stone-500 hover:bg-stone-100'}`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'}`}>
                                {visibleProducts.map((product, idx) => (
                                    <FadeIn key={product.sku} delay={Math.min(idx * 0.02, 0.5)}>
                                        <div
                                            onClick={() => navigate(`/product/${encodeURIComponent(product.sku)}`)}
                                            className="group cursor-pointer bg-white border border-stone-100 hover:border-stone-200 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className={`bg-stone-50 relative overflow-hidden ${viewMode === 'grid' ? 'aspect-square' : 'aspect-square'}`}>
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="text-stone-300" size={viewMode === 'grid' ? 48 : 32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`${viewMode === 'grid' ? 'p-4' : 'p-3'}`}>
                                                <p className={`text-brand-gold font-mono mb-1 ${viewMode === 'grid' ? 'text-xs' : 'text-[10px]'}`}>{product.sku}</p>
                                                <h3 className={`font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors ${viewMode === 'grid' ? 'text-sm line-clamp-2' : 'text-xs line-clamp-1'}`}>
                                                    {product.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="text-center mt-12">
                                    <Button variant="outline" onClick={loadMore}>
                                        Load More ({products.length - displayCount} remaining)
                                    </Button>
                                </div>
                            )}
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
