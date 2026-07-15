
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from './layouts/DashboardLayout';

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

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


import Payment from "./pages/Payment.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />

          {/* Notification Route */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notification />
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
                <PaymentHistory />
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

          {/* Transaction Management */}
          <Route
            path="/transaction-management"
            element={
              <ProtectedRoute>
                <TransactionManagement />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          {/* Developer 3 - Payment Processing */}
        <Route path="/payment" element={<Payment />} />

        </Routes>
      </AuthProvider>

      <Routes>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
