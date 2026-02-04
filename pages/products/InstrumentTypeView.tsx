import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Section, FadeIn, ParallaxHeader } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { ProductCard } from '../../components/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Product } from '../../lib/database';
import { ChevronRight, Package } from 'lucide-react';

// Fetch products by subcategory (instrument type) across all categories
async function getProductsByInstrumentType(subcategory: string): Promise<Product[]> {
    const PAGE_SIZE = 1000;
    let allProducts: Product[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('subcategory', subcategory)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error('Error fetching products by instrument type:', error);
            break;
        }

        if (data && data.length > 0) {
            allProducts = [...allProducts, ...data];
            from += PAGE_SIZE;
            hasMore = data.length === PAGE_SIZE;
        } else {
            hasMore = false;
        }
    }

    return allProducts;
}

export const InstrumentTypeView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const instrumentType = searchParams.get('type') || '';

    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ['productsByInstrumentType', instrumentType],
        queryFn: () => getProductsByInstrumentType(instrumentType),
        enabled: !!instrumentType,
        staleTime: 1000 * 60 * 5,
    });

    if (!instrumentType) {
        return (
            <div className="pt-32 min-h-screen flex items-center justify-center">
                <p className="text-stone-500">No instrument type specified.</p>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${instrumentType} - Surgical Instruments`}
                description={`Browse our collection of ${instrumentType.toLowerCase()} surgical instruments.`}
            />

            {/* Header */}
            <ParallaxHeader
                title={instrumentType}
                description={!isLoading ? `${products.length} instruments` : undefined}
                image="/images/headers/products-header.png"
                breadcrumbs={
                    <div className="flex items-center gap-2 text-brand-orange uppercase tracking-widest text-xs font-bold">
                        <Link to="/products" className="hover:underline">Products</Link>
                        <ChevronRight size={12} />
                        <span>{instrumentType}</span>
                    </div>
                }
            />

            <Section className="bg-stone-50 !py-12">
                <div className="container mx-auto px-6">
                    {isLoading ? (
                        <ProductGridSkeleton count={12} />
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            Failed to load products. Please try again later.
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <Package className="mx-auto text-stone-300 mb-4" size={48} />
                            <p className="text-stone-500">No products found in this category.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-stone-500 mb-6">{products.length} instruments</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {products.map((product, idx) => (
                                    <FadeIn key={product.id} delay={Math.min(idx * 0.02, 0.2)}>
                                        <ProductCard product={product} viewMode="grid" />
                                    </FadeIn>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </Section>
        </div>
    );
};
