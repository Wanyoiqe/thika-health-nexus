import { privateAPIUtil } from './appointments';
import type { LabResults, Medication, Vitals,HealthRecord,HealthRecordResponseDTO, DoctorHealthRecordsResponseDTO, CreateConsentRequest } from '../types';  

// Fetch health record by appointment ID
export const getHealthRecordByAppointment = async (token: string, appointmentId: string, patientId: string) => {
  try {
    const response = await privateAPIUtil(token).get<HealthRecordResponseDTO>(`/api/health-records/appointment/${appointmentId}/${patientId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No health record exists for this appointment
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch health record');
  }
};

// Get all doctors for a time window
export const fetchDoctorsHealthRecords = async (token: string) => {
  try {
    const response = await privateAPIUtil(token).get<DoctorHealthRecordsResponseDTO>('/api/health-records/doctor-records');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch available doctors');
  }
};


// Create health record
export const createHealthRecord = async (
  token: string,
  data: {
    appointment_id: string;
    record_type: 'lab_results' | 'medication' | 'vitals';
    data: LabResults | Medication | Vitals;
  }
) => {
  try {
    const response = await privateAPIUtil(token).post('/api/healthrecords/create', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create health record');
  }
};

// Update health record
export const updateHealthRecord = async (
  token: string,
  recordId: string,
  data: {
    record_type: 'lab_results' | 'medication' | 'vitals';
    data: LabResults | Medication | Vitals;
  }
) => {
  try {
    const response = await privateAPIUtil(token).put(`/api/health-records/${recordId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update health record');
  }
};



// Create health record
export const createHealthRecordConsentRequest = async (token: string, request: CreateConsentRequest) => {
  try {
    const response = await privateAPIUtil(token).post('/api/consents/create', request);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create health record');
  }
};