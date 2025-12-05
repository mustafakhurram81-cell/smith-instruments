import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer, WhatsAppFloat, ScrollToTop } from './components/Shared';
import { Home } from './pages/Home';
import { ProductsIndex } from './pages/products/ProductsIndex';
import { CategoryView } from './pages/products/CategoryView';
import { SubcategoryView } from './pages/products/SubcategoryView';
import { ProductDetail } from './pages/products/ProductDetail';
import { Catalogues } from './pages/Catalogues';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Migration } from './pages/admin/Migration';

// Scroll to top on route change
const ScrollToTopOnNav = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

import { Navigate, Outlet } from 'react-router-dom';
import { Login } from './pages/admin/Login';

// Protected Route Wrapper
const RequireAuth = () => {
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTopOnNav />
      {/* Conditionally render Header/Footer could be done here based on location, but keeping them simple for now */}
      <div className="flex flex-col min-h-screen font-sans antialiased text-brand-charcoal bg-stone-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsIndex />} />
            <Route path="/products/:categoryId" element={<CategoryView />} />
            <Route path="/products/:categoryId/:subcategoryId" element={<SubcategoryView />} />
            <Route path="/products/:categoryId/:subcategoryId/:productId" element={<ProductDetail />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/catalogues" element={<Catalogues />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route element={<RequireAuth />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="migrate" element={<Migration />} />
              </Route>
            </Route>
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