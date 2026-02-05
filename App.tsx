import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer, WhatsAppFloat } from './components/Shared';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CartProvider } from './components/CartProvider';
import { ToastProvider } from './components/ToastProvider';
import { Loader2 } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Catalogues = lazy(() => import('./pages/Catalogues').then(module => ({ default: module.Catalogues })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Blog = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(module => ({ default: module.TermsOfService })));
const ProductsIndex = lazy(() => import('./pages/products/ProductsIndex').then(module => ({ default: module.ProductsIndex })));
const CategoryView = lazy(() => import('./pages/products/CategoryView').then(module => ({ default: module.CategoryView })));
const SubcategoryView = lazy(() => import('./pages/products/SubcategoryView').then(module => ({ default: module.SubcategoryView })));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail').then(module => ({ default: module.ProductDetail })));
const InstrumentTypeView = lazy(() => import('./pages/products/InstrumentTypeView').then(module => ({ default: module.InstrumentTypeView })));
const InstrumentCategoryView = lazy(() => import('./pages/products/InstrumentCategoryView').then(module => ({ default: module.InstrumentCategoryView })));
const SpecialtyCategoryView = lazy(() => import('./pages/products/SpecialtyCategoryView').then(module => ({ default: module.SpecialtyCategoryView })));
const QuoteCart = lazy(() => import('./pages/QuoteCart').then(module => ({ default: module.QuoteCart })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.Dashboard })));
const Login = lazy(() => import('./pages/admin/Login').then(module => ({ default: module.Login })));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    // Use startTransition to defer scroll until after navigation is complete
    React.startTransition(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }, [pathname]);

  return null;
};

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
  </div>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-brand-orange/30">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogues" element={<Catalogues />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/quote-cart" element={<QuoteCart />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

            {/* Product Routes */}
            <Route path="/products" element={<ProductsIndex />} />
            {/* Instrument Type Navigation */}
            <Route path="/products/instruments/:categoryName" element={<InstrumentCategoryView />} />
            <Route path="/products/instruments/:categoryName/:subcategoryName" element={<InstrumentCategoryView />} />
            {/* Specialty Navigation */}
            <Route path="/products/specialty/:categoryName" element={<SpecialtyCategoryView />} />
            <Route path="/products/specialty/:categoryName/:subcategoryName" element={<SpecialtyCategoryView />} />
            {/* Legacy routes for backwards compatibility */}
            <Route path="/products/browse" element={<InstrumentTypeView />} />
            <Route path="/products/:categoryName" element={<CategoryView />} />
            <Route path="/products/:categoryName/:subcategoryName" element={<SubcategoryView />} />
            <Route path="/products/:categoryName/:subcategoryName/:productSKU" element={<ProductDetail />} />
            <Route path="/product/:productId" element={<ProductDetail />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
              </Route>
            </Route>

            {/* 404 Catch-all Route - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>

        </Suspense>
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
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
            <SpeedInsights />
          </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;