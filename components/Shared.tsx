import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Mail, Phone, MapPin, ArrowRight, ShoppingCart, Search as SearchIcon, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from './LanguageSwitcher';
import { searchProducts, Product } from '../lib/database';
import { useCart } from './CartProvider';
import { useCategoryDetails } from '../lib/queries';
import logoFull from '../assets/smith-logo-full.jpg';

// Re-export UI components for backwards compatibility
export { Button } from './ui/Button';
export { FadeIn } from './ui/FadeIn';
export { Section } from './ui/Section';
export { AnimatedCounter } from './ui/AnimatedCounter';
export { WhatsAppFloat } from './ui/WhatsAppFloat';
export { ScrollToTop } from './ui/ScrollToTop';

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

  const handleSelect = (id: string) => {
    navigate(`/product/${id}`);
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
                      onClick={() => handleSelect(prod.id)}
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
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { data: categoryData = [] } = useCategoryDetails();
  const categories = categoryData.slice(0, 8);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled || !isHome ? 'bg-stone-50/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="h-12 w-32 relative overflow-hidden">
                <img
                  src={logoFull}
                  alt="Smith Instruments"
                  className={`w-full h-full object-contain transition-all duration-500 ${isScrolled || !isHome ? 'filter-none' : 'filter invert mix-blend-screen opacity-90'}`}
                />
              </div>
            </div>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isScrolled || !isHome ? (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal') : (isActive ? 'text-white border-b border-white' : 'text-stone-200 hover:text-white')}`}>
              Home
            </NavLink>

            <div className="relative group">
              <NavLink to="/products" className={({ isActive }) => `flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-300 ${isScrolled || !isHome ? (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal') : (isActive ? 'text-white border-b border-white' : 'text-stone-200 hover:text-white')}`}>
                Products <ChevronDown size={14} />
              </NavLink>
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

            <NavLink to="/catalogues" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isScrolled || !isHome ? (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal') : (isActive ? 'text-white border-b border-white' : 'text-stone-200 hover:text-white')}`}>
              Catalogues
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isScrolled || !isHome ? (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal') : (isActive ? 'text-white border-b border-white' : 'text-stone-200 hover:text-white')}`}>
              About Us
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isScrolled || !isHome ? (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal') : (isActive ? 'text-white border-b border-white' : 'text-stone-200 hover:text-white')}`}>
              Blog
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 ${isScrolled || !isHome ? (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal') : (isActive ? 'text-white border-b border-white' : 'text-stone-200 hover:text-white')}`}>
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 rounded-full hover:bg-black/5 transition-colors ${isScrolled || !isHome ? 'text-brand-charcoal' : 'text-white hover:bg-white/10'}`}
            >
              <SearchIcon size={20} />
            </button>

            <NavLink
              to="/quote-cart"
              className={`relative p-2 rounded-full hover:bg-black/5 transition-colors ${isScrolled || !isHome ? 'text-brand-charcoal' : 'text-white hover:bg-white/10'}`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-charcoal text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <button
              className={`md:hidden focus:outline-none ${isScrolled || !isHome ? 'text-brand-charcoal' : 'text-white'}`}
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
              className="md:hidden overflow-hidden bg-stone-50 border-b border-stone-200 absolute top-full left-0 right-0 shadow-lg"
            >
              <nav className="flex flex-col p-6 gap-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-white border border-stone-200 rounded-full py-3 px-5 pl-12 text-sm outline-none focus:border-brand-gold"
                    onClick={() => { setIsMobileOpen(false); setIsSearchOpen(true); }}
                    readOnly
                  />
                  <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>

                <NavLink to="/" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>Home</NavLink>
                <NavLink to="/quote-cart" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif flex items-center justify-between ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>
                  Request Quote
                  {cartCount > 0 && <span className="bg-brand-gold text-brand-charcoal text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
                </NavLink>

                <div className="space-y-2">
                  <NavLink to="/products" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>Products</NavLink>
                  <div className="pl-4 border-l border-stone-200 ml-1 flex flex-col gap-2">
                    {categories.slice(0, 6).map(cat => (
                      <NavLink key={cat.name} to={`/products/${encodeURIComponent(cat.name)}`} onClick={() => setIsMobileOpen(false)} className="text-sm text-stone-400">
                        {cat.name}
                      </NavLink>
                    ))}
                  </div>
                </div>

                <NavLink to="/catalogues" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>Catalogues</NavLink>
                <NavLink to="/about" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>About Us</NavLink>
                <NavLink to="/blog" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>Blog</NavLink>
                <NavLink to="/contact" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`}>Contact</NavLink>
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
    <footer className="bg-brand-charcoal text-stone-300 pt-20 pb-10 border-t border-stone-800">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-stone-800 pb-16">

        {/* Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-32 relative overflow-hidden">
              <img
                src={logoFull}
                alt="Smith Instruments"
                className="w-full h-full object-contain filter invert mix-blend-screen opacity-90"
              />
            </div>
          </div>
          <p className="text-sm font-light leading-relaxed max-w-xs text-stone-400">
            Molding the metal to serve life. Precision engineered surgical instruments for the modern medical world.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/smithinstrumentsusa" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors"><Facebook size={20} /></a>
            <a href="https://www.instagram.com/smithinstruments/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors"><Instagram size={20} /></a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-serif text-lg mb-2">Explore</h3>
          <NavLink to="/" className="hover:text-white transition-colors text-sm">Home</NavLink>
          <NavLink to="/products" className="hover:text-white transition-colors text-sm">Products</NavLink>
          <NavLink to="/catalogues" className="hover:text-white transition-colors text-sm">Catalogues</NavLink>
          <NavLink to="/about" className="hover:text-white transition-colors text-sm">About Us</NavLink>
          <NavLink to="/blog" className="hover:text-white transition-colors text-sm">Blog</NavLink>
          <NavLink to="/contact" className="hover:text-white transition-colors text-sm">Contact</NavLink>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-white font-serif text-lg mb-2">Connect</h3>
          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-1 text-brand-gold" />
            <span className="text-sm">sales@smithinstruments.com</span>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={16} className="mt-1 text-brand-gold" />
            <span className="text-sm">+92 330 2449855</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-1 text-brand-gold" />
            <span className="text-sm">123 Medical Park Blvd,<br />New York, NY 10012, USA</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
        <p>&copy; {new Date().getFullYear()} Smith Instruments. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <NavLink to="/privacy-policy" className="hover:text-stone-300">Privacy Policy</NavLink>
          <NavLink to="/terms-of-service" className="hover:text-stone-300">Terms of Service</NavLink>
        </div>
      </div>
    </footer>
  );
};