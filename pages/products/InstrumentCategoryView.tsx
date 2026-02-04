import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Section, FadeIn, Pagination } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { CategoryGridSkeleton, ProductGridSkeleton } from '../../components/ui/Skeleton';
import { useInstrumentSubcategoriesNew, useProductsByInstrument } from '../../lib/queries';
import { ChevronRight, Package, ArrowRight, Scissors } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';

export const InstrumentCategoryView: React.FC = () => {
    const { categoryName, subcategoryName } = useParams<{ categoryName: string; subcategoryName?: string }>();
    const navigate = useNavigate();
    const category = decodeURIComponent(categoryName || '');
    const subcategory = subcategoryName ? decodeURIComponent(subcategoryName) : null;

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 24;

    // Fetch subcategories for this instrument category (from new column)
    const { data: subcategories = [], isLoading: subsLoading } = useInstrumentSubcategoriesNew(category);

    // Fetch products (from new column)
    const { data: products = [], isLoading: productsLoading } = useProductsByInstrument(category, subcategory || undefined);

    const loading = subsLoading || productsLoading;
    const totalProducts = subcategories.reduce((acc, sub) => acc + sub.count, 0);

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const visibleProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // If viewing a specific subcategory, show products directly
    if (subcategory) {
        return (
            <div className="pt-20 min-h-screen bg-stone-50">
                <SEO
                    title={`${subcategory} - ${category}`}
                    description={`Browse our collection of ${subcategory.toLowerCase()} surgical instruments.`}
                />

                {/* Header */}
                <div className="bg-brand-charcoal text-white py-12 md:py-20 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest">
                            <Link to="/products" className="hover:text-white">Products</Link>
                            <ChevronRight size={12} />
                            <Link to={`/products/instruments/${encodeURIComponent(category)}`} className="hover:text-white">{category}</Link>
                            <ChevronRight size={12} />
                            <span className="text-brand-orange">{subcategory}</span>
                        </div>

                        <h1 className="font-serif text-4xl md:text-6xl mb-4">{subcategory}</h1>
                        <p className="text-stone-400 font-light max-w-2xl text-lg">
                            {!productsLoading && <>{products.length} instruments</>}
                        </p>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-orange blur-[150px] rounded-full"></div>
                    </div>
                </div>

                <Section className="bg-stone-50 !py-12">
                    <div className="container mx-auto px-6">
                        {productsLoading ? (
                            <ProductGridSkeleton count={12} />
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <Package className="mx-auto text-stone-300 mb-4" size={48} />
                                <p className="text-stone-500">No products found in this subcategory.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-serif text-brand-charcoal">
                                        All Products ({products.length})
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {visibleProducts.map((product, idx) => (
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
    }

    // Show subcategories for this instrument category
    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${category} - Surgical Instruments`}
                description={`Browse our collection of ${category.toLowerCase()} surgical instruments.`}
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-12 md:py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest">
                        <Link to="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-orange">{category}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <Scissors className="text-brand-orange" size={32} />
                        <h1 className="font-serif text-4xl md:text-6xl">{category}</h1>
                    </div>
                    <p className="text-stone-400 font-light max-w-2xl text-lg">
                        {!loading && (
                            <>{totalProducts} instruments across {subcategories.length} types</>
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
                    ) : subcategories.length > 0 ? (
                        <>
                            <h2 className="text-2xl font-serif text-brand-charcoal mb-8">Instrument Types</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subcategories.map((sub, idx) => (
                                    <FadeIn key={sub.name} delay={idx * 0.05}>
                                        <div
                                            onClick={() => navigate(`/products/instruments/${encodeURIComponent(category)}/${encodeURIComponent(sub.name)}`)}
                                            className="group cursor-pointer relative h-64 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-white">
                                                {sub.image ? (
                                                    <img
                                                        src={sub.image}
                                                        alt={sub.name}
                                                        className="w-full h-full object-cover opacity-90"
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
                        <div className="text-center py-20">
                            <Package className="mx-auto text-stone-300 mb-4" size={48} />
                            <p className="text-stone-500">No subcategories found.</p>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
};
