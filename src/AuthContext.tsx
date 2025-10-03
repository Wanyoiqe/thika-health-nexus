import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { register, login } from './apis/auth';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'patient' | 'provider' | 'receptionist' | 'admin';
};

type AuthContextType = {
  user: User | null;
  registerPatient: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: 'patient' | 'provider';
  }) => Promise<void>;
  loginUtil: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const registerPatient = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: 'patient' | 'provider';
  }) => {
    try {
      const response = await register(formData);
      // Optionally set user state if registration logs in the user
      // setUser(response.user);
      // localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const loginUtil = async (email: string, password: string) => {
    const response = await login(email, password);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, registerPatient, loginUtil, logout }}>
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