import { User } from '@/AuthContext';

export type LoginResponse = {
    result_code: number;
    user: User;
    token: string;
};

export type getAllAppointmentsDTO = {
    result_code: number;
    appointments: Appointment[];
};

export interface ReceptionistData {
  patientCount: number;
  staffCount: number;
  appointmentCount: number;
  appointmentCountToday: number;
}

export type Appointment = {
  app_id: string;
  date_time: string;
  patient_id: string;
  provider_id: string | null;
  provider?: {
    provider_id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    phone?: string | null;
    profileUrl?: string | null;
    hospital_id?: string | null;
  };
  status: 'scheduled' | 'completed' | 'cancelled';
};

export type Provider = {
  provider_id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  availableTimes?: string[]; // Optional for general provider objects; availability endpoint will populate this
  phone?: string | null;
  profileUrl?: string | null;
  hospital_id?: string | null;
};

// DTO for /api/doctors
export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  specialization: string;
  phone_number: string;
  gender: string;
  profile_url: string | null;
  hospital_id: string | null;
}

export interface Patient {
  patient_id: string;
  user_id: string;
  name: string;
  full_name: string;
  totalVisits: number;
  lastVisit: string;
}

export interface ActiveConsent {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  grantedDate: string;
  expiryDate: string;
}

export interface LabResults {
  testName: string;
  result: string;
  normalRange: string;
  notes: string;
}

export interface Medication {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Vitals {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
}

export interface HealthRecord {
  id: string;
  appointment_id: string;
  patient_id: string;
  provider_id: string;
  patient_name: string;
  record_type: 'lab_results' | 'medication' | 'vitals';
  data: LabResults | Medication | Vitals;
  created_at: string;
  updated_at: string;
}

export interface ConsentRequest {
  id: string;
  patient_name: string;
  patient_id: string;
  request_date: string;
  status: 'pending' | 'approved' | 'denied';
  type: string;
  purpose: string;
}

export interface CreateConsentRequest {
  id: string;
  patient_id: string;
  record_id: string;
  request_date: string;
  status: 'pending' | 'approved' | 'denied';
  type: string;
  purpose: string;
}

// DTO for /api/appointments/book
export type BookAppointmentRequestDTO = {
  date_time: string;
  provider_id: string | null;
};

export type BookAppointmentResponseDTO = {
  result_code: number;
  message: string;
  appointment: Appointment;
};

// DTO for /api/appointments/available
export type GetAvailableDoctorsRequestDTO = {
  from: string;
  to: string;
};

export type GetAvailableDoctorsResponseDTO = {
  result_code: number;
  available: Provider[];
};

// DTO for /api/appointments/upcoming
export type GetUpcomingAppointmentsResponseDTO = {
  result_code: number;
  appointments: Appointment[];
};

// DTO for /api/appointments/past
export type GetPastAppointmentsResponseDTO = {
  result_code: number;
  appointments: Appointment[];
};

// DTO for /api/appointments
export type GetAllAppointmentsResponseDTO = {
  result_code: number;
  appointments: Appointment[];
};

// DTO for /api/appointments
export type GetAllDoctorsResponseDTO = {
  result_code: number;
  doctors: Doctor[];
};

// DTO for /api/addDoctor
export type AddDoctorRequestDTO = {
  result_code: number;
  message: string;
  user: User;
}

// DTO for /api/doctor/patients
export type DoctorPatientsResponseDTO = {
  result_code: number;
  patients: Patient[];
};

// DTO for /api/doctor/patients
export type ReceptionistDashboardDetails = {
  result_code: number;
  data: ReceptionistData[];
};

// Dto for /api/health-records
export type HealthRecordResponseDTO = {
  result_code: number;
  health_record: HealthRecord;
};

// DTO for /api/providers/fetch_doctors_patients
export type DoctorHealthRecordsResponseDTO = {
  result_code: number;
  health_records: HealthRecord[];
};