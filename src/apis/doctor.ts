import axios from 'axios'
import type { AddDoctorRequestDTO, DoctorPatientsResponseDTO, LoginResponse } from '../types';  

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

// Get all doctors for a time window
export const fetchDoctorsPatients = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get<DoctorPatientsResponseDTO>('/api/providers/fetch_doctors_patients');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch available doctors');
  }
};