import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, FadeIn } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { getCategoryDetails } from '../../lib/database';
import { Loader2, ArrowRight } from 'lucide-react';

export const ProductsIndex: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<{ name: string; count: number; image: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCategoryDetails();
            setCategories(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title="Surgical Instruments Categories"
                description="Browse our comprehensive range of high-quality surgical instruments."
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-16 md:py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-brand-gold uppercase tracking-widest text-xs font-bold mb-4 block">
                        Our Catalog
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl mb-6">
                        Precision Instruments
                    </h1>
                    <p className="text-stone-400 font-light max-w-2xl mx-auto text-lg">
                        Explore our extensive collection of {categories.reduce((acc, c) => acc + c.count, 0)} instruments across {categories.length} specialties.
                    </p>
                </div>
                {/* Abstract Background */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-gold blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900 blur-[150px] rounded-full"></div>
                </div>
            </div>

            <Section className="bg-stone-50">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Loader2 className="animate-spin text-brand-gold mb-4" size={48} />
                            <p className="text-stone-500 animate-pulse">Loading catalog...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.filter(c => c.name !== 'Uncategorized').map((cat, idx) => (
                                <FadeIn key={cat.name} delay={idx * 0.05}>
                                    <div
                                        onClick={() => navigate(`/products/${encodeURIComponent(cat.name)}`)}
                                        className="group cursor-pointer relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                                    >
                                        {/* Background Image */}
                                        <div className="absolute inset-0 bg-stone-200">
                                            {cat.image ? (
                                                <img
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <h3 className="font-serif text-3xl text-white mb-2 group-hover:text-brand-gold transition-colors">
                                                        {cat.name}
                                                    </h3>
                                                    <p className="text-stone-300 text-sm font-medium">
                                                        {cat.count} Instruments
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-brand-gold group-hover:text-brand-charcoal transition-all">
                                                    <ArrowRight size={20} className="-ml-1 group-hover:ml-0 transition-all" />
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
