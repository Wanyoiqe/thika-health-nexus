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