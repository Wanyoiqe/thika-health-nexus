import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar, Clock, MapPin, Phone, Video, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getAllAppointments, getUpcomingAppointments, getPastAppointments } from '@/apis/appointments';

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshToken } = useAuth();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Map server appointment into UI shape used in this page
  const mapServerAppointment = (apt: any) => {
    const provider = apt.provider || null;
    const doctorName = provider ? `${provider.firstName || ''} ${provider.lastName || ''}`.trim() : 'Unknown';
    const date = new Date(apt.date_time || apt.date || apt.dateTime || Date.now());
    const time = format(date, 'hh:mm aa');
    const location = provider && provider.hospital_id ? `Hospital ${provider.hospital_id}` : 'Virtual Consultation';
    const image = provider?.profileUrl || '/placeholder.svg';
    const type = location === 'Virtual Consultation' ? 'Video Call' : 'In-person';

    return {
      id: apt.app_id || apt.id,
      doctor: {
        name: doctorName,
        specialization: provider?.specialization || '',
        image,
      },
      date,
      time,
      location,
      type,
      status: apt.status || 'upcoming',
    };
  };

  const fetchAppointments = async () => {
    if (!refreshToken) return;
    setIsLoading(true);
    try {
      let resp: any;
      if (filter === 'all') {
        resp = await getAllAppointments(refreshToken);
      } else if (filter === 'upcoming') {
        resp = await getUpcomingAppointments(refreshToken);
      } else {
        resp = await getPastAppointments(refreshToken);
      }

      const serverAppts = resp.appointments || [];
      setAppointments(serverAppts.map(mapServerAppointment));
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to fetch appointments', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && refreshToken) fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshToken, filter]);

  const filteredAppointments = appointments;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      upcoming: 'default',
      completed: 'secondary',
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Appointments</h1>
            <p className="text-muted-foreground">
              View and manage your scheduled appointments
            </p>
          </div>
          <Button onClick={() => navigate('/appointments/book')}>
            Book New Appointment
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {isLoading && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading appointments...</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && filteredAppointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-4">
                  No {filter !== 'all' ? filter : ''} appointments.
                </p>
                <Button onClick={() => navigate('/appointments/book')}>
                  Book Your First Appointment
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && filteredAppointments.map((appt) => (
            <Card key={appt.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={appt.doctor.image} alt={appt.doctor.name} />
                      <AvatarFallback>
                        {appt.doctor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl mb-1">{appt.doctor.name}</CardTitle>
                      <CardDescription className="text-base">{appt.doctor.specialization}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(appt.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(appt.date, 'EEEE, MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appt.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {appt.type === 'Video Call' ? (
                      <Video className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{appt.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{appt.type}</Badge>
                  </div>
                </div>
                {appt.status === 'upcoming' && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                    {appt.type === 'Video Call' && (
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Join Call
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;
