// import axios from 'axios';
import { privateAPIUtil } from './appointments';
import { ActiveConsent,ConsentRequest } from '../types';  

// Fetch all pending consent requests
// export const getConsentRequests = async (): Promise<ConsentRequest[]> => {
//   const response = await axios.get<ConsentRequest[]>('/api/consent-requests');
//   return response.data;
// };

// Fetch health record by appointment ID
export const getConsentRequests = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get<ConsentRequest[]>(`/api/consents/doctors-consent-requests`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No health record exists for this appointment
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch health record');
  }
};

export const getActiveConsents = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get<ActiveConsent>(`/api/active-consents`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No health record exists for this appointment
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch health record');
  }
};