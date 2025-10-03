import axios from 'axios'
import type { LoginResponse } from '../types';  

const API_URL = 'http://localhost:5000' // Replace with your backend URL

//Private API utility (with token)
export const privateAPIUtil = (token: string) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

//Public API utility (no token)
export const publicAPIUtil = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const login = async (email: string, password: string) => {
  try {
    const response = await publicAPIUtil().post<LoginResponse>("/api/users/login", { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

// Update the register function to handle the full form data
export const register = async (formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'patient' | 'provider';
}) => {
    try {
        const response = await publicAPIUtil().post('/api/users/register', formData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const fetchUserProfile = async (token: string) => {
    try {
        const response = await privateAPIUtil(token).get('/api/users/fetch_profile');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
}