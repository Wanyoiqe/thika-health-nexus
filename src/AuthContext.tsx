import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [refreshToken, setRefreshToken] = useState<string>('');

  // Helper to transform backend/snake_case data to User shape
  const transformToUser = (data: any): User | null => {
    if (!data || typeof data !== 'object') return null;

    // Map role: treat 'doctor' as 'provider' for frontend logic
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const transformedUser = transformToUser(parsed);
        if (transformedUser) {
          setUser(transformedUser);
        } else {
          console.warn('Invalid stored user data, clearing localStorage');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    const storedToken = Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
    if (storedToken) {
      setRefreshToken(storedToken);
    }
  }, []);

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