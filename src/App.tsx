
import Index from "./pages/Index";
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import PatientDashboard from './pages/PatientDashboard';
import ProviderDashboard from './components/dashboard/provider';
import AdminDashboard from './components/dashboard/Admin';
import Register from './pages/auth/Register';
import AppointmentBooking from './pages/AppointmentBooking';
import Appointments from './pages/Appointments';
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';

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
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
