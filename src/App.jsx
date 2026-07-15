import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// User pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import Notification from "./pages/Notification";

// Payment
import CardPayment from "./pages/CardPayment";

// OTP Verification
import OTPVerification from "./pages/OTPVerification"; 

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";

// Transaction Management
import TransactionManagement from "./pages/TransactionManagement";





function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


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


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;