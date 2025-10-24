import axios from 'axios';

export interface ConsentRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  requestDate: string;
  purpose: string;
  status: 'pending' | 'approved' | 'denied' | 'revoked';
}

export interface ActiveConsent {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  grantedDate: string;
  expiryDate: string;
}

// Fetch all pending consent requests
export const getConsentRequests = async (): Promise<ConsentRequest[]> => {
  const response = await axios.get<ConsentRequest[]>('/api/consent-requests');
  return response.data;
};

// Fetch all active consents
export const getActiveConsents = async (): Promise<ActiveConsent[]> => {
  const response = await axios.get<ActiveConsent[]>('/api/active-consents');
  return response.data;
};

// Handle consent request (approve/deny)
export const handleConsentRequest = async (
  consentId: string,
  action: 'approve' | 'deny'
): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(`/api/consent-requests/${consentId}/${action}`);
  return response.data;
};

// Revoke an active consent
export const revokeConsent = async (
  consentId: string
): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(`/api/consents/${consentId}/revoke`);
  return response.data;
};

// Create a new consent request (for doctors)
export const createConsentRequest = async (
  data: {
    patientId: string;
    type: string;
    purpose: string;
  }
): Promise<ConsentRequest> => {
  const response = await axios.post<ConsentRequest>('/api/consent-requests', data);
  return response.data;
};