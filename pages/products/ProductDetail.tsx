import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Section, Button, FadeIn } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { getProductBySku, getProductsBySubcategory, Product } from '../../lib/database';
import { ChevronRight, Package, Loader2, MessageCircle, Mail, ArrowRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../components/CartProvider';

export const ProductDetail: React.FC = () => {
    // Handle both /product/:productId and /products/:category/:subcategory/:productSKU
    const { productId, productSKU } = useParams<{ productId?: string; productSKU?: string }>();
    const sku = decodeURIComponent(productId || productSKU || '');
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!sku) return;
            setLoading(true);
            const prod = await getProductBySku(sku);
            setProduct(prod);

            // Fetch related products from same subcategory
            if (prod) {
                const related = await getProductsBySubcategory(prod.category, prod.subcategory);
                // Filter out current product and limit to 4
                setRelatedProducts(related.filter(p => p.sku !== prod.sku).slice(0, 4));
            }

            setLoading(false);
        };
        fetchProduct();
    }, [sku]);

    if (loading) {
        return (
            <div className="pt-32 min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-gold" size={48} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-32 min-h-screen text-center">
                <h1 className="text-2xl font-serif text-brand-charcoal">Product not found</h1>
                <Link to="/products" className="text-brand-gold hover:underline mt-4 inline-block">
                    ← Back to Products
                </Link>
            </div>
        );
    }

    const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in the product:\n\nSKU: ${product.sku}\nName: ${product.name}\n\nPlease provide more information.`
    );
    const whatsappUrl = `https://wa.me/447778880462?text=${whatsappMessage}`;

    const emailSubject = encodeURIComponent(`Inquiry: ${product.name} (${product.sku})`);
    const emailBody = encodeURIComponent(`Hello,\n\nI'm interested in the following product:\n\nSKU: ${product.sku}\nName: ${product.name}\n\nPlease provide pricing and availability.\n\nThank you.`);
    const emailUrl = `mailto:info@smithinstruments.co.uk?subject=${emailSubject}&body=${emailBody}`;

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${product.name} - ${product.sku}`}
                description={product.description || `${product.name} surgical instrument`}
            />

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-widest">
                        <Link to="/products" className="hover:text-brand-gold">Products</Link>
                        <ChevronRight size={12} />
                        <Link to={`/products/${encodeURIComponent(product.category)}`} className="hover:text-brand-gold">
                            {product.category}
                        </Link>
                        {product.subcategory && product.subcategory !== 'General' && (
                            <>
                                <ChevronRight size={12} />
                                <Link
                                    to={`/products/${encodeURIComponent(product.category)}/${encodeURIComponent(product.subcategory)}`}
                                    className="hover:text-brand-gold"
                                >
                                    {product.subcategory}
                                </Link>
                            </>
                        )}
                        <ChevronRight size={12} />
                        <span className="text-brand-gold">{product.sku}</span>
                    </div>
                </div>
            </div>

            <Section className="bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Image with Zoom */}
                        <div
                            className="bg-stone-50 border border-stone-100 overflow-hidden aspect-square flex items-center justify-center relative cursor-zoom-in group"
                            onClick={() => product.image_url && setIsZoomed(true)}
                        >
                            {product.image_url ? (
                                <>
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZoomIn size={20} className="text-brand-charcoal" />
                                    </div>
                                </>
                            ) : (
                                <Package className="text-stone-300" size={120} />
                            )}
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <div>
                                <p className="text-brand-gold font-medium text-sm mb-2">SKU: {product.sku}</p>
                                <h1 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-4">
                                    {product.name}
                                </h1>

                                <div className="flex gap-2 flex-wrap mb-6">
                                    <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-sm rounded-full">
                                        {product.category}
                                    </span>
                                    {product.subcategory && product.subcategory !== 'General' && (
                                        <span className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-full">
                                            {product.subcategory}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {product.description && (
                                <div className="prose prose-stone max-w-none">
                                    <h3 className="text-lg font-medium text-brand-charcoal mb-2">Description</h3>
                                    <p className="text-stone-600 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="pt-6 border-t border-stone-200 space-y-4">
                                <h3 className="text-lg font-medium text-brand-charcoal">Interested?</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        variant="primary"
                                        className="flex-1 py-3"
                                        onClick={() => {
                                            if (product) {
                                                addToCart(product);
                                                // Optional: show toast or navigate
                                            }
                                        }}
                                    >
                                        <Package size={18} className="mr-2" />
                                        Add to Quote Cart
                                    </Button>

                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1"
                                    >
                                        <Button variant="outline" className="w-full py-3">
                                            <MessageCircle size={18} className="mr-2" />
                                            WhatsApp Chat
                                        </Button>
                                    </a>
                                </div>
                                <p className="text-xs text-stone-400">
                                    Add items to your cart and submit a single request for all prices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <Section className="bg-stone-50">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-serif text-2xl md:text-3xl text-brand-charcoal">
                                    Related Products
                                </h2>
                                <p className="text-stone-500 text-sm mt-1">
                                    More from {product.subcategory || product.category}
                                </p>
                            </div>
                            <Link
                                to={`/products/${encodeURIComponent(product.category)}/${encodeURIComponent(product.subcategory)}`}
                                className="hidden sm:flex items-center gap-2 text-brand-gold hover:underline text-sm font-medium"
                            >
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map((prod, idx) => (
                                <FadeIn key={prod.id} delay={idx * 0.1}>
                                    <div
                                        onClick={() => navigate(`/product/${encodeURIComponent(prod.sku)}`)}
                                        className="group cursor-pointer bg-white overflow-hidden border border-stone-100 hover:shadow-lg hover:border-brand-gold/30 transition-all duration-300"
                                    >
                                        <div className="aspect-square bg-stone-50 overflow-hidden">
                                            {prod.image_url ? (
                                                <img
                                                    src={prod.image_url}
                                                    alt={prod.name}
                                                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="text-stone-300" size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t border-stone-100 p-4">
                                            <p className="text-xs text-brand-gold font-mono mb-1">{prod.sku}</p>
                                            <h3 className="text-sm font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors line-clamp-2">
                                                {prod.name}
                                            </h3>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </Section>
            )}

            {/* Zoom Modal */}
            <AnimatePresence>
                {isZoomed && product?.image_url && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
                        onClick={() => setIsZoomed(false)}
                    >
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute top-6 right-6 text-white hover:text-brand-gold transition-colors"
                        >
                            <X size={32} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            src={product.image_url}
                            alt={product.name}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
