import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  app_id: string;
  date_time: string;
  patient?: {
    firstName: string;
    lastName: string;
    phone: string;
    id: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled';
  type: string;
  notes?: string;
}

const DoctorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      app_id: '1',
      date_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      patient: { firstName: 'John', lastName: 'Doe', phone: '+254 712 345 678', id: '1' },
      status: 'scheduled',
      type: 'Follow-up',
      notes: 'Blood pressure check'
    },
    {
      app_id: '2',
      date_time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      patient: { firstName: 'Jane', lastName: 'Smith', phone: '+254 723 456 789', id: '2' },
      status: 'scheduled',
      type: 'Consultation',
      notes: 'Initial consultation'
    },
    {
      app_id: '3',
      date_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      patient: { firstName: 'Michael', lastName: 'Johnson', phone: '+254 734 567 890', id: '3' },
      status: 'completed',
      type: 'Check-up',
      notes: 'Annual physical'
    },
  ]);

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(appt =>
        appt.app_id === appointmentId ? { ...appt, status: 'completed' as const } : appt
      )
    );
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(appt =>
        appt.app_id === appointmentId ? { ...appt, status: 'cancelled' as const } : appt
      )
    );
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {appointment.patient ? `${appointment.patient.firstName[0]}${appointment.patient.lastName[0]}` : 'NA'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold">
                {appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Unknown Patient'}
              </h3>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(appointment.date_time), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(appointment.date_time), 'h:mm aa')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{appointment.patient?.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Thika Health Center</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">{appointment.type}</Badge>
              <Badge 
                variant={
                  appointment.status === 'completed' ? 'default' :
                  appointment.status === 'cancelled' ? 'destructive' :
                  'secondary'
                }
              >
                {appointment.status}
              </Badge>
            </div>

            {appointment.notes && (
              <p className="text-sm text-muted-foreground">
                Notes: {appointment.notes}
              </p>
            )}
          </div>

          {appointment.status === 'scheduled' && (
            <div className="flex flex-col gap-2">
              <Button 
                size="sm" 
                className="gap-2"
                onClick={() => handleCompleteAppointment(appointment.app_id)}
              >
                <CheckCircle className="h-4 w-4" />
                Complete
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="gap-2"
                onClick={() => handleCancelAppointment(appointment.app_id)}
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage your patient appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{completedAppointments.length}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{cancelledAppointments.length}</div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                  <p className="text-muted-foreground">Your schedule is clear</p>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map(appointment => (
                <AppointmentCard key={appointment.app_id} appointment={appointment} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No completed appointments</h3>
                  <p className="text-muted-foreground">Completed appointments will appear here</p>
                </CardContent>
              </Card>
            ) : (
              completedAppointments.map(appointment => (
                <AppointmentCard key={appointment.app_id} appointment={appointment} />
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4 mt-6">
            {cancelledAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No cancelled appointments</h3>
                  <p className="text-muted-foreground">Cancelled appointments will appear here</p>
                </CardContent>
              </Card>
            ) : (
              cancelledAppointments.map(appointment => (
                <AppointmentCard key={appointment.app_id} appointment={appointment} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DoctorAppointments;
