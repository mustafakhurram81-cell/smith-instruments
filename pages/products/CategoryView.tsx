import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Section, FadeIn, Button } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { CategoryGridSkeleton, ProductGridSkeleton } from '../../components/ui/Skeleton';
import { useSubcategories, useProductsByCategory } from '../../lib/queries';
import { ChevronRight, Package, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

// Get one image per subcategory
async function getSubcategoryImages(category: string, subcategories: string[]): Promise<Record<string, string>> {
    const images: Record<string, string> = {};

    await Promise.all(subcategories.map(async (sub) => {
        const { data } = await supabase
            .from('products')
            .select('image_url')
            .eq('category', category)
            .eq('subcategory', sub)
            .neq('image_url', '')
            .limit(1);

        if (data?.[0]?.image_url) {
            images[sub] = data[0].image_url;
        }
    }));

    return images;
}

export const CategoryView: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const navigate = useNavigate();
    const category = decodeURIComponent(categoryName || '');

    const [displayCount, setDisplayCount] = useState(20);

    const { data: subcategories = [], isLoading: subsLoading } = useSubcategories(category);
    const { data: products = [], isLoading: productsLoading } = useProductsByCategory(category);

    const { data: subcategoryImages = {} } = useQuery({
        queryKey: ['subcategoryImages', category],
        queryFn: () => getSubcategoryImages(category, subcategories),
        enabled: subcategories.length > 0,
        staleTime: 1000 * 60 * 10,
    });

    const loading = subsLoading || productsLoading;

    const subcategoryCounts: Record<string, number> = {};
    products.forEach(p => {
        subcategoryCounts[p.subcategory] = (subcategoryCounts[p.subcategory] || 0) + 1;
    });

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
            <div className="bg-brand-charcoal text-white py-16 md:py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest">
                        <Link to="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-gold">{category}</span>
                    </div>

                    <h1 className="font-serif text-4xl md:text-6xl mb-4">{category}</h1>
                    <p className="text-stone-400 font-light max-w-2xl text-lg">
                        {!loading && (
                            <>{products.length} instruments across {subcategories.length} subcategories</>
                        )}
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-gold blur-[150px] rounded-full"></div>
                </div>
            </div>

            <Section className="bg-stone-50">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <CategoryGridSkeleton count={6} />
                    ) : subcategories.length > 0 ? (
                        <>
                            <h2 className="text-2xl font-serif text-brand-charcoal mb-8">Subcategories</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subcategories.map((sub, idx) => (
                                    <FadeIn key={sub} delay={idx * 0.05}>
                                        <div
                                            onClick={() => navigate(`/products/${encodeURIComponent(category)}/${encodeURIComponent(sub)}`)}
                                            className="group cursor-pointer relative h-64 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                        >
                                            <div className="absolute inset-0 bg-stone-200">
                                                {subcategoryImages[sub] ? (
                                                    <img
                                                        src={subcategoryImages[sub]}
                                                        alt={sub}
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
                                                            {sub}
                                                        </h3>
                                                        <p className="text-stone-300 text-sm">
                                                            {subcategoryCounts[sub] || 0} instruments
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
                                    <FadeIn key={product.sku} delay={idx * 0.02}>
                                        <div
                                            onClick={() => navigate(`/product/${product.sku}`)}
                                            className="group cursor-pointer bg-white border border-stone-100 hover:border-stone-200 hover:shadow-md transition-all"
                                        >
                                            <div className="aspect-square bg-stone-50 relative overflow-hidden">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="text-stone-300" size={48} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <p className="text-xs text-brand-gold font-mono mb-1">{product.sku}</p>
                                                <h3 className="text-sm font-medium text-brand-charcoal line-clamp-2 group-hover:text-brand-gold transition-colors">{product.name}</h3>
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
                    )}
                </div>
            </Section>
        </div>
    );
};
