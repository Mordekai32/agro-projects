import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './index.css';

// Public pages (eagerly loaded for instant access)
import Login from './pages/Login';
import Register from './pages/Register';
import Weather from './pages/Weather';
import Advisory from './pages/Advisory';
import Logout from './pages/Logout';

// Lazy‑load protected dashboards and management pages
const FarmerDashboardContent = lazy(() => import('./pages/FarmerDashboardContent'));
const AdminDashboardContent = lazy(() => import('./pages/AdminDashboardContent'));
const BuyerDashboardContent = lazy(() => import('./pages/BuyerDashboardContent'));
const Products = lazy(() => import('./pages/Products'));
const ManageProducts = lazy(() => import('./pages/ManageProducts'));
const ManageUsers = lazy(() => import('./pages/ManageUsers'));
const ManageTransactions = lazy(() => import('./pages/ManageTransactions'));
const ManageWeather = lazy(() => import('./pages/ManageWeather'));
const ManageAdvisory = lazy(() => import('./pages/ManageAdvisory'));

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-xl text-gray-600">Loading page...</div>
  </div>
);

// 404 Not Found component (can be moved to its own file later)
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
    <p className="text-xl text-gray-600 mb-8">Page not found</p>
    <a href="/" className="text-blue-600 hover:underline">Go to Dashboard</a>
  </div>
);

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading application...</div>
      </div>
    );
  }

  const isLoggedIn = !!user;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/weather" element={<Weather />} />
        <Route path="/advisory" element={<Advisory />} />
        <Route path="/logout" element={<Logout />} />

        {/* ===== ROOT ROUTE – redirect to correct dashboard ===== */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              user.type === 'farmer' ? (
                <FarmerDashboardContent />
              ) : user.type === 'admin' ? (
                <AdminDashboardContent />
              ) : user.type === 'buyer' ? (
                <BuyerDashboardContent />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ===== OTHER PROTECTED ROUTES ===== */}
        <Route
          path="/products"
          element={isLoggedIn ? <Products /> : <Navigate to="/login" />}
        />

        {/* Farmer / Cooperative specific routes */}
        <Route
          path="/add-product"
          element={
            isLoggedIn && (user.type === 'farmer' || user.type === 'cooperative') ? (
              <div className="p-8 text-center">Add Product – coming soon</div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/transactions"
          element={
            isLoggedIn && (user.type === 'farmer' || user.type === 'cooperative') ? (
              <div className="p-8 text-center">Sales & Transactions – coming soon</div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Buyer specific routes */}
        <Route
          path="/my-purchases"
          element={
            isLoggedIn && user.type === 'buyer' ? (
              <div className="p-8 text-center">My Purchases – coming soon</div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ===== ADMIN ROUTES ===== */}
        <Route
          path="/admin/users"
          element={
            isLoggedIn && user.type === 'admin' ? (
              <ManageUsers />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/products"
          element={
            isLoggedIn && user.type === 'admin' ? (
              <ManageProducts />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/transactions"
          element={
            isLoggedIn && user.type === 'admin' ? (
              <ManageTransactions />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/weather"
          element={
            isLoggedIn && user.type === 'admin' ? (
              <ManageWeather />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/advisory"
          element={
            isLoggedIn && user.type === 'admin' ? (
              <ManageAdvisory />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* 404 – Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;