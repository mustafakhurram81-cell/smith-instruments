import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, FadeIn, ParallaxHeader } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { CategoryGridSkeleton } from '../../components/ui/Skeleton';
import { useCategoryDetails } from '../../lib/queries';
import { ArrowRight } from 'lucide-react';

export const ProductsIndex: React.FC = () => {
    const navigate = useNavigate();
    const { data: categories = [], isLoading, error } = useCategoryDetails();

    const totalProducts = categories.reduce((acc, c) => acc + c.count, 0);

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title="Precision Instruments"
                description="A comprehensive range of instruments for every surgical specialty."
            />

            {/* Header */}
            <ParallaxHeader
                title="Precision Instruments"
                description={!isLoading ? `${totalProducts} instruments across ${categories.length} specialties` : undefined}
                image="/images/headers/products-header.png"
                breadcrumbs={
                    <span className="text-brand-gold uppercase tracking-widest text-xs font-bold block">
                        Our Catalog
                    </span>
                }
            />

            <Section className="bg-stone-50 !py-12">
                <div className="container mx-auto px-6">
                    {isLoading ? (
                        <CategoryGridSkeleton count={8} />
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            Failed to load products. please try again later. {(error as any).message}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {categories.map((cat, idx) => (
                                <FadeIn key={cat.name} delay={idx * 0.05}>
                                    <div
                                        onClick={() => navigate(`/products/${encodeURIComponent(cat.name)}`)}
                                        className="group cursor-pointer relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                    >
                                        {/* Image Background */}
                                        <div className="absolute inset-0 bg-stone-200">
                                            {cat.image ? (
                                                <img
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300" />
                                            )}
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 w-full p-6">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <h3 className="font-serif text-2xl text-white mb-1 group-hover:text-brand-gold transition-colors">
                                                        {cat.name}
                                                    </h3>
                                                    <p className="text-stone-300 text-sm">
                                                        {cat.count} instruments
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
                    )}
                </div>
            </Section>
        </div>
    );
};
