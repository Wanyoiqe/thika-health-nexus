// src/context/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type User = {
  id: number;
  firstName: string;
  email: string;
  role: 'patient' | 'provider' | 'receptionist' | 'admin'; 
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
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

  // Mock users
  const mockUsers: User[] = [
    {
      id: 1,
      firstName: 'Alice',
      email: 'patient@health.com',
      role: 'patient',
    },
    {
      id: 2,
      firstName: 'Dr. Bob',
      email: 'provider@health.com',
      role: 'provider',
    },
  ];

  const login = async (email: string, password: string) => {
    // Simulate authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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