import React from 'react';
import Index from "./pages/Index";
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import PatientDashboard from './components/dashboard/patient';
import ProviderDashboard from './components/dashboard/provider';
import AdminDashboard from './components/dashboard/Admin';
import Register from './pages/auth/Register';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
