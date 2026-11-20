import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  quickSwitchUser: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.error("Token verification failed:", err);
          api.setToken(null);
          // Auto-login default demo patient for instant frictionless browsing
          await quickSwitchUser('patient');
        }
      } else {
        // Auto-load demo patient by default so user can immediately experience the app
        await quickSwitchUser('patient');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      api.setToken(res.tokens.access_token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: any) => {
    setLoading(true);
    try {
      const res = await api.register(payload);
      api.setToken(res.tokens.access_token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const quickSwitchUser = async (role: UserRole) => {
    setLoading(true);
    try {
      let email = 'patient@mednexa.com';
      if (role === 'doctor') email = 'doctor@mednexa.com';
      if (role === 'facility_admin') email = 'admin@mednexa.com';

      const res = await api.login({ email, password: 'Password123!' });
      api.setToken(res.tokens.access_token);
      setUser(res.user);
    } catch (err) {
      console.error("Quick switch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, quickSwitchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
