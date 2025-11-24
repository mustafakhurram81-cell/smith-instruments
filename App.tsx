import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer, WhatsAppFloat, ScrollToTop } from './components/Shared';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Catalogues } from './pages/Catalogues';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';

// Scroll to top on route change
const ScrollToTopOnNav = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTopOnNav />
      <div className="flex flex-col min-h-screen font-sans antialiased text-brand-charcoal bg-stone-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/catalogues" element={<Catalogues />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppFloat />
        <ScrollToTop />
      </div>
    </Router>
  );
};

export default App;