import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Calendar,
  Clock,
  Users,
  Activity,
  AlertCircle,
  FileText,
  CheckCircle,
  Bell,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { format, isToday } from 'date-fns';
import { getDoctorAllAppointments } from '@/apis/appointments';
import { fetchDoctorsPatients } from '@/apis/providers';
import { getDoctorConsentRequests } from '@/apis/consent';
import type { Appointment, Patient, ConsentItem } from '@/types';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  let { refreshToken } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consentRequests, setConsentRequests] = useState<ConsentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (refreshToken === null) {
      refreshToken = localStorage.getItem('refreshToken')!;
    }
    if (user && refreshToken) {
      fetchDashboardData(refreshToken);
    }
  }, [user]);

  const fetchDashboardData = async (token: string) => {
    setIsLoading(true);
    try {
      const [appointmentsRes, patientsRes, consentsRes] = await Promise.allSettled([
        getDoctorAllAppointments(token),
        fetchDoctorsPatients(token),
        getDoctorConsentRequests(token),
      ]);

      if (appointmentsRes.status === 'fulfilled') {
        setAppointments(appointmentsRes.value.appointments);
      }
      if (patientsRes.status === 'fulfilled') {
        setPatients(patientsRes.value.patients ?? []);
      }
      if (consentsRes.status === 'fulfilled') {
        setConsentRequests(consentsRes.value.consents ?? []);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toDateString();
  const upcoming   = appointments.filter(a => a.status === 'scheduled');
  const todayAppts = appointments.filter(a => isToday(new Date(a.date_time)));
  const completedToday = appointments.filter(
    a => a.status === 'completed' && new Date(a.date_time).toDateString() === today
  );
  const pendingConsents = consentRequests.filter(c => c.status === 'pending');

  const stats = [
    { label: 'Total Patients',       value: patients.length,        icon: Users,        color: 'text-primary'     },
    { label: 'Upcoming Appointments', value: upcoming.length,        icon: Calendar,     color: 'text-secondary'   },
    { label: 'Pending Consents',      value: pendingConsents.length, icon: FileText,     color: 'text-accent'      },
    { label: 'Completed Today',       value: completedToday.length,  icon: CheckCircle,  color: 'text-secondary'   },
  ];

  const nextAppt = upcoming.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())[0];

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, Dr. {user?.lastName}</h1>
            <p className="text-muted-foreground mt-1">Here's your clinical overview for today</p>
          </div>
          <Button onClick={() => navigate('/doctor/appointments')} className="gap-2 w-fit">
            <Calendar className="h-4 w-4" />
            View Schedule
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search patients, appointments, records..." className="pl-10 h-12" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    {isLoading
                      ? <Skeleton className="h-8 w-12 mt-2" />
                      : <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    }
                  </div>
                  <div className="p-3 rounded-full bg-muted">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Next Appointment Banner */}
        {!isLoading && nextAppt && (
          <Card className="border-l-4 border-l-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">Next Appointment</h3>
                  <p className="text-sm text-muted-foreground">
                    {nextAppt.patient
                      ? `${nextAppt.patient.firstName} ${nextAppt.patient.lastName}`
                      : 'Patient'}{' '}
                    — {format(new Date(nextAppt.date_time), 'MMM dd, h:mm aa')}
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
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                [1, 2].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              ) : todayAppts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No appointments scheduled for today</p>
              ) : (
                todayAppts.slice(0, 4).map((appt) => (
                  <div key={appt.app_id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {appt.patient
                          ? `${appt.patient.firstName?.[0] ?? ''}${appt.patient.lastName?.[0] ?? ''}`.toUpperCase()
                          : 'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : 'Unknown Patient'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(appt.date_time), 'h:mm aa')}</span>
                      </div>
                    </div>
                    <Badge variant={appt.status === 'scheduled' ? 'secondary' : appt.status === 'completed' ? 'default' : 'destructive'} className="capitalize shrink-0">
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
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))
              ) : patients.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No patients found</p>
              ) : (
                patients.slice(0, 3).map((patient) => (
                  <div key={patient.patient_id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                        {(patient.full_name || patient.name || 'UN').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{patient.full_name || patient.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {patient.totalVisits} visit{patient.totalVisits !== 1 ? 's' : ''}{' '}
                        {patient.lastVisit ? `• Last: ${format(new Date(patient.lastVisit), 'MMM dd, yyyy')}` : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                [1, 2].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              ) : consentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No consent requests</p>
                  <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={() => navigate('/doctor/consent')}>
                    <Plus className="h-4 w-4" />
                    Request Consent
                  </Button>
                </div>
              ) : (
                consentRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{request.patient_name ?? 'Patient'}</h4>
                      {request.type && <p className="text-sm text-muted-foreground">{request.type}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(request.request_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Badge
                      variant={request.status === 'approved' ? 'default' : request.status === 'pending' ? 'secondary' : 'destructive'}
                      className="capitalize shrink-0"
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
