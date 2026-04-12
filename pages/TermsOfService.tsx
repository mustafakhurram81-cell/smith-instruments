import React from 'react';
import { Section, FadeIn } from '../components/Shared';
import { SEO } from '../components/SEO';
import { FileText, Scale, AlertTriangle, Package, RefreshCw, Gavel } from 'lucide-react';

export const TermsOfService: React.FC = () => {
    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title="Terms of Service"
                description="Smith Instruments Terms of Service - Terms and conditions for using our website and purchasing our products."
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-16 md:py-24">
                <div className="container mx-auto px-6 text-center">
                    <FadeIn>
                        <FileText className="w-16 h-16 text-brand-orange mx-auto mb-6" />
                        <h1 className="font-heading text-4xl md:text-6xl mb-4">Terms of Service</h1>
                        <p className="text-stone-400 font-light">Last updated: December 2024</p>
                    </FadeIn>
                </div>
            </div>

            <Section className="bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-lg max-w-none">
                        <FadeIn>
                            <div className="space-y-12">
                                {/* Acceptance */}
                                <div>
                                    <h2 className="font-heading text-2xl text-brand-charcoal mb-4 flex items-center gap-3">
                                        <Scale className="text-brand-orange" size={24} />
                                        Acceptance of Terms
                                    </h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        By accessing and using the Smith Instruments website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
                                    </p>
                                </div>

                                {/* Products & Services */}
                                <div>
                                    <h2 className="font-heading text-2xl text-brand-charcoal mb-4 flex items-center gap-3">
                                        <Package className="text-brand-orange" size={24} />
                                        Products & Services
                                    </h2>
                                    <div className="space-y-4 text-stone-600">
                                        <p>
                                            Smith Instruments manufactures and sells precision surgical instruments. All products are designed for use by qualified medical professionals only.
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Product images are for illustration purposes; actual products may vary slightly</li>
                                            <li>Specifications are subject to change without notice</li>
                                            <li>Prices are provided upon request and are valid for 30 days from quote date</li>
                                            <li>Custom orders may require additional lead time</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Payment Terms */}
                                <div>
                                    <h2 className="font-heading text-2xl text-brand-charcoal mb-4">Payment Terms</h2>
                                    <div className="bg-brand-orange/10 p-6 rounded-lg border border-brand-orange/30">
                                        <p className="text-brand-charcoal font-medium mb-2">Our Unique Trust Model:</p>
                                        <p className="text-stone-600">
                                            Payment is due only after you have received and inspected your order. If the products do not meet your expectations, you may return them at no cost within 14 days.
                                        </p>
                                    </div>
                                </div>

                                {/* Returns & Refunds */}
                                <div>
                                    <h2 className="font-heading text-2xl text-brand-charcoal mb-4 flex items-center gap-3">
                                        <RefreshCw className="text-brand-orange" size={24} />
                                        Returns & Refunds
                                    </h2>
                                    <ul className="list-disc list-inside space-y-2 ml-4 text-stone-600">
                                        <li>Returns accepted within 14 days of delivery</li>
                                        <li>Products must be unused and in original packaging</li>
                                        <li>Custom/OEM products are non-returnable unless defective</li>
                                        <li>Shipping costs for returns are the buyer's responsibility unless due to our error</li>
                                        <li>Refunds processed within 7 business days of receiving returned goods</li>
                                    </ul>
                                </div>

                                {/* Warranty */}
                                <div>
                                    <h2 className="font-heading text-2xl text-brand-charcoal mb-4">Warranty</h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        All Smith Instruments products come with a 1-year warranty against manufacturing defects. This warranty does not cover:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4 text-stone-600 mt-4">
                                        <li>Normal wear and tear</li>
                                        <li>Damage from misuse or improper sterilization</li>
                                        <li>Modifications made by the customer</li>
                                        <li>Damage during shipping (covered separately by shipping insurance)</li>
                                    </ul>
                                </div>

                                {/* Limitation of Liability */}
                                <div>
                                    <h2 className="font-heading text-2xl text-brand-charcoal mb-4 flex items-center gap-3">
                                        <AlertTriangle className="text-brand-orange" size={24} />
                                        Limitation of Liability
                                    </h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        Smith Instruments shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products. Our liability is limited to the purchase price of the defective product.
                                    </p>
                                </div>

                                {/* Governing Law */}
                                <div>
                                    <h2 className="font-heading text-2xl text-brand-charcoal mb-4 flex items-center gap-3">
                                        <Gavel className="text-brand-orange" size={24} />
                                        Governing Law
                                    </h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        These Terms of Service shall be governed by and construed in accordance with the laws of the United States of America. Any disputes shall be resolved through arbitration in New York, NY.
                                    </p>
                                </div>

                                {/* Changes */}
                                <div>
                                    <h2 className="font-heading text-2xl text-brand-charcoal mb-4">Changes to Terms</h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of the updated terms.
                                    </p>
                                </div>

                                {/* Contact */}
                                <div className="bg-stone-50 p-8 rounded-lg border border-stone-200">
                                    <h2 className="font-heading text-2xl text-brand-charcoal mb-4">Questions?</h2>
                                    <p className="text-stone-600">
                                        If you have questions about these Terms of Service, please contact us at:
                                    </p>
                                    <div className="mt-4 text-brand-charcoal font-medium">
                                        <p>Email: legal@smithinstruments.net</p>
                                        <p>Phone: +92 330 2449855</p>
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
