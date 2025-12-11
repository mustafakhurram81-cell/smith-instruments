import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { PrefetchNavLink } from './PrefetchLink';
import { Menu, X, Facebook, Instagram, Mail, Phone, MapPin, ArrowRight, ShoppingCart, Search as SearchIcon, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from './LanguageSwitcher';
import { searchProducts, Product } from '../lib/database';
import { useCart } from './CartProvider';
import { useCategoryNames } from '../lib/queries';
import logoTransparent from '../assets/Gemini_Generated_Image_zhuph7zhuph7zhup-removebg-preview.png';

// Re-export UI components for backwards compatibility
export { Button } from './ui/Button';
export { FadeIn } from './ui/FadeIn';
export { Section } from './ui/Section';
export { AnimatedCounter } from './ui/AnimatedCounter';
export { WhatsAppFloat } from './ui/WhatsAppFloat';
export { ScrollToTop } from './ui/ScrollToTop';
export { Pagination } from './ui/Pagination';
export { ParallaxHeader } from './ui/ParallaxHeader';

// --- SEARCH OVERLAY ---
export const SearchOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const doSearch = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const found = await searchProducts(query);
        setResults(found);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    const timeout = setTimeout(doSearch, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (sku: string) => {
    navigate(`/product/${encodeURIComponent(sku)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white w-full max-w-3xl mx-auto mt-20 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-100 flex items-center gap-4">
              <SearchIcon className="text-stone-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for instruments (e.g., 'Iris Scissors', '10-105-02')..."
                className="flex-1 text-lg outline-none text-brand-charcoal placeholder-stone-300 font-serif"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                <X className="text-stone-400" size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-brand-gold" />
                </div>
              ) : results.length > 0 ? (
                <div className="grid gap-2">
                  {results.map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelect(prod.sku)}
                      className="flex items-center gap-4 p-3 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="w-12 h-12 bg-stone-200 rounded-md overflow-hidden flex-shrink-0 border border-stone-200">
                        {prod.image_url ? (
                          <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">IMG</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors">{prod.name}</h4>
                        <p className="text-xs text-stone-500 font-mono">{prod.sku}</p>
                      </div>
                      <ArrowRight className="ml-auto text-stone-300 group-hover:text-brand-gold opacity-0 group-hover:opacity-100 transition-all" size={16} />
                    </div>
                  ))}
                </div>
              ) : query.length > 1 ? (
                <div className="text-center py-8 text-stone-400">
                  No products found for "{query}"
                </div>
              ) : (
                <div className="text-center py-12 text-stone-300">
                  Type to search our catalog...
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- HEADER ---
export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false); // For mobile products dropdown
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { data: categoryNames = [] } = useCategoryNames();
  // Map strings to objects for compatibility with existing code
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

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {/* Search Overlay End */}

      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 py-4 ${isTransparent
        ? 'bg-transparent'
        : 'bg-white/95 backdrop-blur-md shadow-sm'
        }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="h-12 w-48 relative overflow-hidden flex items-center">
                <img
                  src={logoTransparent}
                  alt="Smith Instruments"
                  className={`w-full h-full object-contain transition-all duration-300 ${isTransparent
                    ? 'brightness-0 invert'
                    : ''
                    }`}
                />
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <PrefetchNavLink to="/" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isTransparent
              ? (isActive ? 'text-white border-b border-brand-gold' : 'text-white/80 hover:text-white')
              : (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal')
              }`}>
              Home
            </PrefetchNavLink>

            <div className="relative group">
              <PrefetchNavLink to="/products" className={({ isActive }) => `flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-300 ${isTransparent
                ? (isActive ? 'text-white border-b border-brand-gold' : 'text-white/80 hover:text-white')
                : (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal')
                }`}>
                Products <ChevronDown size={14} />
              </PrefetchNavLink>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0 text-brand-charcoal border border-stone-100">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-stone-100"></div>
                {categories.map(cat => (
                  <NavLink key={cat.name} to={`/products/${encodeURIComponent(cat.name)}`} className="block px-4 py-2 hover:bg-stone-50 text-sm hover:text-brand-gold transition-colors flex justify-between items-center group/item">
                    {cat.name}
                    <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-brand-gold" />
                  </NavLink>
                ))}
                <div className="border-t border-stone-100 mt-2 pt-2 px-4 pb-1">
                  <NavLink to="/products" className="text-xs font-bold text-brand-gold uppercase tracking-widest hover:underline flex items-center justify-between">
                    View All <ArrowRight size={12} />
                  </NavLink>
                </div>
              </div>
            </div>

            <PrefetchNavLink to="/catalogues" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isTransparent
              ? (isActive ? 'text-white border-b border-brand-gold' : 'text-white/80 hover:text-white')
              : (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal')
              }`}>
              Catalogues
            </PrefetchNavLink>
            <PrefetchNavLink to="/about" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isTransparent
              ? (isActive ? 'text-white border-b border-brand-gold' : 'text-white/80 hover:text-white')
              : (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal')
              }`}>
              About Us
            </PrefetchNavLink>
            <PrefetchNavLink to="/blog" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isTransparent
              ? (isActive ? 'text-white border-b border-brand-gold' : 'text-white/80 hover:text-white')
              : (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal')
              }`}>
              Blog
            </PrefetchNavLink>
            <PrefetchNavLink to="/contact" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isTransparent
              ? (isActive ? 'text-white border-b border-brand-gold' : 'text-white/80 hover:text-white')
              : (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal')
              }`}>
              Contact
            </PrefetchNavLink>
          </nav>

          <div className="flex items-center gap-2">
            {/* Hide language switcher on mobile, show on desktop */}
            <div className="hidden md:block">
              <LanguageSwitcher isTransparent={isTransparent} />
            </div>

            {/* Hide search on mobile, show on desktop */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`hidden md:block p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-brand-charcoal hover:bg-stone-100'
                }`}
            >
              <SearchIcon size={20} />
            </button>

            {/* Cart - desktop only */}
            <NavLink
              to="/quote-cart"
              className={`hidden md:flex relative p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-brand-charcoal hover:bg-stone-100'
                }`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-charcoal text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Search - mobile only, opens search overlay */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`md:hidden p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-brand-charcoal hover:bg-stone-100'
                }`}
            >
              <SearchIcon size={20} />
            </button>

            <button
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
              className="md:hidden overflow-visible bg-stone-50 border-b border-stone-200 absolute top-full left-0 right-0 shadow-lg"
            >
              <nav className="flex flex-col p-6 gap-4">
                <NavLink to="/" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>Home</NavLink>

                {/* Collapsible Products with Animation */}
                <div className="space-y-2">
                  <button
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="w-full text-lg font-serif text-left text-stone-500 hover:text-brand-charcoal transition-colors flex items-center justify-between"
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
                          <NavLink to="/products" onClick={() => setIsMobileOpen(false)} className="text-sm text-stone-400 hover:text-brand-gold transition-colors">
                            All Products
                          </NavLink>
                          {categories.slice(0, 6).map(cat => (
                            <NavLink key={cat.name} to={`/products/${encodeURIComponent(cat.name)}`} onClick={() => setIsMobileOpen(false)} className="text-sm text-stone-400 hover:text-brand-gold transition-colors">
                              {cat.name}
                            </NavLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink to="/catalogues" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>Catalogues</NavLink>
                <NavLink to="/about" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>About Us</NavLink>
                <NavLink to="/blog" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>Blog</NavLink>
                <NavLink to="/contact" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>Contact</NavLink>

                {/* Bottom section with Cart and Language */}
                <div className="pt-4 mt-4 border-t border-stone-200">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Cart */}
                    <NavLink
                      to="/quote-cart"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex flex-col items-center gap-2 p-4 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors group"
                    >
                      <div className="relative">
                        <ShoppingCart size={24} className="text-brand-charcoal group-hover:text-brand-gold transition-colors" />
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-charcoal text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                            {cartCount}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-600 font-medium">Quote Cart</span>
                    </NavLink>

                    {/* Language */}
                    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-stone-100 rounded-lg">
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
// --- FOOTER ---
export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-charcoal text-stone-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Main Footer Content - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-stone-700">

          {/* Brand */}
          <div className="space-y-5">
            <div className="h-10 w-36 relative overflow-hidden">
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
              <a href="https://www.facebook.com/smithinstrumentsusa" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-700 hover:bg-brand-gold flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://www.instagram.com/smithinstruments/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-700 hover:bg-brand-gold flex items-center justify-center transition-colors">
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
                <span className="text-sm text-stone-400">sales@smithinstruments.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-brand-gold flex-shrink-0" />
                <span className="text-sm text-stone-400">+92 330 2449855</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm text-stone-400">123 Medical Park Blvd,<br />New York, NY 10012, USA</span>
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