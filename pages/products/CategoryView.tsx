import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Section, FadeIn, Button } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { CategoryGridSkeleton, ProductGridSkeleton } from '../../components/ui/Skeleton';
import { useSubcategoryDetails, useProductsByCategory } from '../../lib/queries';
import { ChevronRight, Package, ArrowRight } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';

export const CategoryView: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const navigate = useNavigate();
    const category = decodeURIComponent(categoryName || '');

    const [displayCount, setDisplayCount] = useState(20);

    // Use the new hook that includes counts and images
    const { data: subcategoryDetails = [], isLoading: subsLoading } = useSubcategoryDetails(category);
    const { data: products = [], isLoading: productsLoading } = useProductsByCategory(category);

    const loading = subsLoading || productsLoading;

    // Calculate total from subcategory details for accurate count
    const totalProducts = subcategoryDetails.reduce((acc, sub) => acc + sub.count, 0);

    const loadMore = () => {
        setDisplayCount(prev => prev + 20);
    };

    const visibleProducts = products.slice(0, displayCount);
    const hasMore = displayCount < products.length;

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${category} Instruments`}
                description={`Browse ${category} subcategories and instruments.`}
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-12 md:py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest">
                        <Link to="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-gold">{category}</span>
                    </div>

                    <h1 className="font-serif text-4xl md:text-6xl mb-4">{category}</h1>
                    <p className="text-stone-400 font-light max-w-2xl text-lg">
                        {!loading && (
                            <>{totalProducts} instruments across {subcategoryDetails.length} subcategories</>
                        )}
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-gold blur-[150px] rounded-full"></div>
                </div>
            </div>

            <Section className="bg-stone-50 !py-12">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <CategoryGridSkeleton count={6} />
                    ) : subcategoryDetails.length > 0 ? (
                        <>
                            <h2 className="text-2xl font-serif text-brand-charcoal mb-8">Subcategories</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subcategoryDetails.map((sub, idx) => (
                                    <FadeIn key={sub.name} delay={idx * 0.05}>
                                        <div
                                            onClick={() => navigate(`/products/${encodeURIComponent(category)}/${encodeURIComponent(sub.name)}`)}
                                            className="group cursor-pointer relative h-64 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                        >
                                            <div className="absolute inset-0 bg-stone-200">
                                                {sub.image ? (
                                                    <img
                                                        src={sub.image}
                                                        alt={sub.name}
                                                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                                                        <Package className="text-stone-400" size={48} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                            <div className="absolute bottom-0 left-0 w-full p-6">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h3 className="font-serif text-2xl text-white mb-1 group-hover:text-brand-gold transition-colors">
                                                            {sub.name}
                                                        </h3>
                                                        <p className="text-stone-300 text-sm">
                                                            {sub.count} instruments
                                                        </p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-brand-gold group-hover:text-brand-charcoal transition-all">
                                                        <ArrowRight size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-serif text-brand-charcoal">
                                    All Products ({products.length})
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {visibleProducts.map((product, idx) => (
                                    <ProductCard
                                        key={product.sku}
                                        product={product}
                                        viewMode="grid"
                                        index={idx}
                                    />
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
                    )}
                </div>
            </Section>
        </div>
    );
};
