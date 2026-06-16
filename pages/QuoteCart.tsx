import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema, type QuoteFormValues } from '../lib/validations';
import { useCart } from '../components/CartProvider';
import { Section, Button, FadeIn } from '../components/Shared';
import { Trash2, Plus, Minus, Send, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';
import { EmptyState } from '../components/ui/EmptyState';
import { analytics } from '../lib/analytics';
import { formatAttribution } from '../hooks';

export const QuoteCart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, clearCart } = useCart();
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // React Hook Form
    const { register, handleSubmit: handleHookSubmit, formState: { errors }, getValues } = useForm<QuoteFormValues>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            country: '',
            message: ''
        }
    });

    // EmailJS credentials from environment variables
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const QUOTE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_QUOTE_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const onSubmit = async (data: QuoteFormValues) => {
        setSending(true);

        // Prepare the product list string for email
        const productList = items.map(i => `• ${i.sku} - ${i.name} (Qty: ${i.quantity})`).join('\n');

        // Prepare products array for database
        const productsData = items.map(item => ({
            sku: item.sku,
            name: item.name,
            quantity: item.quantity,
            image_url: item.image_url || null
        }));

        // Append campaign attribution if the visitor arrived via an ad
        const attribution = formatAttribution();
        const messageWithAttribution = data.message
            ? `${data.message}${attribution || ''}`
            : attribution || '';

        try {
            // 1. Save to Supabase database (with attribution metadata)
            const { error: dbError } = await supabase
                .from('quote_requests')
                .insert({
                    customer_name: data.name,
                    customer_email: data.email,
                    customer_phone: data.phone || null,
                    customer_country: data.country || null,
                    products: productsData,
                    message: messageWithAttribution || null,
                    status: 'new'
                });

            if (dbError) {
                console.warn('Failed to save to database:', dbError);
                // Continue anyway - email is more important
            }

            // 2. Send email notification (with attribution metadata)
            const fullMessage = `${data.message || ''}\n\n--- Requested Items ---\n${productList}${attribution || ''}`;

            const templateParams = {
                to_name: "Smith Instruments Sales",
                items_count: items.length,
                user_name: data.name,
                user_email: data.email,
                interest: "Quote Request",
                phone: data.phone,
                country: data.country,
                message: fullMessage,
                reply_to: data.email
            };

            await emailjs.send(
                SERVICE_ID,
                QUOTE_TEMPLATE_ID,
                templateParams,
                PUBLIC_KEY
            );

            // 3. Fire unified conversion event across all ad platforms
            analytics.quoteRequest(items.length);

            setSuccess(true);
            clearCart();
        } catch (error) {
            console.error('Failed to send quote', error);
            alert('Failed to send request. Please email us directly at sales@smithinstruments.net');
        } finally {
            setSending(false);
        }
    };

    if (items.length === 0 && !success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4">
                <SEO title="Quote Cart" description="Review your selected surgical instruments." />
                <EmptyState
                    title="Your Quote Cart is Empty"
                    description="Browse our catalogue to add instruments to your quotation request."
                    action={{
                        label: "Browse Products",
                        onClick: () => navigate('/products')
                    }}
                />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 text-center px-4">
                <SEO title="Quote Sent" description="Your quote request has been successfully sent." />
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Send size={32} />
                </div>
                <h1 className="text-3xl font-heading text-brand-charcoal mb-4">Quote Request Sent!</h1>
                <p className="text-stone-500 max-w-md mx-auto mb-8">
                    Thank you, {getValues('name')}. We have received your request for {items.length > 0 ? items.length : 'your'} items.
                    Our sales team will email you a formal quotation within 24 hours.
                </p>
                <Link to="/">
                    <Button variant="outline">Return Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
            <SEO title="Request a Quote" description="Submit your list of surgical instruments for a custom price quote." />
            <div className="container mx-auto px-6">
                <h1 className="text-3xl md:text-4xl font-heading text-brand-charcoal mb-2">Request a Quote</h1>
                <Link to="/products" className="text-brand-orange hover:underline text-sm mb-8 inline-block flex items-center">
                    <ArrowLeft size={14} className="mr-1" /> Continue Browsing
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-stone-100 font-medium text-stone-500 text-sm uppercase tracking-wide">
                                Selected Instruments ({items.length})
                            </div>
                            <div className="divide-y divide-stone-100">
                                {items.map((item) => (
                                    <div key={item.id} className="p-6 flex gap-4 md:gap-6 items-center group hover:bg-stone-50 transition-colors">
                                        {/* Image */}
                                        <div className="w-20 h-20 bg-stone-100 rounded-lg flex-shrink-0 overflow-hidden border border-stone-200">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs text-center p-1">No Image</div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow">
                                            <div className="text-xs text-brand-orange font-mono mb-1">{item.sku}</div>
                                            <h3 className="font-medium text-brand-charcoal">{item.name}</h3>
                                        </div>

                                        {/* Quantity & Remove */}
                                        <div className="flex flex-col md:flex-row items-center gap-4">
                                            <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:text-brand-orange"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:text-brand-orange"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-stone-400 hover:text-red-500 transition-colors p-2"
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submission Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-brand-orange sticky top-24">
                            <h2 className="text-xl font-medium mb-6">Contact Details</h2>
                            <form onSubmit={handleHookSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Full Name *</label>
                                    <input
                                        {...register('name')}
                                        className={`w-full p-3 border rounded-lg !outline-none !shadow-none focus:border-stone-400 transition-all ${errors.name ? 'border-red-400 bg-red-50/20' : 'bg-stone-50 border-stone-200'}`}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-600 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            {...register('email')}
                                            className={`w-full p-3 border rounded-lg !outline-none !shadow-none focus:border-stone-400 transition-all ${errors.email ? 'border-red-400 bg-red-50/20' : 'bg-stone-50 border-stone-200'}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-600 mb-1">Country</label>
                                        <input
                                            {...register('country')}
                                            className="w-full p-3 border bg-stone-50 border-stone-200 rounded-lg !outline-none !shadow-none focus:border-stone-400 transition-all"
                                            placeholder="e.g. USA"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Phone (Optional)</label>
                                    <input
                                        {...register('phone')}
                                        className="w-full p-3 border bg-stone-50 border-stone-200 rounded-lg !outline-none !shadow-none focus:border-stone-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Additional Notes</label>
                                    <textarea
                                        rows={3}
                                        {...register('message')}
                                        className="w-full p-3 border bg-stone-50 border-stone-200 rounded-lg !outline-none !shadow-none focus:border-stone-400 transition-all resize-none"
                                        placeholder="Any specific requirements?"
                                    />
                                </div>

                                <Button type="submit" variant="primary" className="w-full justify-center mt-4" disabled={sending}>
                                    {sending ? 'Sending Request...' : 'Submit Quote Request'}
                                </Button>
                                <p className="text-xs text-stone-400 text-center mt-4">
                                    We typically respond with a formal PDF quote within 24 hours.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
