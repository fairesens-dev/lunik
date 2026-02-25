import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Admin {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "admin_auth";
const VALID_EMAIL = "admin@monstore.fr";
const VALID_PASSWORD = "admin2024!";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.isAuthenticated && data.admin) {
          setIsAuthenticated(true);
          setAdmin(data.admin);
        }
      }
    } catch {}
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const adminData: Admin = { name: "Administrateur", email: VALID_EMAIL, role: "admin" };
      setIsAuthenticated(true);
      setAdmin(adminData);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true, admin: adminData }));
      return { success: true };
    }
    return { success: false, error: "Identifiants incorrects. Réessayez." };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdmin(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
