import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentList from "@/components/dashboard/AppointmentList";
import RecentRecords from "@/components/dashboard/RecentRecords";
import ConsentRequests from "@/components/dashboard/ConsentRequests";
import PatientOverview from "@/pages/PatientOverview";
import { 
  Users, Calendar, FileText, Bell, ShieldAlert, Activity, 
  LineChart, UserCheck, ClipboardList, HeartPulse, Stethoscope 
} from "lucide-react";

const Dashboard: React.FC = () => {
  // Fallback role system (replace with real auth when ready)
  const [role, setRole] = useState<"patient" | "provider">("provider");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get role from multiple sources
    const determineRole = () => {
      // 1. Check URL first (for testing)
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get("role");
      
      // 2. Check localStorage (if you store role there after login)
      const localStorageRole = localStorage.getItem("userRole");
      
      // 3. Default fallback
      setRole(
        urlRole === "patient" ? "patient" :
        localStorageRole === "patient" ? "patient" :
        "provider" // Default to provider view
      );
      setLoading(false);
    };

    determineRole();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Role-based header */}
        {role === "provider" ? (
          <>
            <div>
              <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
              <p className="text-gray-500">
                Welcome back, Dr. Kamau. Here's your clinic overview.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Patients"
                value="1,248"
                description="Active records"
                icon={<Users className="h-5 w-5" />}
                change={{ value: "+5.2%", positive: true }}
              />
              {/* ... other provider stat cards ... */}
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold mb-2">Patient Dashboard</h1>
              <p className="text-gray-500">
                Welcome back! Here's your health summary.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Upcoming Appointments"
                value="2"
                description="Next 7 days"
                icon={<Calendar className="h-5 w-5" />}
                change={{ value: "1 new", positive: true }}
              />
              {/* ... other patient stat cards ... */}
            </div>
          </>
        )}

        {/* Role-specific content sections */}
        {role === "provider" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentRecords />
              </div>
              <div>
                <ConsentRequests />
              </div>
            </div>
            <AppointmentList />
          </div>
        ) : (
          <PatientOverview />
        )}

        {/* Temporary role switcher for development */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 right-4 bg-white p-3 shadow-lg rounded-lg border">
            <p className="text-sm font-medium mb-2">DEV: Switch View</p>
            <div className="flex gap-2">
              <button
                onClick={() => setRole("provider")}
                className={`px-3 py-1 text-xs rounded ${
                  role === "provider" ? "bg-blue-600 text-white" : "bg-blue-100"
                }`}
              >
                Provider
              </button>
              <button
                onClick={() => setRole("patient")}
                className={`px-3 py-1 text-xs rounded ${
                  role === "patient" ? "bg-green-600 text-white" : "bg-green-100"
                }`}
              >
                Patient
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;