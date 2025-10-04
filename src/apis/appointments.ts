import axios from "axios";
import type { BookAppointmentResponseDTO, getAllAppointmentsDTO, GetAvailableDoctorsResponseDTO, GetPastAppointmentsResponseDTO, GetUpcomingAppointmentsResponseDTO } from "../types";

const API_URL = "http://localhost:5000"; // Replace with your backend URL

// Private API utility (with token)
export const privateAPIUtil = (token: string) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Public API utility (no token)
export const publicAPIUtil = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Book appointment
export const bookAppointment = async (
  token: string,
  date_time: string,
  provider_id: string | null
) => {
  try {
    const response = await privateAPIUtil(token).post<BookAppointmentResponseDTO>('/api/appointments/book', { date_time, provider_id });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Booking appointment failed');
  }
};

// Get all appointments
export const getAllAppointments = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get<getAllAppointmentsDTO>(`/api/appointments`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
  }
};

// Get past appointments
export const getPastAppointments = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get<GetPastAppointmentsResponseDTO>(`/api/appointments/past`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch past appointments');
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get<GetUpcomingAppointmentsResponseDTO>(`/api/appointments/upcoming`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch upcoming appointments');
  }
};

// Get available doctors for a time window
export const getAvailableDoctors = async (from: string, to: string) => {
  try {
    const response = await publicAPIUtil().post<GetAvailableDoctorsResponseDTO>('/api/appointments/available', { from, to });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch available doctors');
  }
};