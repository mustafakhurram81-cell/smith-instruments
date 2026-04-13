import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, FadeIn, ParallaxHeader } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { CategoryGridSkeleton } from '../../components/ui/Skeleton';
import { useSpecialtyCategories, useInstrumentCategoriesNew } from '../../lib/queries';
import { ArrowRight, Stethoscope, Scissors } from 'lucide-react';

type ViewMode = 'specialty' | 'instrument';

export const ProductsIndex: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>('specialty');

    // Use new dual navigation hooks
    const { data: specialtyCategories = [], isLoading: specialtiesLoading } = useSpecialtyCategories();
    const { data: instrumentCategories = [], isLoading: instrumentsLoading } = useInstrumentCategoriesNew();

    const isLoading = viewMode === 'specialty' ? specialtiesLoading : instrumentsLoading;
    const items = viewMode === 'specialty' ? specialtyCategories : instrumentCategories;
    const totalProducts = specialtyCategories.reduce((acc, c) => acc + c.count, 0);


    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title="Precision Instruments"
                description="A comprehensive range of instruments for every surgical specialty."
                keywords="surgical instruments catalog, medical tools by specialty, plastic surgery instruments, orthopedic surgical tools, cardiovascular instruments, neurosurgery tools, dental instruments, ophthalmology instruments"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "Precision Surgical Instruments Catalog",
                    "description": "A comprehensive range of instruments for every surgical specialty.",
                    "url": "https://smithinstruments.net/products"
                }}
                breadcrumbs={[
                    { name: 'Products', item: '/products' }
                ]}
            />

            {/* Header */}
            <ParallaxHeader
                title="Precision Instruments"
                description={!isLoading ? (
                    viewMode === 'specialty'
                        ? `${totalProducts} instruments across ${specialtyCategories.length} specialties`
                        : `${totalProducts} instruments across ${instrumentCategories.length} instrument types`
                ) : undefined}
                image="/images/headers/products-header.webp"
                breadcrumbs={
                    <span className="text-brand-orange uppercase tracking-widest text-xs font-bold block">
                        Our Catalog
                    </span>
                }
            />

            {/* View Mode Toggle - Premium Style */}
            <div className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-stone-600 text-sm">
                            How would you like to browse?
                        </p>
                        <div className="flex items-center bg-stone-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('specialty')}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md transition-all ${viewMode === 'specialty'
                                    ? 'bg-white text-brand-charcoal shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                                    }`}
                            >
                                <Stethoscope size={16} />
                                By Specialty
                            </button>
                            <button
                                onClick={() => setViewMode('instrument')}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md transition-all ${viewMode === 'instrument'
                                    ? 'bg-white text-brand-charcoal shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                                    }`}
                            >
                                <Scissors size={16} />
                                By Instrument Type
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            <Section className="bg-stone-50 !py-12">
                <div className="container mx-auto px-6">
                    {isLoading ? (
                        <CategoryGridSkeleton count={8} />
                    ) : items.length === 0 ? (
                        <div className="text-center py-10 text-stone-500">
                            No items found.
                        </div>
                    ) : (
                        <>
                            {/* Results count */}
                            <p className="text-sm text-stone-500 mb-6">
                                {viewMode === 'specialty'
                                    ? `${items.length} medical specialties`
                                    : `${items.length} instrument categories`
                                }
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map((item, idx) => (
                                    <FadeIn key={item.name} delay={Math.min(idx * 0.03, 0.3)}>
                                        <div
                                            onClick={() => {
                                                if (viewMode === 'specialty') {
                                                    navigate(`/products/specialty/${encodeURIComponent(item.name)}`);
                                                } else {
                                                    navigate(`/products/instruments/${encodeURIComponent(item.name)}`);
                                                }
                                            }}
                                            className="group cursor-pointer h-full bg-white border border-stone-200 hover:border-brand-orange/30 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                        >
                                            {/* Image Section - Clean Medical Look */}
                                            <div className="relative h-48 bg-stone-50 overflow-hidden p-6 flex items-center justify-center">
                                                {/* Subtle Grid Background */}
                                                <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>

                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="relative z-10 w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ) : (
                                                    <div className="relative z-10 w-16 h-16 text-stone-300">
                                                        <Stethoscope size={64} strokeWidth={1} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-6 flex-grow flex flex-col justify-between border-t border-stone-100">
                                                <div>
                                                    <h3 className="font-heading text-xl text-brand-charcoal mb-2 group-hover:text-brand-orange transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-stone-500 text-sm font-light">
                                                        {item.count} instruments
                                                    </p>
                                                </div>

                                                <div className="mt-6 flex items-center text-sm font-bold text-brand-orange opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                    View Collection <ArrowRight size={14} className="ml-2" />
                                                </div>
                                            </div>
                                        </div>
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

