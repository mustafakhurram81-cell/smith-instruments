import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Section, FadeIn } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { CategoryCard } from '../../components/CategoryCard';
import { CATEGORIES_DATA, getSubcategories } from '../../data/categories';
import { ChevronRight } from 'lucide-react';

export const CategoryView: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();

    const category = CATEGORIES_DATA.find(c => c.id === categoryId);
    const subcategories = categoryId ? getSubcategories(categoryId) : [];

    if (!category) {
        return <div className="pt-32 text-center">Category not found</div>;
    }

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${category.name} Instruments`}
                description={`Browse ${category.name} subcategories and instruments.`}
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-12 md:py-16 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 uppercase tracking-widest">
                        <Link to="/products" className="hover:text-white">Products</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-gold">{category.name}</span>
                    </div>

                    <h1 className="font-serif text-3xl md:text-5xl mb-4">{category.name}</h1>
                    <p className="text-stone-400 font-light max-w-2xl">
                        {category.description}
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-800 to-transparent opacity-50 pointer-events-none"></div>
            </div>

            <Section className="bg-white">
                <div className="container mx-auto px-6">
                    {subcategories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {subcategories.map((sub, idx) => (
                                <FadeIn key={sub.id} delay={idx * 0.1}>
                                    <CategoryCard
                                        title={sub.name}
                                        description={sub.description || `Browse all ${sub.name} instruments.`}
                                        image={sub.image}
                                        onClick={() => navigate(`/products/${category.id}/${sub.id}`)}
                                    />
                                </FadeIn>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-serif text-brand-charcoal mb-2">No subcategories found</h3>
                            <p className="text-stone-500">Please check back later.</p>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
};
