import React from 'react';
import { NavLink } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, CreditCard, Lock, MessageCircle } from 'lucide-react';
import logoTransparent from '../assets/smith instruments logo.png';
import { SOCIAL_LINKS, CONTACT_INFO } from '../constants';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-charcoal text-stone-300">
            {/* Pre-Footer CTA */}
            <div className="bg-stone-900 py-16 relative border-b border-stone-800">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <h2 className="font-heading text-3xl md:text-4xl text-white">Ready to elevate your practice?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-lg">
                            <a href={`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-md transition-colors border border-white/10">
                                <MessageCircle size={18} className="mr-2 text-green-400" />
                                Chat on WhatsApp
                            </a>
                            <a href={`mailto:${CONTACT_INFO.email}`} className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-md transition-colors border border-white/10">
                                <Mail size={18} className="mr-2 text-brand-orange" />
                                Send an Email
                            </a>
                        </div>
                    </div>
                    <div>
                        <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition-colors">
                            Get Your Quote
                            <ArrowRight size={18} className="ml-2" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="pt-16 pb-8">
                <div className="container mx-auto px-6">
                    {/* Main Footer Content - 4 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-700">

                        {/* Brand */}
                        <div className="space-y-5">
                            <div className="h-14 w-52 relative overflow-hidden">
                                <img
                                    src={logoTransparent}
                                    alt="Smith Instruments"
                                    className="w-full h-full object-contain brightness-0 invert opacity-90"
                                />
                            </div>
                            <p className="text-sm font-light leading-relaxed text-stone-400">
                                Precision engineered surgical instruments for the modern medical world.
                            </p>
                            <div className="flex gap-4">
                                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors">
                                    <Facebook size={18} />
                                </a>
                                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors">
                                    <Instagram size={18} />
                                </a>
                                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-5">Explore</h3>
                            <div className="flex flex-col gap-3">
                                <NavLink to="/" className="text-sm text-stone-400 hover:text-white transition-colors">Home</NavLink>
                                <NavLink to="/products" className="text-sm text-stone-400 hover:text-white transition-colors">Products</NavLink>
                                <NavLink to="/catalogues" className="text-sm text-stone-400 hover:text-white transition-colors">Catalogues</NavLink>
                                <NavLink to="/contact" className="text-sm text-stone-400 hover:text-white transition-colors">Contact</NavLink>
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-5">Company</h3>
                            <div className="flex flex-col gap-3">
                                <NavLink to="/about" className="text-sm text-stone-400 hover:text-white transition-colors">About Us</NavLink>
                                <NavLink to="/events" className="text-sm text-stone-400 hover:text-white transition-colors">Events & Gallery</NavLink>
                                <NavLink to="/distributor" className="text-sm text-stone-400 hover:text-white transition-colors">Become a Distributor</NavLink>
                                <NavLink to="/blog" className="text-sm text-stone-400 hover:text-white transition-colors">Blog</NavLink>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-5">Contact</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail size={14} className="text-brand-orange flex-shrink-0" />
                                    <span className="text-sm text-stone-400">{CONTACT_INFO.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={14} className="text-brand-orange flex-shrink-0" />
                                    <span className="text-sm text-stone-400">{CONTACT_INFO.phone}</span>
                                </div>
                                {CONTACT_INFO.locations.map((loc, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <MapPin size={14} className="text-brand-orange flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-stone-400">
                                            <strong>{loc.type}:</strong><br />
                                            {loc.address}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-stone-800 text-stone-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} Smith Instruments. All rights reserved.</p>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <div className="flex items-center gap-2">
                                <Lock size={14} className="text-stone-400" />
                                <span className="text-xs">SSL Secure Payment</span>
                            </div>
                            <div className="flex gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                                {/* Simple generic credit card icon to represent payment methods */}
                                <CreditCard size={20} />
                                <span className="font-bold text-xs tracking-widest border border-stone-600 px-1 rounded">VISA</span>
                                <span className="font-bold text-xs tracking-widest border border-stone-600 px-1 rounded">MC</span>
                            </div>
                            <div className="flex gap-4">
                                <NavLink to="/privacy-policy" className="hover:text-brand-orange transition-colors">Privacy Policy</NavLink>
                                <NavLink to="/terms-of-service" className="hover:text-brand-orange transition-colors">Terms of Service</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
