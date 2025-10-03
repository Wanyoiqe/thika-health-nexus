import axios from "axios";

const API_URL = "http://localhost:5000"; // Replace with your backend URL

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

// Book appointment
export const bookAppointment = async (
  token: string,
  firstName: string,
  email: string,
  password: string
) => {
    try {
        const response = await privateAPIUtil(token).post('/api/appointments/book', { firstName, email, password });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Booking appointment failed');
    }
};

// Get all appointments
export const getAllAppointments = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get(`/api/appointments`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
  }
};

// Get past appointments
export const getPastAppointments = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get(`/api/appointments/past`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch past appointments');
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get(`/api/appointments/upcoming`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch upcoming appointments');
  }
};

// Fetch user profile
export const fetchUserProfile = async (token: string) => {
    try {
        const response = await privateAPIUtil(token).get('/api/users/fetch_profile');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
};