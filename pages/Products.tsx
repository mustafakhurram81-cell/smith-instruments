import React, { useState } from 'react';
import { Section, Button, FadeIn } from '../components/Shared';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { ArrowRight, Scissors, HeartPulse, Brain, Bone, Stethoscope, Microscope, Syringe, Activity } from 'lucide-react';

// Mock Data for Product Categories
const PRODUCT_CATEGORIES = [
    {
        id: 'general-surgery',
        name: 'General Surgery',
        icon: Scissors,
        description: 'Standard instruments for general surgical procedures.',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
        subcategories: ['Scissors', 'Forceps', 'Retractors', 'Needle Holders', 'Scalpel Handles']
    },
    {
        id: 'dental',
        name: 'Dental Instruments',
        icon: Activity,
        description: 'Precision tools for dental and orthodontic procedures.',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
        subcategories: ['Extracting Forceps', 'Root Elevators', 'Scalers', 'Mirrors', 'Explorers']
    },
    {
        id: 'cardiovascular',
        name: 'Cardiovascular',
        icon: HeartPulse,
        description: 'Specialized instruments for heart and vascular surgery.',
        image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800',
        subcategories: ['Vascular Clamps', 'Rib Spreaders', 'Thoracic Scissors', 'Needle Holders']
    },
    {
        id: 'neuro-spine',
        name: 'Neuro & Spine',
        icon: Brain,
        description: 'Microsurgical instruments for neurosurgery and spine.',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        subcategories: ['Rongeurs', 'Kerrison Punches', 'Micro Scissors', 'Dissectors']
    },
    {
        id: 'orthopedic',
        name: 'Orthopedic',
        icon: Bone,
        description: 'Heavy-duty instruments for bone and joint surgery.',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
        subcategories: ['Bone Cutters', 'Mallets', 'Osteotomes', 'Wire Cutters']
    },
    {
        id: 'ent',
        name: 'ENT & Diagnostics',
        icon: Stethoscope,
        description: 'Instruments for Ear, Nose, and Throat specialists.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0929519?auto=format&fit=crop&q=80&w=800',
        subcategories: ['Otoscopes', 'Nasal Speculums', 'Tonsil Snares', 'Laryngoscopes']
    },
    {
        id: 'plastic-surgery',
        name: 'Plastic Surgery',
        icon: Syringe,
        description: 'Fine instruments for reconstructive and aesthetic surgery.',
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800',
        subcategories: ['Rhinoplasty Instruments', 'Breast Dissectors', 'Liposuction Cannulas', 'Fine Scissors']
    },
    {
        id: 'ophthalmic',
        name: 'Ophthalmic',
        icon: Microscope,
        description: 'Delicate tools for eye surgery and procedures.',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
        subcategories: ['Speculums', 'Micro Forceps', 'Needle Holders', 'Scissors']
    }
];

export const Products: React.FC = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Scroll to category details when clicked
    const handleCategoryClick = (id: string) => {
        setActiveCategory(activeCategory === id ? null : id);
    };

    return (
        <div className="pt-20">
            <SEO
                title="Surgical Instruments Products"
                description="Explore our wide range of surgical instruments including General Surgery, Dental, Cardiovascular, and more."
                keywords="surgical instruments, medical tools, general surgery, dental instruments, cardiovascular tools"
            />

            {/* Header */}
            <div className="bg-stone-50 py-24 text-center relative overflow-hidden border-b border-stone-200">
                <h1 className="font-serif text-5xl md:text-6xl text-brand-charcoal relative z-10 mb-4">Our Products</h1>
                <p className="text-stone-500 font-light max-w-xl mx-auto relative z-10">
                    Precision engineered instruments for every surgical specialty.
                </p>
            </div>

            {/* Product Categories Grid */}
            <Section className="bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {PRODUCT_CATEGORIES.map((category, idx) => (
                            <FadeIn key={category.id} delay={idx * 0.1}>
                                <div
                                    className={`group bg-white rounded-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${activeCategory === category.id ? 'ring-2 ring-brand-gold shadow-lg' : ''}`}
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    {/* Image Area */}
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-brand-charcoal/20 group-hover:bg-transparent transition-colors z-10"></div>
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                                            <category.icon size={24} className="text-brand-charcoal" />
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-serif text-2xl text-brand-charcoal">{category.name}</h3>
                                            <ArrowRight size={20} className={`text-brand-gold transform transition-transform duration-300 ${activeCategory === category.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                                        </div>
                                        <p className="text-stone-500 text-sm font-light mb-4 line-clamp-2">
                                            {category.description}
                                        </p>

                                        {/* Subcategories (Expandable) */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeCategory === category.id ? 'max-h-60 opacity-100 mt-4 pt-4 border-t border-stone-100' : 'max-h-0 opacity-0'}`}>
                                            <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-3">Available Instruments</p>
                                            <ul className="grid grid-cols-2 gap-2">
                                                {category.subcategories.map((sub, i) => (
                                                    <li key={i} className="text-sm text-stone-600 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                                                        {sub}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-6">
                                                <Button
                                                    variant="primary"
                                                    className="w-full text-xs py-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate('/catalogues');
                                                    }}
                                                >
                                                    View Full Catalogue
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </Section>

            {/* CTA Section */}
            <section className="py-24 bg-brand-charcoal text-stone-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-stone-800/30 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="font-serif text-3xl md:text-4xl mb-6 text-white">Need a Specific Instrument?</h2>
                    <p className="mb-10 text-stone-400 font-light text-lg max-w-2xl mx-auto">
                        We manufacture thousands of instruments. If you don't see what you're looking for, download our full catalogues or contact us for custom manufacturing.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button variant="primary" onClick={() => navigate('/catalogues')}>
                            Download Catalogues
                        </Button>
                        <Button variant="outline" className="text-white border-white hover:bg-white hover:text-brand-charcoal" onClick={() => navigate('/contact')}>
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
