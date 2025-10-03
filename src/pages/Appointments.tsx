import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar, Clock, MapPin, Phone, Video, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
    },
    date: new Date(2025, 9, 15),
    time: '10:00 AM',
    location: 'Cardiology Wing, Room 204',
    type: 'In-person',
    status: 'upcoming',
  },
  {
    id: 2,
    doctor: {
      name: 'Dr. Michael Chen',
      specialization: 'Pediatrician',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
    },
    date: new Date(2025, 9, 20),
    time: '02:00 PM',
    location: 'Virtual Consultation',
    type: 'Video Call',
    status: 'upcoming',
  },
  {
    id: 3,
    doctor: {
      name: 'Dr. Emily Rodriguez',
      specialization: 'Dermatologist',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
    },
    date: new Date(2025, 8, 28),
    time: '11:30 AM',
    location: 'Dermatology Clinic, Room 105',
    type: 'In-person',
    status: 'completed',
  },
];

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredAppointments = mockAppointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

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
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-4">
                  No {filter !== 'all' ? filter : ''} appointments found
                </p>
                <Button onClick={() => navigate('/appointments/book')}>
                  Book Your First Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={appointment.doctor.image}
                          alt={appointment.doctor.name}
                        />
                        <AvatarFallback>
                          {appointment.doctor.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl mb-1">
                          {appointment.doctor.name}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {appointment.doctor.specialization}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(appointment.date, 'EEEE, MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {appointment.type === 'Video Call' ? (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{appointment.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{appointment.type}</Badge>
                    </div>
                  </div>
                  {appointment.status === 'upcoming' && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                      {appointment.type === 'Video Call' && (
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join Call
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;
