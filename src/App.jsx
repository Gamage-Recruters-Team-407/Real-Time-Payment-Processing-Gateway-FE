import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from './layouts/DashboardLayout';
import RoleBasedRoute from "./components/RoleBasedRoute";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NewPasswordSetup from "./pages/NewPasswordSetup";

// User pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import Notification from "./pages/Notification";

// Fraud Detection
import FraudDetection from './pages/FraudDetection';

// Payment
import CardPayment from "./pages/CardPayment";
import PaymentHistory from "./pages/PaymentHistory";
import RefundRequest from "./pages/RefundRequest";

// OTP Verification
import OTPVerification from "./pages/OTPVerification";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";

// Transaction Management
import TransactionManagement from "./pages/TransactionManagement";

// Refund Management
import RefundManagement from "./pages/RefundManagement";

import Payment from "./pages/Payment.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password-setup" element={<NewPasswordSetup />} />

          {/* Default Route - Role based redirect */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleBasedRoute />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard - Only for regular users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireUser>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard - Only for admins */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Old admin route - redirect to admin-dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Navigate to="/admin-dashboard" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fraud-detection"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FraudDetection />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Setting - Direct use Sidebar and Navbar (NO DashboardLayout) */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />

          {/* Notification Route - DashboardLayout eken wrap kara */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Notification />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Card Payment Route */}
          <Route
            path="/card-payment"
            element={
              <ProtectedRoute>
                <CardPayment />
              </ProtectedRoute>
            }
          />

          {/* OTP Verification Route */}
          <Route path="/otp-verification" element={<OTPVerification />} />

          {/* Payment History Route */}
          <Route
            path="/payment-history"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PaymentHistory />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Refund Request Routes */}
          <Route
            path="/refund"
            element={
              <ProtectedRoute>
                <RefundRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/refund/:transactionId"
            element={
              <ProtectedRoute>
                <RefundRequest />
              </ProtectedRoute>
            }
          />

          {/* Transaction Management - Direct use Sidebar and Navbar */}
          <Route
            path="/transaction-management"
            element={
              <ProtectedRoute>
                <TransactionManagement />
              </ProtectedRoute>
            }
          />

          {/* Refund Management */}
          <Route
            path="/refund-management"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RefundManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Developer 3 - Payment Processing */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute requireUser>
                <DashboardLayout>
                  <Payment />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;