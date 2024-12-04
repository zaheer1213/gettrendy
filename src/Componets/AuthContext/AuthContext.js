// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [userToken, setUserToken] = useState(localStorage.getItem("token")); // Initialize from localStorage

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setIsAuthenticated(!!token);
      setUserRole(role);
      setUserToken(token); // Update the token from localStorage
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserToken(token); // Set token when logging in
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, login, logout, userToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
