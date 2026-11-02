import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import LoginPopup from './components/common/LoginPopup/LoginPopup';

import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import FoodDetail from './pages/FoodDetail/FoodDetail';
import Favorites from './pages/Favorites/Favorites';
import Addresses from './pages/Addresses/Addresses';
import Rewards from './pages/Rewards/Rewards';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import FlashSaleBanner from './components/common/FlashSaleBanner/FlashSaleBanner';

import AdminLogin from './admin/pages/AdminLogin/AdminLogin';
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import AdminLayout from './admin/AdminLayout';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Popup đăng nhập khách hàng */}
      {!isAdminPage && showLogin && (
        <LoginPopup setShowLogin={setShowLogin} />
      )}

      {/* Navbar khách hàng */}
      {!isAdminPage && (
        <Navbar setShowLogin={setShowLogin} />
      )}

      <div className="app">
        <Routes>
          {/* ==================== CUSTOMER ==================== */}

          <Route path="/" element={<Home />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/order" element={<PlaceOrder />} />

          <Route path="/verify" element={<Verify />} />

          <Route path="/myorders" element={<MyOrders />} />

          <Route
            path="/favorites"
            element={<Favorites setShowLogin={setShowLogin} />}
          />

          <Route path="/addresses" element={<Addresses />} />

          <Route path="/rewards" element={<Rewards />} />

          <Route
            path="/order-tracking/:orderId"
            element={<OrderTracking />}
          />

          <Route
            path="/food/:id"
            element={<FoodDetail setShowLogin={setShowLogin} />}
          />

          <Route
            path="/flash-sale"
            element={<FlashSaleBanner />}
          />

          {/* ==================== ADMIN LOGIN ==================== */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* ==================== ADMIN PANEL ==================== */}

          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Footer khách hàng */}
      {!isAdminPage && <Footer />}
    </>
  );
};

export default App;