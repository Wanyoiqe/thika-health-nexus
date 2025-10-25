import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Calendar, Clock, MapPin, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '@/AuthContext';
import { fetchReceptionistDashboardDetails } from '@/apis/providers';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ReceptionistData } from '@/types';

const ReceptionistDashboard: React.FC = () => {
  const [ receptionistData, setReceptionistData] = useState(null);
  const { user } = useAuth();
  let { refreshToken } = useAuth();
  refreshToken = localStorage.getItem('refreshToken')!;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (user && refreshToken) {
      fetchReceptionistDataDetails();
    }
  }, [user]);

  const fetchReceptionistDataDetails = async () => {
    // Implement data fetching logic specific to receptionist dashboard
    setIsLoading(true);
    try {
      const data = await fetchReceptionistDashboardDetails(refreshToken);
      setReceptionistData(data.data);
    } catch (error: any) {
      console.error('Error fetching receptionist dashboard details:', error);
      toast.error('Failed to load receptionist dashboard details.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search appointments, records, doctors..."
            className="pl-10 h-12"
          />
        </div>

        {/* {Receptionist Details} */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-secondary" />
              Receptionist Overview
            </CardTitle>
            <CardDescription>Key metrics and recent activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <h3 className="text-2xl font-bold">{receptionistData ? receptionistData.patientCount : '-'}</h3>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <h3 className="text-2xl font-bold">{receptionistData ? receptionistData.staffCount : '-'}</h3>
                <p className="text-sm text-muted-foreground">Total Staff</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <h3 className="text-2xl font-bold">{receptionistData ? receptionistData.appointmentCount : '-'}</h3>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <h3 className="text-2xl font-bold">{receptionistData ? receptionistData.appointmentCountToday : '-'}</h3>
                <p className="text-sm text-muted-foreground">Appointments Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ReceptionistDashboard;