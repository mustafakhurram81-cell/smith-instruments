import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Mail, Phone, MapPin, ArrowRight, MessageCircle, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence, useInView, animate, useScroll, useAnimation } from 'framer-motion';

// --- ANIMATED COUNTER ---
export const AnimatedCounter: React.FC<{ from?: number; to: number; duration?: number }> = ({ from = 0, to, duration = 2 }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    const node = nodeRef.current;

    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate(value) {
        if (node) node.textContent = Math.round(value).toString();
      },
    });

    return () => controls.stop();
  }, [from, to, duration, isInView]);

  return <span ref={nodeRef}>{from}</span>;
};

// --- SCROLL TO TOP ---
export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-40 w-12 h-12 bg-brand-charcoal text-brand-gold border border-brand-gold rounded-full shadow-lg flex items-center justify-center hover:bg-brand-gold hover:text-brand-charcoal transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed rounded-full";

  const variants = {
    // Primary: Gold BG, Charcoal Text (Luxury Standard)
    primary: "bg-brand-gold text-brand-charcoal hover:bg-stone-200 hover:shadow-md shadow-sm border border-transparent",
    // Secondary: Charcoal BG, Gold Text (High Contrast Premium)
    secondary: "bg-brand-charcoal text-brand-gold hover:bg-stone-800 hover:shadow-md shadow-sm border border-transparent",
    outline: "bg-transparent text-brand-charcoal border border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-gold",
    text: "bg-transparent text-brand-charcoal hover:text-stone-600 underline-offset-4 hover:underline padding-0 rounded-none",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- WHATSAPP FLOAT ---
export const WhatsAppFloat: React.FC = () => {
  return (
    <motion.a
      href="https://wa.me/923302449855?text=Hi,%20I'm%20interested%20in%20Smith%20Instruments%20products"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={28} fill="white" />
    </motion.a>
  );
};

// --- HEADER ---
export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Catalogues', path: '/catalogues' },
    { label: 'About Us', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  // Check if current page is Home to determine initial header transparency interaction
  const isHome = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled || !isHome ? 'bg-stone-50/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="h-12 w-32 relative overflow-hidden">
            <img
              src="/smith-logo-full.jpg"
              alt="Smith Instruments"
              className={`w-full h-full object-contain transition-all duration-500 ${isScrolled || !isHome ? 'filter-none' : 'filter invert mix-blend-screen opacity-90'}`}
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors duration-300 ${isScrolled || !isHome
                  ? (isActive ? 'text-brand-charcoal border-b border-brand-gold' : 'text-stone-500 hover:text-brand-charcoal')
                  : (isActive ? 'text-white border-b border-white' : 'text-stone-200 hover:text-white')
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant={isScrolled || !isHome ? 'secondary' : 'primary'}
            className="hidden md:inline-flex text-xs uppercase tracking-widest px-6"
            onClick={() => navigate('/contact')}
          >
            Get Quote
          </Button>
          <button
            className={`md:hidden focus:outline-none ${isScrolled || !isHome ? 'text-brand-charcoal' : 'text-white'}`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-stone-50 border-b border-stone-200 absolute top-full left-0 right-0 shadow-lg"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-lg font-serif ${isActive ? 'text-brand-charcoal pl-2 border-l-2 border-brand-gold' : 'text-stone-500'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Button variant="secondary" onClick={() => navigate('/contact')} className="w-full mt-4">Get Quote</Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
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
                src="/smith-logo-full.jpg"
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
          <NavLink to="/catalogues" className="hover:text-white transition-colors text-sm">Catalogues</NavLink>
          <NavLink to="/about" className="hover:text-white transition-colors text-sm">About Us</NavLink>
          <NavLink to="/blog" className="hover:text-white transition-colors text-sm">Blog</NavLink>
          <NavLink to="/contact" className="hover:text-white transition-colors text-sm">Contact & Support</NavLink>
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
          <a href="#" className="hover:text-stone-300">Privacy Policy</a>
          <a href="#" className="hover:text-stone-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

// --- SECTION WRAPPER ---
export const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = "", id }) => (
  <section id={id} className={`py-24 md:py-32 ${className}`}>
    {children}
  </section>
);

// --- ANIMATION WRAPPER ---
export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);