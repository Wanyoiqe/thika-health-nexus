
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentList from "@/components/dashboard/AppointmentList";
import RecentRecords from "@/components/dashboard/RecentRecords";
import ConsentRequests from "@/components/dashboard/ConsentRequests";
import { 
  Users, 
  Calendar, 
  FileText, 
  Bell,
  ShieldAlert,
  Activity,
  LineChart,
  UserCheck,
} from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, Dr. Kamau. Here's an overview of your clinic.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Patients"
            value="1,248"
            description="Active patient records"
            icon={<Users className="h-5 w-5" />}
            change={{ value: "5.2%", positive: true }}
          />
          <StatCard
            title="Appointments"
            value="37"
            description="Scheduled this week"
            icon={<Calendar className="h-5 w-5" />}
            change={{ value: "2.1%", positive: true }}
          />
          <StatCard
            title="Medical Records"
            value="283"
            description="Updated this month"
            icon={<FileText className="h-5 w-5" />}
            change={{ value: "12.3%", positive: true }}
          />
          <StatCard
            title="Consent Requests"
            value="8"
            description="Pending approval"
            icon={<ShieldAlert className="h-5 w-5" />}
            change={{ value: "3.7%", positive: false }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentRecords />
          </div>
          <div>
            <ConsentRequests />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AppointmentList />
          </div>
          <div>
            <div className="healthcare-card p-4 space-y-4">
              <h3 className="font-medium text-lg">System Health</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span>System Status</span>
                  </div>
                  <div className="text-green-500 font-medium">Operational</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-blue-500" />
                    <span>Server Performance</span>
                  </div>
                  <div className="text-blue-500 font-medium">98%</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                    <span>Security Updates</span>
                  </div>
                  <div className="text-amber-500 font-medium">Available</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-violet-500" />
                    <span>User Permissions</span>
                  </div>
                  <div className="text-violet-500 font-medium">Up to date</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-red-500" />
                    <span>Emergency Alerts</span>
                  </div>
                  <div className="text-red-500 font-medium">No alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
