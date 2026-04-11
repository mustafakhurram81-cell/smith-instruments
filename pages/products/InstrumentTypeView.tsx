import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Section, FadeIn, Pagination } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { ProductCard } from '../../components/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { getProductsByInstrumentNew } from '../../lib/database';
import { ChevronRight, Package } from 'lucide-react';

const PAGE_SIZE = 24;

export const InstrumentTypeView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const instrumentType = searchParams.get('type') || '';
    const [currentPage, setCurrentPage] = useState(1);

    // Use the proper server-side RPC instead of full-table scan
    const { data: result, isLoading, error } = useQuery({
        queryKey: ['productsByInstrumentType', instrumentType, currentPage],
        queryFn: () => getProductsByInstrumentNew(instrumentType, undefined, currentPage, PAGE_SIZE),
        enabled: !!instrumentType,
        staleTime: 1000 * 60 * 5,
    });

    const products = result?.data ?? [];
    const totalCount = result?.count ?? 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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
            <div className="bg-brand-charcoal text-white py-12 md:py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest">
                        <Link to="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-orange">{instrumentType}</span>
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl mb-4">{instrumentType}</h1>
                    <p className="text-stone-400 font-light max-w-2xl text-lg">
                        {!isLoading && <>{totalCount} instruments</>}
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-orange blur-[150px] rounded-full"></div>
                </div>
            </div>

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
                            <p className="text-sm text-stone-500 mb-6">{totalCount} instruments</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {products.map((product, idx) => (
                                    <FadeIn key={product.id} delay={Math.min(idx * 0.02, 0.2)}>
                                        <ProductCard product={product} viewMode="grid" />
                                    </FadeIn>
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </Section>
        </div>
    );
};
