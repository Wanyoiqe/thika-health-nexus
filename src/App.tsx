
import Index from "./pages/Index";
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import PatientDashboard from './pages/PatientDashboard';
import ProviderDashboard from './components/dashboard/provider';
import Register from './pages/auth/Register';
import AppointmentBooking from './pages/AppointmentBooking';
import Appointments from './pages/Appointments';
import HealthRecordsPage from './pages/HealthRecordsPage';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorHealthRecords from './pages/doctor/DoctorHealthRecords';
import DoctorConsent from './pages/doctor/DoctorConsent';
import DoctorNotifications from './pages/doctor/DoctorNotifications';
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import NotFound from "./pages/NotFound";
import DoctorManagement from "./pages/DoctorManagement";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: '#e6f9f0',
              color: '#0f5132',
              border: '1px solid #0f5132',
            },
            iconTheme: {
              primary: '#198754',
              secondary: '#e6f9f0',
            },
          },
          error: {
            style: {
              background: '#fde2e1',
              color: '#842029',
              border: '1px solid #842029',
            },
            iconTheme: {
              primary: '#dc3545',
              secondary: '#fde2e1',
            },
          },
        }}
      />
      <ShadcnToaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/appointments/book" element={<AppointmentBooking />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/health-records" element={<HealthRecordsPage />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/doctor-management" element={<DoctorManagement/>} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/health-records" element={<DoctorHealthRecords />} />
        <Route path="/doctor/consent" element={<DoctorConsent />} />
        <Route path="/doctor/notifications" element={<DoctorNotifications />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </AuthProvider>
  );
};

export default App;
