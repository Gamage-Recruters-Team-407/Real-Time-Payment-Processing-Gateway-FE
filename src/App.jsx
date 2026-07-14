import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import TransactionManagement from "./pages/TransactionManagement";
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
        {/* Admin Route */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Transaction Management */}
        <Route path="/transaction-management" element={<TransactionManagement />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
