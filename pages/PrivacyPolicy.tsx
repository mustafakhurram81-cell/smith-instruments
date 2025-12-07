import React from 'react';
import { Section, FadeIn } from '../components/Shared';
import { SEO } from '../components/SEO';
import { Shield, Eye, Database, Lock, Mail, Clock } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            <SEO
                title="Privacy Policy"
                description="Smith Instruments Privacy Policy - How we collect, use, and protect your personal information."
            />

            {/* Header */}
            <div className="bg-brand-charcoal text-white py-16 md:py-24">
                <div className="container mx-auto px-6 text-center">
                    <FadeIn>
                        <Shield className="w-16 h-16 text-brand-gold mx-auto mb-6" />
                        <h1 className="font-serif text-4xl md:text-6xl mb-4">Privacy Policy</h1>
                        <p className="text-stone-400 font-light">Last updated: December 2024</p>
                    </FadeIn>
                </div>
            </div>

            <Section className="bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-lg max-w-none">
                        <FadeIn>
                            <div className="space-y-12">
                                {/* Introduction */}
                                <div>
                                    <h2 className="font-serif text-2xl text-brand-charcoal mb-4 flex items-center gap-3">
                                        <Eye className="text-brand-gold" size={24} />
                                        Introduction
                                    </h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        Smith Instruments ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                                    </p>
                                </div>

                                {/* Information We Collect */}
                                <div>
                                    <h2 className="font-serif text-2xl text-brand-charcoal mb-4 flex items-center gap-3">
                                        <Database className="text-brand-gold" size={24} />
                                        Information We Collect
                                    </h2>
                                    <div className="space-y-4 text-stone-600">
                                        <p><strong className="text-brand-charcoal">Personal Information:</strong></p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Name and contact information (email, phone number)</li>
                                            <li>Company or clinic name</li>
                                            <li>Shipping and billing addresses</li>
                                            <li>Product inquiries and quote requests</li>
                                        </ul>
                                        <p className="mt-4"><strong className="text-brand-charcoal">Automatically Collected Information:</strong></p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Browser type and version</li>
                                            <li>Operating system</li>
                                            <li>Pages visited and time spent</li>
                                            <li>Referring website addresses</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* How We Use Your Information */}
                                <div>
                                    <h2 className="font-serif text-2xl text-brand-charcoal mb-4 flex items-center gap-3">
                                        <Lock className="text-brand-gold" size={24} />
                                        How We Use Your Information
                                    </h2>
                                    <ul className="list-disc list-inside space-y-2 ml-4 text-stone-600">
                                        <li>To respond to your inquiries and fulfill quote requests</li>
                                        <li>To process and ship orders</li>
                                        <li>To send you product updates and marketing communications (with your consent)</li>
                                        <li>To improve our website and services</li>
                                        <li>To comply with legal obligations</li>
                                    </ul>
                                </div>

                                {/* Data Sharing */}
                                <div>
                                    <h2 className="font-serif text-2xl text-brand-charcoal mb-4">Data Sharing</h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        We do not sell, trade, or rent your personal information to third parties. We may share your information only with:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4 text-stone-600 mt-4">
                                        <li>Shipping carriers to deliver your orders</li>
                                        <li>Payment processors for secure transactions</li>
                                        <li>Service providers who assist in our operations</li>
                                        <li>Legal authorities when required by law</li>
                                    </ul>
                                </div>

                                {/* Data Security */}
                                <div>
                                    <h2 className="font-serif text-2xl text-brand-charcoal mb-4">Data Security</h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                                    </p>
                                </div>

                                {/* Your Rights */}
                                <div>
                                    <h2 className="font-serif text-2xl text-brand-charcoal mb-4">Your Rights</h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        You have the right to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4 text-stone-600 mt-4">
                                        <li>Access the personal data we hold about you</li>
                                        <li>Request correction of inaccurate data</li>
                                        <li>Request deletion of your data</li>
                                        <li>Opt-out of marketing communications</li>
                                    </ul>
                                </div>

                                {/* Contact */}
                                <div className="bg-stone-50 p-8 rounded-lg border border-stone-200">
                                    <h2 className="font-serif text-2xl text-brand-charcoal mb-4 flex items-center gap-3">
                                        <Mail className="text-brand-gold" size={24} />
                                        Contact Us
                                    </h2>
                                    <p className="text-stone-600">
                                        If you have questions about this Privacy Policy, please contact us at:
                                    </p>
                                    <div className="mt-4 text-brand-charcoal font-medium">
                                        <p>Email: privacy@smithinstruments.com</p>
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
