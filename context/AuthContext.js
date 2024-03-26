"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check local storage for token on initial load
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAuthenticated(true);
      setToken(storedToken);
    }
    setLoading(false); // Set loading to false after checking token
  }, []);

  const signin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setAuthenticated(true);
  };

  const signout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthenticated(false);
  };

  const value = {
    authenticated,
    loading, // Include loading in context value
    token,
    signin,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
