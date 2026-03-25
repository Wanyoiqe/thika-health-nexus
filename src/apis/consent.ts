import { privateAPIUtil } from './appointments';
import type { ConsentsResponseDTO, HealthRecord } from '../types';

// Doctor: all requests they sent (all statuses)
export const getDoctorConsentRequests = async (token: string): Promise<ConsentsResponseDTO> => {
  try {
    const response = await privateAPIUtil(token).get<ConsentsResponseDTO>('/api/consents/doctors-consent-requests');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch consent requests');
  }
};

// Patient: active (approved, non-expired) consents
export const getActiveConsents = async (token: string): Promise<ConsentsResponseDTO> => {
  try {
    const response = await privateAPIUtil(token).get<ConsentsResponseDTO>('/api/consents/active');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return { result_code: 1, consents: [] };
    throw new Error(error.response?.data?.message || 'Failed to fetch active consents');
  }
};

// Patient: full consent history
export const getMyConsentHistory = async (token: string): Promise<ConsentsResponseDTO> => {
  try {
    const response = await privateAPIUtil(token).get<ConsentsResponseDTO>('/api/consents/my-history');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch consent history');
  }
};

// Patient: approve or deny a consent request
export const respondToConsent = async (token: string, consentId: string, action: 'approve' | 'deny') => {
  try {
    const response = await privateAPIUtil(token).post(`/api/consents/${consentId}/respond`, { action });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to respond to consent request');
  }
};

// Patient: revoke an approved consent
export const revokeConsent = async (token: string, consentId: string) => {
  try {
    const response = await privateAPIUtil(token).post(`/api/consents/${consentId}/revoke`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to revoke consent');
  }
};

// Doctor: create a new consent request
export const createConsentRequest = async (
  token: string,
  data: { patient_id: string; record_id: string; purpose: string; type?: string }
) => {
  try {
    const response = await privateAPIUtil(token).post('/api/consents/create', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create consent request');
  }
};

// View health record linked to an approved consent (doctor or patient)
export const getConsentRecord = async (token: string, consentId: string): Promise<{ result_code: number; record: HealthRecord }> => {
  try {
    const response = await privateAPIUtil(token).get(`/api/consents/${consentId}/records`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch consent record');
  }
};
