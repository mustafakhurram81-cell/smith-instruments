import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Section, FadeIn } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { ProductCard } from '../../components/ProductCard';
import { CATEGORIES_DATA, getSubcategories } from '../../data/categories';
import { getProductsBySubcategory } from '../../data/products';
import { ChevronRight } from 'lucide-react';

export const SubcategoryView: React.FC = () => {
    const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
    const navigate = useNavigate();

    const category = CATEGORIES_DATA.find(c => c.id === categoryId);
    const subcategories = categoryId ? getSubcategories(categoryId) : [];
    const subcategory = subcategories.find(s => s.id === subcategoryId);

    const products = (categoryId && subcategoryId) ? getProductsBySubcategory(categoryId, subcategoryId) : [];

    if (!category || !subcategory) {
        return <div className="pt-32 text-center">Category or Subcategory not found</div>;
    }

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${subcategory.name} - ${category.name}`}
                description={`Browse our range of ${subcategory.name} for ${category.name}.`}
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-12 md:py-16 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest">
                        <Link to="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={12} />
                        <Link to={`/products/${categoryId}`} className="hover:text-white">{category.name}</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-gold">{subcategory.name}</span>
                    </div>

                    <h1 className="font-serif text-3xl md:text-5xl mb-4">{subcategory.name}</h1>
                    <p className="text-stone-400 font-light max-w-2xl">
                        {products.length} instruments available.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-800 to-transparent opacity-50 pointer-events-none"></div>
            </div>

            <Section className="bg-white">
                <div className="container mx-auto px-6">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product, idx) => (
                                <FadeIn key={product.id} delay={idx * 0.05}>
                                    <ProductCard
                                        product={product}
                                        onClick={() => navigate(`/products/${categoryId}/${subcategoryId}/${product.id}`)}
                                    />
                                </FadeIn>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-serif text-brand-charcoal mb-2">No products found</h3>
                            <p className="text-stone-500">We are adding products to this category soon.</p>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
};
