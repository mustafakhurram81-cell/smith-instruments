import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer, WhatsAppFloat } from './components/Shared';
import { Home } from './pages/Home';
import { Catalogues } from './pages/Catalogues';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ProductsIndex } from './pages/products/ProductsIndex';
import { CategoryView } from './pages/products/CategoryView';
import { SubcategoryView } from './pages/products/SubcategoryView';
import { ProductDetail } from './pages/products/ProductDetail';
import { QuoteCart } from './pages/QuoteCart';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Login } from './pages/admin/Login';
import { Migration } from './pages/admin/Migration';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CartProvider } from './components/CartProvider';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-brand-gold/30">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogues" element={<Catalogues />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote-cart" element={<QuoteCart />} />

          {/* Product Routes */}
          <Route path="/products" element={<ProductsIndex />} />
          <Route path="/products/:categoryName" element={<CategoryView />} />
          <Route path="/products/:categoryName/:subcategoryName" element={<SubcategoryView />} />
          <Route path="/products/:categoryName/:subcategoryName/:productSKU" element={<ProductDetail />} />
          <Route path="/product/:productId" element={<ProductDetail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="migrate" element={<Migration />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <WhatsAppFloat />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;