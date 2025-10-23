import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  Activity, 
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle,
  Bell,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Appointment {
  app_id: string;
  date_time: string;
  patient?: {
    firstName: string;
    lastName: string;
    id: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  lastVisit?: string;
}

interface ConsentRequest {
  id: string;
  patient_name: string;
  request_date: string;
  status: 'pending' | 'approved' | 'denied';
  type: string;
}

const DoctorDashboard: React.FC = () => {
  const { user, refreshToken } = useAuth();
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // In production, fetch real data from your backend
    setAppointments([
      {
        app_id: '1',
        date_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        patient: { firstName: 'John', lastName: 'Doe', id: '1' },
        status: 'scheduled'
      },
      {
        app_id: '2',
        date_time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
        patient: { firstName: 'Jane', lastName: 'Smith', id: '2' },
        status: 'scheduled'
      }
    ]);

    setPatients([
      { id: '1', firstName: 'John', lastName: 'Doe', age: 45, gender: 'Male', lastVisit: '2025-10-20' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', age: 32, gender: 'Female', lastVisit: '2025-10-21' },
      { id: '3', firstName: 'Michael', lastName: 'Johnson', age: 28, gender: 'Male', lastVisit: '2025-10-19' },
    ]);

    setConsentRequests([
      { id: '1', patient_name: 'John Doe', request_date: '2025-10-22', status: 'pending', type: 'Medical History' },
      { id: '2', patient_name: 'Jane Smith', request_date: '2025-10-21', status: 'approved', type: 'Lab Results' },
    ]);
  }, []);

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-primary' },
    { label: "Today's Appointments", value: appointments.length, icon: Calendar, color: 'text-secondary' },
    { label: 'Pending Consents', value: consentRequests.filter(c => c.status === 'pending').length, icon: FileText, color: 'text-accent' },
    { label: 'Completed Today', value: 0, icon: CheckCircle, color: 'text-secondary' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, Dr. {user?.lastName}</h1>
            <p className="text-muted-foreground mt-1">Here's your clinical overview for today</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/doctor/appointments')} className="gap-2">
              <Calendar className="h-4 w-4" />
              View Schedule
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search patients, appointments, records..."
            className="pl-10 h-12"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Urgent Notification */}
        {appointments.length > 0 && (
          <Card className="border-l-4 border-l-primary bg-primary/5 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold">Next Appointment</h3>
                  <p className="text-sm text-muted-foreground">
                    {appointments[0].patient?.firstName} {appointments[0].patient?.lastName} - {format(new Date(appointments[0].date_time), 'h:mm aa')}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/doctor/appointments')}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Today's Appointments
                  </CardTitle>
                  <CardDescription>Scheduled patient visits</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/appointments')}>
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No appointments scheduled</p>
              ) : (
                appointments.map((appt) => (
                  <div key={appt.app_id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {appt.patient ? `${appt.patient.firstName[0]}${appt.patient.lastName[0]}` : 'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">
                        {appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : 'Unknown Patient'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(appt.date_time), 'h:mm aa')}</span>
                      </div>
                    </div>
                    <Badge variant={appt.status === 'scheduled' ? 'default' : 'secondary'}>
                      {appt.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    Recent Patients
                  </CardTitle>
                  <CardDescription>Your recent patient consultations</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/patients')}>
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {patients.slice(0, 3).map((patient) => (
                <div key={patient.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{patient.firstName} {patient.lastName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} yrs • {patient.gender}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Records
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Consent Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Consent Requests
                  </CardTitle>
                  <CardDescription>Pending and recent consents</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/consent')}>
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {consentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No consent requests</p>
                  <Button variant="outline" size="sm" className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Request Consent
                  </Button>
                </div>
              ) : (
                consentRequests.map((request) => (
                  <div key={request.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{request.patient_name}</h4>
                      <p className="text-sm text-muted-foreground">{request.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested: {format(new Date(request.request_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        request.status === 'approved' ? 'default' : 
                        request.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('/doctor/health-records')}>
                <FileText className="h-4 w-4" />
                Add Health Record
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('/doctor/consent')}>
                <Plus className="h-4 w-4" />
                Request Patient Consent
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('/doctor/patients')}>
                <Users className="h-4 w-4" />
                View All Patients
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('/doctor/notifications')}>
                <Bell className="h-4 w-4" />
                View Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DoctorDashboard;
