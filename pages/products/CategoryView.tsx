import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Section, FadeIn, Button, Pagination } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { CategoryGridSkeleton, ProductGridSkeleton } from '../../components/ui/Skeleton';
import { useSubcategoryDetails, useProductsByCategory } from '../../lib/queries';
import { ChevronRight, Package, ArrowRight } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';

export const CategoryView: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const navigate = useNavigate();
    const category = decodeURIComponent(categoryName || '');

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 24;

    // Use the new hook that includes counts and images
    const { data: subcategoryDetails = [], isLoading: subsLoading } = useSubcategoryDetails(category);
    // Returns { data: Product[], count: number }
    const { data: productsResult, isLoading: productsLoading } = useProductsByCategory(category, currentPage, ITEMS_PER_PAGE);

    const products = productsResult?.data ?? [];
    const totalCount = productsResult?.count ?? 0;
    const loading = subsLoading || productsLoading;

    // Calculate total from subcategory details for accurate count
    const totalProducts = subcategoryDetails.reduce((acc, sub) => acc + sub.count, 0);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${category} Instruments`}
                description={`Browse ${category} subcategories and instruments.`}
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": `${category} Instruments`,
                    "description": `Browse ${category} subcategories and instruments.`,
                    "url": `https://smithinstruments.net/products/${encodeURIComponent(category)}`
                }}
                breadcrumbs={[
                    { name: 'Products', item: '/products' },
                    { name: category, item: `/products/${encodeURIComponent(category)}` }
                ]}
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-12 md:py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest">
                        <Link to="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-orange">{category}</span>
                    </div>

                    <h1 className="font-serif text-4xl md:text-6xl mb-4">{category}</h1>
                    <p className="text-stone-400 font-light max-w-2xl text-lg">
                        {!loading && (
                            <>{totalProducts} instruments across {subcategoryDetails.length} subcategories</>
                        )}
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-orange blur-[150px] rounded-full"></div>
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
                                            className="group cursor-pointer relative h-64 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-white">
                                                {sub.image ? (
                                                    <img
                                                        src={sub.image}
                                                        alt={sub.name}
                                                        className="w-full h-full object-cover opacity-90"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                                                        <Package className="text-stone-400" size={48} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                                            <div className="absolute bottom-0 left-0 w-full p-6">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h3 className="font-serif text-2xl text-white mb-1 group-hover:text-brand-orange transition-colors">
                                                            {sub.name}
                                                        </h3>
                                                        <p className="text-stone-300 text-sm">
                                                            {sub.count} instruments
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-brand-charcoal group-hover:scale-110 transition-transform">
                                                        <ArrowRight size={20} />
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
                                    All Products ({totalCount})
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product, idx) => (
                                    <ProductCard
                                        key={product.sku}
                                        product={product}
                                        viewMode="grid"
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
                    )}
                </div>
            </Section>
        </div>
    );
};
