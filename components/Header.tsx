import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PrefetchNavLink } from './PrefetchLink';
import { Menu, X, ShoppingCart, Search as SearchIcon, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useCart } from './CartProvider';
import { useCategoryNames } from '../lib/queries';
import { SearchOverlay } from './SearchOverlay';
import logoTransparent from '../assets/smith-logo-transparent.png';

const COMPANY_LINKS = [
    { to: '/about', label: 'About Us' },
    // { to: '/events', label: 'Events & Gallery' }, // Hidden until content is ready
    { to: '/distributor', label: 'Become a Distributor' },
    { to: '/blog', label: 'Blog' },
];

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const location = useLocation();
    const { cartCount } = useCart();
    const { data: categoryNames = [] } = useCategoryNames();
    const categories = categoryNames.slice(0, 8).map(name => ({ name }));

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    const isHome = location.pathname === '/';
    const isTransparent = isHome && !isScrolled;

    const navLinkClass = (isActive: boolean) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isTransparent
        ? (isActive ? 'text-white border-b border-brand-orange' : 'text-white/80 hover:text-white')
        : (isActive ? 'text-brand-charcoal border-b border-brand-orange' : 'text-stone-500 hover:text-brand-charcoal')
        }`;

    const dropdownLinkClass = (isActive: boolean) => `flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-300 ${isTransparent
        ? (isActive ? 'text-white border-b border-brand-orange' : 'text-white/80 hover:text-white')
        : (isActive ? 'text-brand-charcoal border-b border-brand-orange' : 'text-stone-500 hover:text-brand-charcoal')
        }`;

    // Check if any company route is active
    const isCompanyActive = ['/about', '/events', '/distributor', '/blog'].some(
        path => location.pathname.startsWith(path)
    );

    return (
        <>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 py-2 ${isTransparent
                ? 'bg-transparent border-b border-transparent'
                : 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-stone-200/50'
                }`}>
                <div className="container mx-auto px-6 flex items-center justify-between">

                    {/* Left: Logo */}
                    <div className="flex-1 flex items-center">
                        <NavLink to="/" className="flex items-center gap-3 group" aria-label="Smith Instruments home">
                            <div className="h-16 w-64 relative overflow-hidden flex items-center">
                                <img
                                    src={logoTransparent}
                                    alt="Smith Instruments"
                                    className={`w-full h-full object-contain transition-all duration-300 ${isTransparent
                                        ? 'brightness-0 invert'
                                        : ''
                                        }`}
                                />
                            </div>
                        </NavLink>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <PrefetchNavLink to="/" className={({ isActive }) => navLinkClass(isActive)}>
                            Home
                        </PrefetchNavLink>

                        {/* Products Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setIsProductsOpen(true)}
                            onMouseLeave={() => setIsProductsOpen(false)}
                            onFocusCapture={() => setIsProductsOpen(true)}
                            onBlurCapture={(event) => {
                                if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsProductsOpen(false);
                            }}
                        >
                            <PrefetchNavLink to="/products" aria-expanded={isProductsOpen} className={({ isActive }) => dropdownLinkClass(isActive)}>
                                Products <ChevronDown size={14} className={`transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
                            </PrefetchNavLink>

                            {/* Animated Dropdown */}
                            <div
                                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ease-out ${isProductsOpen
                                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                                    : 'opacity-0 -translate-y-2 pointer-events-none'
                                    }`}
                            >
                                <div className="w-56 bg-white/95 backdrop-blur-xl border border-stone-200/60 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-2 text-brand-charcoal">
                                    {categories.map((cat, idx) => (
                                        <NavLink
                                            key={cat.name}
                                            to={`/products/${encodeURIComponent(cat.name)}`}
                                            className="block px-4 py-2.5 hover:bg-stone-50 text-sm hover:text-brand-orange transition-colors"
                                            style={{
                                                transitionDelay: isProductsOpen ? `${idx * 30}ms` : '0ms',
                                                opacity: isProductsOpen ? 1 : 0,
                                                transform: isProductsOpen ? 'translateX(0)' : 'translateX(-8px)',
                                                transition: 'opacity 200ms ease-out, transform 200ms ease-out, color 150ms'
                                            }}
                                        >
                                            {cat.name}
                                        </NavLink>
                                    ))}
                                    <div className="border-t border-stone-100 mt-2 pt-2 px-4 pb-1">
                                        <NavLink to="/products" className="text-xs font-bold text-brand-orange uppercase tracking-widest hover:underline flex items-center justify-between">
                                            View All <ArrowRight size={12} />
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <PrefetchNavLink to="/catalogues" className={({ isActive }) => navLinkClass(isActive)}>
                            Catalogues
                        </PrefetchNavLink>

                        {/* Company Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setIsCompanyOpen(true)}
                            onMouseLeave={() => setIsCompanyOpen(false)}
                            onFocusCapture={() => setIsCompanyOpen(true)}
                            onBlurCapture={(event) => {
                                if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsCompanyOpen(false);
                            }}
                        >
                            <button className={dropdownLinkClass(isCompanyActive)} aria-expanded={isCompanyOpen}>
                                Company <ChevronDown size={14} className={`transition-transform duration-300 ${isCompanyOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Animated Dropdown */}
                            <div
                                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ease-out ${isCompanyOpen
                                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                                    : 'opacity-0 -translate-y-2 pointer-events-none'
                                    }`}
                            >
                                <div className="w-56 bg-white/95 backdrop-blur-xl border border-stone-200/60 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-2 text-brand-charcoal">
                                    {COMPANY_LINKS.map((link, idx) => (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            className={({ isActive }) => `block px-4 py-2.5 hover:bg-stone-50 text-sm transition-colors ${isActive ? 'text-brand-orange font-medium' : 'hover:text-brand-orange'}`}
                                            style={{
                                                transitionDelay: isCompanyOpen ? `${idx * 30}ms` : '0ms',
                                                opacity: isCompanyOpen ? 1 : 0,
                                                transform: isCompanyOpen ? 'translateX(0)' : 'translateX(-8px)',
                                                transition: 'opacity 200ms ease-out, transform 200ms ease-out, color 150ms'
                                            }}
                                        >
                                            {link.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <PrefetchNavLink to="/contact" className={({ isActive }) => navLinkClass(isActive)}>
                            Contact
                        </PrefetchNavLink>
                    </nav>

                    {/* Right: Icons */}
                    <div className="flex-1 flex items-center justify-end gap-2">

                        <div className="hidden md:block">
                            <LanguageSwitcher isTransparent={isTransparent} />
                        </div>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Open search"
                            className={`hidden md:block p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-brand-charcoal hover:bg-stone-100'
                                }`}
                        >
                            <SearchIcon size={20} />
                        </button>

                        <NavLink
                            to="/quote-cart"
                            aria-label={`Quote cart with ${cartCount} items`}
                            className={`hidden md:flex relative p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-brand-charcoal hover:bg-stone-100'
                                }`}
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Open search"
                            className={`md:hidden p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-brand-charcoal hover:bg-stone-100'
                                }`}
                        >
                            <SearchIcon size={20} />
                        </button>

                        <button
                            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMobileOpen}
                            className={`md:hidden focus:outline-none ${isTransparent ? 'text-white' : 'text-brand-charcoal'}`}
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                        >
                            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isMobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-visible bg-white/95 backdrop-blur-xl border-b border-stone-200/50 absolute top-full left-0 right-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                        >
                            <nav className="flex flex-col p-6 gap-4">
                                <NavLink to="/" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-heading ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-orange' : 'text-stone-500'}`}>Home</NavLink>

                                {/* Collapsible Products */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setIsProductsOpen(!isProductsOpen)}
                                        aria-expanded={isProductsOpen}
                                        className="w-full text-lg font-heading text-left text-stone-500 hover:text-brand-charcoal transition-colors flex items-center justify-between"
                                    >
                                        Products
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isProductsOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-4 border-l border-stone-200 ml-1 flex flex-col gap-2 pt-2">
                                                    <NavLink to="/products" onClick={() => setIsMobileOpen(false)} className="text-sm text-stone-400 hover:text-brand-orange transition-colors">
                                                        All Products
                                                    </NavLink>
                                                    {categories.slice(0, 6).map(cat => (
                                                        <NavLink key={cat.name} to={`/products/${encodeURIComponent(cat.name)}`} onClick={() => setIsMobileOpen(false)} className="text-sm text-stone-400 hover:text-brand-orange transition-colors">
                                                            {cat.name}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <NavLink to="/catalogues" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-heading ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-orange' : 'text-stone-500'}`}>Catalogues</NavLink>

                                {/* Collapsible Company */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                                        aria-expanded={isCompanyOpen}
                                        className={`w-full text-lg font-heading text-left transition-colors flex items-center justify-between ${isCompanyActive ? 'text-brand-charcoal' : 'text-stone-500 hover:text-brand-charcoal'}`}
                                    >
                                        Company
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${isCompanyOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isCompanyOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-4 border-l border-stone-200 ml-1 flex flex-col gap-2 pt-2">
                                                    {COMPANY_LINKS.map(link => (
                                                        <NavLink
                                                            key={link.to}
                                                            to={link.to}
                                                            onClick={() => setIsMobileOpen(false)}
                                                            className={({ isActive }) => `text-sm transition-colors ${isActive ? 'text-brand-orange font-medium' : 'text-stone-400 hover:text-brand-orange'}`}
                                                        >
                                                            {link.label}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <NavLink to="/contact" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-heading ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-orange' : 'text-stone-500'}`}>Contact</NavLink>

                                {/* Bottom section with Cart and Language */}
                                <div className="pt-4 mt-4 border-t border-stone-200">
                                    <div className="grid grid-cols-2 gap-4">


                                        <NavLink
                                            to="/quote-cart"
                                            onClick={() => setIsMobileOpen(false)}
                                            className="flex flex-col items-center gap-2 p-4 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors group"
                                        >
                                            <div className="relative">
                                                <ShoppingCart size={24} className="text-brand-charcoal group-hover:text-brand-orange transition-colors" />
                                                {cartCount > 0 && (
                                                    <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                                        {cartCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-stone-600 font-medium">Quote Cart</span>
                                        </NavLink>

                                        <div className="flex flex-col items-center justify-center gap-2 p-4 bg-stone-100 rounded-md">
                                            <LanguageSwitcher isTransparent={false} />
                                            <span className="text-xs text-stone-600 font-medium">Language</span>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};
