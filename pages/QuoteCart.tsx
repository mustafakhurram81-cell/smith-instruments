import React, { useState } from 'react';
import { useCart } from '../components/CartProvider';
import { Section, Button, FadeIn } from '../components/Shared';
import { Trash2, Plus, Minus, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { SEO } from '../components/SEO';

export const QuoteCart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, clearCart } = useCart();
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        // Prepare the product list string
        const productList = items.map(i => `• ${i.sku} - ${i.name} (Qty: ${i.quantity})`).join('\n');

        // Combine message with product list for safety
        const fullMessage = `${formData.message}\n\n--- Requested Items ---\n${productList}`;

        const templateParams = {
            to_name: "Smith Instruments Sales",
            user_name: formData.name,       // Matches Contact.tsx name="user_name"
            user_email: formData.email,     // Matches Contact.tsx name="user_email"
            interest: "Quote Request",      // Matches Contact.tsx name="interest"
            company: formData.company,
            phone: formData.phone,
            message: fullMessage,           // Combined message
            reply_to: formData.email
        };

        try {
            await emailjs.send(
                'service_dzj0fa2', // Service ID from Contact.tsx
                'template_3kqu18e', // Template ID from Contact.tsx
                templateParams,
                'JVcDcowpyoY1HnUQO'  // Public Key from Contact.tsx
            );
            setSuccess(true);
            clearCart();
        } catch (error) {
            console.error('Failed to send quote', error);
            alert('Failed to send request. Please email us directly at sales@smithsurgical.uk');
        }
        setSending(false);
    };

    if (items.length === 0 && !success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20">
                <SEO title="Quote Cart" description="Review your selected surgical instruments." />
                <h1 className="text-3xl font-serif text-brand-charcoal mb-4">Your Quote Cart is Empty</h1>
                <p className="text-stone-500 mb-8">Browse our catalogue to add instruments.</p>
                <Link to="/products">
                    <Button variant="primary">
                        Browse Products <ArrowRight size={18} className="ml-2" />
                    </Button>
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 text-center px-4">
                <SEO title="Quote Sent" />
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Send size={32} />
                </div>
                <h1 className="text-3xl font-serif text-brand-charcoal mb-4">Quote Request Sent!</h1>
                <p className="text-stone-500 max-w-md mx-auto mb-8">
                    Thank you, {formData.name}. We have received your request for {items.length > 0 ? items.length : 'your'} items.
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
                <h1 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-2">Request a Quote</h1>
                <Link to="/products" className="text-brand-gold hover:underline text-sm mb-8 inline-block flex items-center">
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
                                            <div className="text-xs text-brand-gold font-mono mb-1">{item.sku}</div>
                                            <h3 className="font-medium text-brand-charcoal">{item.name}</h3>
                                        </div>

                                        {/* Quantity & Remove */}
                                        <div className="flex flex-col md:flex-row items-center gap-4">
                                            <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:text-brand-gold"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:text-brand-gold"
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
                        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-brand-gold sticky top-24">
                            <h2 className="text-xl font-medium mb-6">Contact Details</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Full Name *</label>
                                    <input
                                        required
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Clinic / Company</label>
                                    <input
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Phone (Optional)</label>
                                    <input
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Additional Notes</label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
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
