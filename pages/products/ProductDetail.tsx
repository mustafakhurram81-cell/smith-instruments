import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Section, Button, FadeIn } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { CATEGORIES_DATA, getSubcategories } from '../../data/categories';
import { getProductById } from '../../data/products';
import { ChevronRight, MessageCircle, Check, ShieldCheck, Truck } from 'lucide-react';

export const ProductDetail: React.FC = () => {
    const { categoryId, subcategoryId, productId } = useParams<{ categoryId: string; subcategoryId: string; productId: string }>();

    const category = CATEGORIES_DATA.find(c => c.id === categoryId);
    const subcategories = categoryId ? getSubcategories(categoryId) : [];
    const subcategory = subcategories.find(s => s.id === subcategoryId);
    const product = productId ? getProductById(productId) : undefined;

    if (!product || !category || !subcategory) {
        return <div className="pt-32 text-center">Product not found</div>;
    }

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${product.name} | ${product.sku}`}
                description={`${product.name} (${product.sku}) - ${product.description}`}
            />

            {/* Breadcrumbs Header */}
            <div className="bg-white border-b border-stone-200 py-4">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-widest flex-wrap">
                        <Link to="/products" className="hover:text-brand-charcoal">Products</Link>
                        <ChevronRight size={12} />
                        <Link to={`/products/${categoryId}`} className="hover:text-brand-charcoal">{category.name}</Link>
                        <ChevronRight size={12} />
                        <Link to={`/products/${categoryId}/${subcategoryId}`} className="hover:text-brand-charcoal">{subcategory.name}</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-gold font-bold">{product.sku}</span>
                    </div>
                </div>
            </div>

            <Section className="bg-white pt-12 pb-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                        {/* Left: Image */}
                        <FadeIn>
                            <div className="bg-stone-50 border border-stone-100 rounded-sm overflow-hidden relative group">
                                <div className="aspect-square flex items-center justify-center p-8">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="absolute top-4 left-4 bg-brand-gold text-brand-charcoal text-xs font-bold px-3 py-1 rounded-full">
                                    PREMIUM GRADE
                                </div>
                            </div>
                        </FadeIn>

                        {/* Right: Details */}
                        <FadeIn delay={0.2}>
                            <div>
                                <h1 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-2">{product.name}</h1>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-sm text-sm font-mono border border-stone-200">
                                        SKU: {product.sku}
                                    </span>
                                    <span className="text-green-600 text-sm flex items-center gap-1">
                                        <Check size={14} /> In Stock
                                    </span>
                                </div>

                                <p className="text-stone-600 leading-relaxed mb-8 text-lg font-light">
                                    {product.description}
                                </p>

                                {/* Specs Table */}
                                <div className="bg-stone-50 border border-stone-100 rounded-sm p-6 mb-8">
                                    <h3 className="font-serif text-lg mb-4 text-brand-charcoal">Specifications</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                        <div className="flex justify-between border-b border-stone-200 pb-2">
                                            <span className="text-stone-500">Material</span>
                                            <span className="font-medium text-brand-charcoal">{product.specifications.material}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-stone-200 pb-2">
                                            <span className="text-stone-500">Finish</span>
                                            <span className="font-medium text-brand-charcoal">{product.specifications.finish}</span>
                                        </div>
                                        {product.specifications.length && (
                                            <div className="flex justify-between border-b border-stone-200 pb-2">
                                                <span className="text-stone-500">Length</span>
                                                <span className="font-medium text-brand-charcoal">{product.specifications.length}</span>
                                            </div>
                                        )}
                                        {product.specifications.type && (
                                            <div className="flex justify-between border-b border-stone-200 pb-2">
                                                <span className="text-stone-500">Type</span>
                                                <span className="font-medium text-brand-charcoal">{product.specifications.type}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                    <Button
                                        variant="primary"
                                        className="flex-1 py-4 text-base gap-2"
                                        onClick={() => window.open(`https://wa.me/923302449855?text=Hi, I would like to request a quote for: ${product.name} (SKU: ${product.sku})`, '_blank')}
                                    >
                                        <MessageCircle size={20} /> Request Quote via WhatsApp
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 py-4 text-base"
                                        onClick={() => window.location.href = `mailto:sales@smithinstruments.com?subject=Quote Request: ${product.sku}&body=I am interested in ${product.name} (${product.sku}). Please provide pricing.`}
                                    >
                                        Email Inquiry
                                    </Button>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-stone-500 text-sm">
                                        <ShieldCheck className="text-brand-gold" size={20} />
                                        <span>ISO 13485 Certified</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-stone-500 text-sm">
                                        <Truck className="text-brand-gold" size={20} />
                                        <span>Worldwide Shipping</span>
                                    </div>
                                </div>

                            </div>
                        </FadeIn>
                    </div>
                </div>
            </Section>
        </div>
    );
};
