import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, FadeIn } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { CategoryCard } from '../../components/CategoryCard';
import { CATEGORIES_DATA } from '../../data/categories';

export const ProductsIndex: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title="Surgical Instruments Categories"
                description="Browse our comprehensive range of surgical instruments by category."
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-12 md:py-16 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="font-serif text-3xl md:text-5xl mb-4">Product Categories</h1>
                    <p className="text-stone-400 font-light max-w-2xl">
                        Select a specialty to explore our precision instruments.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-800 to-transparent opacity-50 pointer-events-none"></div>
            </div>

            <Section className="bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {CATEGORIES_DATA.map((category, idx) => (
                            <FadeIn key={category.id} delay={idx * 0.1}>
                                <CategoryCard
                                    title={category.name}
                                    description={category.description}
                                    image={category.image}
                                    icon={category.icon}
                                    onClick={() => navigate(`/products/${category.id}`)}
                                />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
};
