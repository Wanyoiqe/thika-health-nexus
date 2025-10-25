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
import { getUpcomingAppointments } from '@/apis/appointments';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ConsentManagement from '@/components/dashboard/ConsentManagement';

interface Appointment {
  app_id: string;
  date_time: string;
  provider_id: string | null;
  provider?: {
    firstName: string;
    lastName: string;
    specialization: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled';
}

const PatientDashboard: React.FC = () => {
  const { user,  } = useAuth();
  let {refreshToken} = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (refreshToken === null) {
      refreshToken = localStorage.getItem('refreshToken')!;
    }
    if (user && refreshToken) {
      fetchUpcomingAppointments();
    }
  }, [user]);

  const fetchUpcomingAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await getUpcomingAppointments(refreshToken);
      console.log('Upcoming Appointments:', response);
      setAppointments(response.appointments);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch upcoming appointments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAllAppointments = () => {
    navigate('/appointments');
  };

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

        {/* Notification Card */}
        {appointments.length > 0 && (
          <Card className="border-l-4 border-l-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Upcoming Appointment</h3>
                  <p className="text-sm text-muted-foreground">
                    You have an appointment with {appointments[0].provider?.firstName} {appointments[0].provider?.lastName} on {format(new Date(appointments[0].date_time), 'MMMM dd, yyyy')} at {format(new Date(appointments[0].date_time), 'h:mm aa')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled visits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading && <p className="text-muted-foreground">Loading appointments...</p>}
              {!isLoading && appointments.length === 0 && (
                <p className="text-muted-foreground">No upcoming appointments.</p>
              )}
              {appointments.map((appt) => (
                <div key={appt.app_id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {appt.provider ? `${appt.provider.firstName[0]}${appt.provider.lastName[0]}` : 'N/A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {appt.provider ? `${appt.provider.firstName} ${appt.provider.lastName}` : 'No provider assigned'}
                    </h4>
                    <p className="text-sm text-muted-foreground">{appt.provider?.specialization || 'N/A'}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{format(new Date(appt.date_time), 'MMMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{format(new Date(appt.date_time), 'h:mm aa')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>Thika Health Center</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={handleViewAllAppointments}>
                View All Appointments
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates to your health records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Dr. John Mwangi', specialty: 'Cardiologist', update: 'Added new lab results' },
                { name: 'Dr. Mary Njeri', specialty: 'Dermatologist', update: 'Updated prescription' },
                { name: 'Dr. Peter Ochieng', specialty: 'Orthopedic', update: 'Completed consultation notes' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {activity.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm">{activity.name}</h5>
                    <p className="text-xs text-muted-foreground">{activity.specialty}</p>
                    <p className="text-xs text-foreground mt-0.5">{activity.update}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientDashboard;