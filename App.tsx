import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header, Footer, WhatsAppFloat } from './components/Shared';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CartProvider } from './components/CartProvider';
import { ToastProvider } from './components/ToastProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAttribution } from './hooks';
import { Loader2 } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/ui';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Catalogues = lazy(() => import('./pages/Catalogues').then(module => ({ default: module.Catalogues })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Blog = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const Distributor = lazy(() => import('./pages/Distributor').then(module => ({ default: module.Distributor })));
const Events = lazy(() => import('./pages/Events').then(module => ({ default: module.Events })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(module => ({ default: module.TermsOfService })));
const CatalogIndex = lazy(() => import('./pages/catalog/CatalogIndex').then(module => ({ default: module.CatalogIndex })));
const TypePage = lazy(() => import('./pages/catalog/ListingPages').then(module => ({ default: module.TypePage })));
const SubtypePage = lazy(() => import('./pages/catalog/ListingPages').then(module => ({ default: module.SubtypePage })));
const SpecialtyPage = lazy(() => import('./pages/catalog/ListingPages').then(module => ({ default: module.SpecialtyPage })));
const SpecialtyTypePage = lazy(() => import('./pages/catalog/ListingPages').then(module => ({ default: module.SpecialtyTypePage })));
const ProductPage = lazy(() => import('./pages/catalog/ProductPage').then(module => ({ default: module.ProductPage })));
const LegacyRedirect = lazy(() => import('./pages/catalog/LegacyRedirect').then(module => ({ default: module.LegacyRedirect })));
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
  <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
  </div>
);


const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Capture UTM parameters from LinkedIn/Meta/Google ad campaigns on entry
  useAttribution();

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-brand-orange/30">
      {!isAdminRoute && <Header />}
      <main className="flex-grow flex flex-col">
        <Suspense fallback={<PageLoader />}>
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/catalogues" element={<PageTransition><Catalogues /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
                <Route path="/distributor" element={<PageTransition><Distributor /></PageTransition>} />
                <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
                <Route path="/quote-cart" element={<PageTransition><QuoteCart /></PageTransition>} />
                <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
                <Route path="/terms-of-service" element={<PageTransition><TermsOfService /></PageTransition>} />
                {/* Preserve retired campaign URLs and their accumulated backlinks. */}
                <Route path="/whx-miami" element={<Navigate to="/contact" replace />} />
                <Route path="/meet" element={<Navigate to="/contact" replace />} />

                {/* Catalog: by instrument type and by specialty */}
                <Route path="/products" element={<PageTransition><CatalogIndex /></PageTransition>} />
                <Route path="/products/type/:type" element={<PageTransition><TypePage /></PageTransition>} />
                <Route path="/products/type/:type/:subtype" element={<PageTransition><SubtypePage /></PageTransition>} />
                <Route path="/products/specialty/:specialty" element={<PageTransition><SpecialtyPage /></PageTransition>} />
                <Route path="/products/specialty/:specialty/:type" element={<PageTransition><SpecialtyTypePage /></PageTransition>} />
                <Route path="/product/:sku" element={<PageTransition><ProductPage /></PageTransition>} />
                {/* Old category URLs from the previous catalog, sent to the closest new page */}
                <Route path="/products/instruments/*" element={<LegacyRedirect />} />
                <Route path="/products/browse" element={<LegacyRedirect />} />
                <Route path="/products/:categoryName" element={<LegacyRedirect />} />
                <Route path="/products/:categoryName/:subcategoryName" element={<LegacyRedirect />} />
                <Route path="/products/:categoryName/:subcategoryName/:productSKU" element={<LegacyRedirect />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<PageTransition><Login /></PageTransition>} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                  </Route>
                </Route>

                {/* 404 Catch-all Route - must be last */}
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </div>
          {!isAdminRoute && <Footer />}
        </Suspense>
      </main>
      <WhatsAppFloat />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
