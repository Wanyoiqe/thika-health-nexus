import React, { createContext, useContext, ReactNode, useState } from 'react';
import Cookies from 'js-cookie';
import { register, login, fetchUserProfile } from './apis/auth';
import type { LoginResponse } from './types';

export type User = {
  id: string;  // Updated to string for UUID
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'provider' | 'receptionist' | 'admin';  // Added 'doctor'
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
  loginUtil: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Defined outside component so it can be used in lazy state initializers
const transformToUser = (data: any): User | null => {
  if (!data || typeof data !== 'object') return null;
  const role = data.role === 'doctor' ? 'provider' : data.role;
  return {
    id: data.user_id || data.id,
    firstName: data.first_name || data.firstName || '',
    lastName: data.last_name || data.lastName || '',
    email: data.email || '',
    phone: data.phone_number || data.phone || '',
    role: role as User['role'],
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Lazy initializers — read from storage synchronously before first render
  // This prevents the empty-state flash that caused data to not load on refresh
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) return transformToUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem('user');
    }
    return null;
  });

  const [refreshToken, setRefreshToken] = useState<string>(
    () => Cookies.get('refreshToken') || localStorage.getItem('refreshToken') || ''
  );

  const refreshUser = async () => {
    try {
      if (!refreshToken) return;
      const data = await fetchUserProfile(refreshToken);
      console.log('Fetched user profile:', data); // for debugging
      if (data && typeof data === 'object' && 'user' in data) {
        const transformedUser = transformToUser((data as { user: any }).user);
        if (transformedUser) {
          setUser(transformedUser);
          localStorage.setItem('user', JSON.stringify(transformedUser));  // Store transformed version
        } else {
          console.warn('fetchUserProfile returned invalid user data');
        }
      } else {
        console.warn('fetchUserProfile returned unexpected data shape', data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Optionally logout on refresh failure
      logout();
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
      console.log('Registration response:', response); // for debugging
      // If registration auto-returns/transforms a user, set it here
      // if (response.user) {
      //   const transformedUser = transformToUser(response.user);
      //   if (transformedUser) {
      //     setUser(transformedUser);
      //     localStorage.setItem('user', JSON.stringify(transformedUser));
      //   }
      // }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const loginUtil = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await login(email, password);
    console.log('Login response:', response);
    const transformedUser = transformToUser(response.user);
    if (transformedUser) {
      setUser(transformedUser);
      localStorage.setItem('user', JSON.stringify(transformedUser));  // Store transformed
    }
    setRefreshToken(response.token);
    Cookies.set('refreshToken', response.token, { expires: 7 });
    localStorage.setItem('user', JSON.stringify(transformedUser));
    localStorage.setItem('refreshToken', response.token);
    return response;
  };

  const logout = () => {
    setUser(null);
    setRefreshToken('');
    localStorage.removeItem('user');
    Cookies.remove('refreshToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, refreshToken, refreshUser, registerPatient, loginUtil, logout }}>
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