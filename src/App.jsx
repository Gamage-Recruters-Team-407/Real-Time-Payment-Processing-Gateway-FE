import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import CardPayment from "./pages/CardPayment";
import Setting from "./pages/Setting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route -> Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Setting />} />

        {/* Card Payment Route */}
        <Route path="/card-payment" element={<CardPayment />} />

        {/* Admin Route */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;