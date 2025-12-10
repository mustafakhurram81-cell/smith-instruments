import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Section, Button, FadeIn } from '../../components/Shared';
import { SEO } from '../../components/SEO';
import { getProductBySku, getProductsBySubcategory, getProductVariants, Product } from '../../lib/database';
import { ChevronRight, Package, Loader2, Mail, ArrowRight, X, ChevronDown, Minus, Plus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../components/CartProvider';
import { useToast } from '../../components/ToastProvider';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';

export const ProductDetail: React.FC = () => {
    // Handle both /product/:productId and /products/:category/:subcategory/:productSKU
    const { productId, productSKU } = useParams<{ productId?: string; productSKU?: string }>();
    const sku = decodeURIComponent(productId || productSKU || '');
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const { items: recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();

    const [product, setProduct] = useState<Product | null>(null);
    const [parentProduct, setParentProduct] = useState<Product | null>(null); // Stores original for consistent name
    const [variants, setVariants] = useState<Product[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isVariantDropdownOpen, setIsVariantDropdownOpen] = useState(false);
    const [hoverZoom, setHoverZoom] = useState({ active: false, x: 50, y: 50 });
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!sku) return;
            setLoading(true);
            const prod = await getProductBySku(sku);
            setProduct(prod);

            if (prod) {
                // Fetch variants (products with same SKU prefix)
                const variantProducts = await getProductVariants(prod.sku);
                setVariants(variantProducts);

                // Find the parent/base product (first variant or shortest SKU) for consistent name
                const baseSku = prod.specifications?.variant_of || prod.sku.replace(/-\d+$/, '-01');
                const parent = variantProducts.find(v => v.sku === baseSku) || variantProducts[0] || prod;
                setParentProduct(parent);

                // Fetch related products from same subcategory
                const related = await getProductsBySubcategory(prod.category, prod.subcategory);
                // Filter out current product and its variants, limit to 4
                const variantSkus = new Set(variantProducts.map(v => v.sku));
                setRelatedProducts(related.filter(p => !variantSkus.has(p.sku)).slice(0, 4));
            }

            setLoading(false);
        };
        fetchProduct();
    }, [sku]);

    // Track recently viewed
    useEffect(() => {
        if (product) {
            addToRecentlyViewed(product);
        }
    }, [product?.id]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setIsVariantDropdownOpen(false);
        if (isVariantDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isVariantDropdownOpen]);

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

    // Extract variant info from product specifications/description for display
    const getVariantLabel = (p: Product) => {
        // Try to get meaningful info from specifications
        const specs = p.specifications as Record<string, string> | null;
        if (specs) {
            const parts: string[] = [];
            if (specs.fig || specs.figure) parts.push(specs.fig || specs.figure);
            if (specs.length) parts.push(specs.length);
            if (specs.blade) parts.push(specs.blade);
            if (specs.size) parts.push(specs.size);
            if (parts.length > 0) {
                return `${p.sku} - ${parts.join(', ')}`;
            }
        }
        // Fallback to description if available
        if (p.description && p.description.length < 50) {
            return `${p.sku} - ${p.description}`;
        }
        return p.sku;
    };

    // Short label for dropdown items - just the differentiating specs
    const getShortVariantLabel = (p: Product) => {
        const specs = p.specifications as Record<string, string> | null;
        if (specs) {
            const parts: string[] = [];
            if (specs.fig || specs.figure) parts.push(specs.fig || specs.figure);
            if (specs.length) parts.push(specs.length);
            if (specs.blade) parts.push(`Blade ${specs.blade}`);
            if (specs.size) parts.push(specs.size);
            if (parts.length > 0) {
                return parts.join(' | ');
            }
        }
        // Extract size from description if no specs
        if (p.description) {
            const match = p.description.match(/(\d+(?:\.\d+)?\s*(?:mm|cm))/i);
            if (match) return match[1];
        }
        return '';
    };

    const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in the product:\n\nSKU: ${product.sku}\nName: ${product.name}\nQuantity: ${quantity}\n\nPlease provide more information.`
    );
    const whatsappUrl = `https://wa.me/447778880462?text=${whatsappMessage}`;

    const emailSubject = encodeURIComponent(`Inquiry: ${product.name} (${product.sku})`);
    const emailBody = encodeURIComponent(`Hello,\n\nI'm interested in the following product:\n\nSKU: ${product.sku}\nName: ${product.name}\n\nPlease provide pricing and availability.\n\nThank you.`);
    const emailUrl = `mailto:info@smithinstruments.co.uk?subject=${emailSubject}&body=${emailBody}`;

    // Generate Product schema for structured data
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": parentProduct?.name || product.name,
        "sku": product.sku,
        "description": product.description || `${product.name} - Premium surgical instrument`,
        "image": product.image_url || undefined,
        "brand": {
            "@type": "Brand",
            "name": "Smith Instruments"
        },
        "category": `${product.category}${product.subcategory ? ` > ${product.subcategory}` : ''}`,
        "manufacturer": {
            "@type": "Organization",
            "name": "Smith Instruments",
            "url": "https://smithinstruments.com"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Smith Instruments"
            }
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title={`${product.name} - ${product.sku}`}
                description={product.description || `${product.name} surgical instrument`}
                image={product.image_url}
                type="product"
                structuredData={productSchema}
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
                        {/* Image with Hover Zoom */}
                        <div
                            className="bg-stone-50 border border-stone-100 overflow-hidden aspect-square flex items-center justify-center relative cursor-zoom-in group"
                            onClick={() => product.image_url && setIsZoomed(true)}
                            onMouseMove={(e) => {
                                if (!product.image_url) return;
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                setHoverZoom({ active: true, x, y });
                            }}
                            onMouseLeave={() => setHoverZoom({ active: false, x: 50, y: 50 })}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={product.sku}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    {product.image_url ? (
                                        <div className="w-full h-full overflow-hidden">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-8 transition-transform duration-200"
                                                style={{
                                                    transform: hoverZoom.active ? 'scale(2)' : 'scale(1)',
                                                    transformOrigin: `${hoverZoom.x}% ${hoverZoom.y}%`
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <Package className="text-stone-300" size={120} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                            {/* Click to enlarge hint */}
                            {product.image_url && !hoverZoom.active && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    Click to enlarge
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <motion.div
                                key={`details-${product.sku}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                            >
                                <p className="text-brand-gold font-medium text-sm mb-2">SKU: {product.sku}</p>
                                <h1 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-4">
                                    {parentProduct?.name || product.name}
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
                            </motion.div>

                            {/* Variant Selector */}
                            {variants.length > 1 && (
                                <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
                                    <label className="text-sm font-medium text-brand-charcoal mb-2 block">
                                        Size / Variant ({variants.length} options)
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsVariantDropdownOpen(!isVariantDropdownOpen);
                                            }}
                                            className="w-full flex items-center justify-between bg-white border border-stone-200 rounded-lg px-4 py-3 text-left hover:border-brand-gold transition-colors"
                                        >
                                            <span className="font-medium text-brand-charcoal">
                                                {getVariantLabel(product)}
                                            </span>
                                            <ChevronDown
                                                size={20}
                                                className={`text-stone-400 transition-transform ${isVariantDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {isVariantDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {variants.map((variant) => (
                                                        <button
                                                            key={variant.id}
                                                            onClick={() => {
                                                                setIsVariantDropdownOpen(false);
                                                                // Update product state directly (no page reload)
                                                                setProduct(variant);
                                                                // Update URL for sharing/bookmarking without reload
                                                                window.history.pushState(null, '', `/product/${encodeURIComponent(variant.sku)}`);
                                                            }}
                                                            className={`w-full px-4 py-3 text-left hover:bg-stone-50 flex items-center justify-between border-b border-stone-100 last:border-b-0 transition-colors ${variant.sku === product.sku ? 'bg-brand-gold/10' : ''
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-mono text-sm text-brand-gold">{variant.sku}</span>
                                                                <span className="text-sm text-stone-500">
                                                                    {getShortVariantLabel(variant)}
                                                                </span>
                                                            </div>
                                                            {variant.sku === product.sku && (
                                                                <span className="text-xs bg-brand-gold text-white px-2 py-0.5 rounded">Current</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {product.description && (
                                <div className="prose prose-stone max-w-none">
                                    <h3 className="text-lg font-medium text-brand-charcoal mb-2">Description</h3>
                                    <p className="text-stone-600 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="pt-6 border-t border-stone-200 space-y-4">
                                <h3 className="text-lg font-medium text-brand-charcoal">Interested?</h3>

                                {/* Quantity Selector */}
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-stone-600">Quantity:</span>
                                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="p-2 hover:bg-stone-100 transition-colors disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={16} className="text-stone-600" />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 text-center py-2 border-x border-stone-200 outline-none text-brand-charcoal font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="p-2 hover:bg-stone-100 transition-colors"
                                        >
                                            <Plus size={16} className="text-stone-600" />
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full py-3"
                                    onClick={() => {
                                        if (product) {
                                            addToCart(product, quantity);
                                            showToast('Added to Quote Cart', 'success', {
                                                productName: product.name,
                                                quantity: quantity
                                            });
                                            setQuantity(1); // Reset after adding
                                        }
                                    }}
                                >
                                    <Package size={18} className="mr-2" />
                                    Add {quantity > 1 ? `${quantity} Items` : ''} to Quote Cart
                                </Button>

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
                <Section className="bg-stone-50 !pb-16">
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

            {/* Recently Viewed Section */}
            {recentlyViewed.filter(item => item.id !== product?.id).length > 0 && (
                <Section className="bg-white border-t border-stone-100 !pt-16">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center gap-3 mb-8">
                            <Clock size={20} className="text-stone-400" />
                            <h2 className="font-serif text-2xl text-brand-charcoal">
                                Recently Viewed
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {recentlyViewed
                                .filter(item => item.id !== product?.id)
                                .slice(0, 6)
                                .map((item, idx) => (
                                    <FadeIn key={item.id} delay={idx * 0.05}>
                                        <div
                                            onClick={() => navigate(`/product/${encodeURIComponent(item.sku)}`)}
                                            className="group cursor-pointer bg-stone-50 overflow-hidden border border-stone-100 hover:shadow-md hover:border-brand-gold/30 transition-all duration-300"
                                        >
                                            <div className="aspect-square bg-white overflow-hidden">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="text-stone-300" size={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3 border-t border-stone-100">
                                                <p className="text-[10px] text-brand-gold font-mono mb-0.5">{item.sku}</p>
                                                <h3 className="text-xs font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors line-clamp-2">
                                                    {item.name}
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

