import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUser, getCurrentUser, logoutUser as logoutService } from "../services/authService";

export const AuthContext = createContext();

// useAuth custom hook eka
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);

          // API eken latest user data ganna
          const data = await getCurrentUser();
          console.log("Init auth - API response:", data);
          
          // API response eke user data thiyena eka check karanna
          if (data) {
            // data.user thiyenawa nam eka ganna, nathnam data ema user object eka
            const userData = data.user || data;
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
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
      console.log("Login API full response:", data);
      
      // API response eke user data thiyena eka check karanna
      let userData = data.user || data;
      
      // userData ekak object ekkda? check karanna
      if (typeof userData === 'object' && userData !== null) {
        console.log("User data extracted:", userData);
      } else {
        console.error("Invalid user data format:", userData);
        return {
          success: false,
          message: "Invalid user data received from server",
        };
      }

      const authToken = data.token || data.accessToken || data.access_token;
      
      if (!authToken) {
        console.error("No token received:", data);
        return {
          success: false,
          message: "No authentication token received",
        };
      }

      setUser(userData);
      setToken(authToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Login failed",
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
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};