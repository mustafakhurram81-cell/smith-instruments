import React from 'react';
import { NavLink } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logoTransparent from '../assets/Gemini_Generated_Image_zhuph7zhuph7zhup-removebg-preview.png';
import { SOCIAL_LINKS, CONTACT_INFO } from '../constants';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-charcoal text-stone-300 pt-16 pb-8">
            <div className="container mx-auto px-6">
                {/* Main Footer Content - 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-stone-700">

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
                        <div className="flex gap-3">
                            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-700 hover:bg-brand-gold flex items-center justify-center transition-colors">
                                <Facebook size={16} />
                            </a>
                            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-700 hover:bg-brand-gold flex items-center justify-center transition-colors">
                                <Instagram size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links - Two Columns */}
                    <div>
                        <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-5">Explore</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            <NavLink to="/" className="text-sm text-stone-400 hover:text-white transition-colors">Home</NavLink>
                            <NavLink to="/about" className="text-sm text-stone-400 hover:text-white transition-colors">About Us</NavLink>
                            <NavLink to="/products" className="text-sm text-stone-400 hover:text-white transition-colors">Products</NavLink>
                            <NavLink to="/blog" className="text-sm text-stone-400 hover:text-white transition-colors">Blog</NavLink>
                            <NavLink to="/catalogues" className="text-sm text-stone-400 hover:text-white transition-colors">Catalogues</NavLink>
                            <NavLink to="/contact" className="text-sm text-stone-400 hover:text-white transition-colors">Contact</NavLink>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-5">Contact</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail size={14} className="text-brand-gold flex-shrink-0" />
                                <span className="text-sm text-stone-400">{CONTACT_INFO.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={14} className="text-brand-gold flex-shrink-0" />
                                <span className="text-sm text-stone-400">{CONTACT_INFO.phone}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={14} className="text-brand-gold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-stone-400">{CONTACT_INFO.address.replace(', ', ',<br />')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Bar with Legal Links */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-stone-500">
                        © {new Date().getFullYear()} Smith Instruments. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-stone-500">
                        <NavLink to="/privacy-policy" className="hover:text-stone-300 transition-colors">Privacy Policy</NavLink>
                        <NavLink to="/terms-of-service" className="hover:text-stone-300 transition-colors">Terms of Service</NavLink>
                    </div>
                </div>
            </div>
        </footer>
    );
};
