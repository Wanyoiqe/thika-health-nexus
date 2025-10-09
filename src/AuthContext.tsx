import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { register, login, fetchUserProfile } from './apis/auth';
import type { LoginResponse } from './types';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'patient' | 'provider' | 'receptionist' | 'admin';
};

export type AuthContextType = {
  user: User | null;
  refreshToken: string;
  refreshUser?: () => Promise<void>;
  registerPatient: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => Promise<void>;
  loginUtil: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [refreshToken, setRefreshToken] = useState<string>('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const refreshUser = async () => {
    try {
      if (!refreshToken) return;
      const data = await fetchUserProfile(refreshToken);
      console.log("Fetched user profile:", data); // for debugging
      // setUser(data.user);
      // localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const registerPatient = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await register(formData);
      console.log("Registration response:", response); // for debugging
      // Optionally set user state if registration logs in the user
      // setUser(response.user);
      // localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };



  const loginUtil = async (email: string, password: string) => {
    const response = await login(email, password);
    console.log("Login response:", response);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    setRefreshToken(response.token);
    Cookies.set('refreshToken', response.token, { expires: 7 });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user,refreshToken, refreshUser, registerPatient, loginUtil, logout }}>
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