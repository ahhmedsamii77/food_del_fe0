import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store/auth";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ConfirmEmailPage from "@/pages/auth/ConfirmEmailPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import CartPage from "@/pages/CartPage";
import OrdersPage from "@/pages/OrdersPage";
import VerifyPage from "@/pages/VerifyPage";
import FoodDetailPage from "@/pages/FoodDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import AboutPage from "@/pages/AboutPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Admin pages
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminFoodsPage from "@/pages/admin/AdminFoodsPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { access_Token } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!access_Token) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { access_Token, role } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!access_Token || role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { access_Token } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (access_Token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/food/:id" element={<FoodDetailPage />} />

          {/* Auth */}
          <Route path="/auth/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/auth/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/auth/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/auth/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/auth/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

          {/* Protected */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/verify" element={<VerifyPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="foods" element={<AdminFoodsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
