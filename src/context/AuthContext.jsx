import React, { createContext, useState, useEffect } from "react";
import { loginUser, getCurrentUser, logoutUser as logoutService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);

  
        try {
          const data = await getCurrentUser();
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      const { user: userData, token: authToken } = data;

      setUser(userData);
      setToken(authToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};