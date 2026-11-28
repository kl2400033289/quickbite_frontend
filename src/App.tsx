import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AudioProvider } from './context/AudioContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { WelcomeIntroModal } from './components/intro/WelcomeIntroModal';
import { SideCompanionsDock } from './components/characters/SideCompanionsDock';
import { ApiStatusBanner } from './components/common/ApiStatusBanner';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentResultPage } from './pages/PaymentResultPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { RestaurantDashboardPage } from './pages/RestaurantDashboardPage';
import { DeliveryPartnerPage } from './pages/DeliveryPartnerPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AudioProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-warm-50 text-charcoal-900 selection:bg-tangerine-500 selection:text-white">
              <ScrollToTop />
            
            {/* Sticky Navigation */}
            <Navbar />

            {/* Live Backend Microservices Connection Indicator */}
            <ApiStatusBanner />

            {/* Slide-over interactive Cart Drawer */}
            <CartDrawer />

            {/* Fullscreen Video Welcome Intro */}
            <WelcomeIntroModal />

            {/* Floating Animated Side Companions (Pip, Maya, Biscuit) */}
            <SideCompanionsDock />

            {/* Main Application Routes */}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/payment-result" element={<PaymentResultPage />} />
                <Route
                  path="/track/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderTrackingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']}>
                      <RestaurantDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/delivery"
                  element={
                    <ProtectedRoute allowedRoles={['DELIVERY_PARTNER', 'ADMIN']}>
                      <DeliveryPartnerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>

            {/* Global Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AudioProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;
