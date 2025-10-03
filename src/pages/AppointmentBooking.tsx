import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { Clock, Calendar as CalendarIcon, ChevronRight, FileText } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/AuthContext';
import { bookAppointment, getAvailableDoctors } from '@/apis/appointments';
import { BookAppointmentRequestDTO, Provider } from '@/types';

const AppointmentBooking: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      // Fetch available doctors for the selected date (24-hour window)
      const from = selectedDate.toISOString();
      const to = addHours(selectedDate, 24).toISOString();
      fetchAvailableDoctors({ from, to });
    }
  }, [selectedDate]);

  const fetchAvailableDoctors = async (data: { from: string; to: string }) => {
    setIsLoading(true);
    try {
      const response = await getAvailableDoctors(data);
      setDoctors(response.available);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch available doctors',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    setSelectedDoctor(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = async (doctorId: string) => {
    if (!user || !user.token) {
      toast({
        title: 'Error',
        description: 'You must be logged in to book an appointment',
        variant: 'destructive',
      });
      navigate('/auth/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Error',
        description: 'Please select a date and time',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Combine date and time into ISO string
      const [hours, minutes] = selectedTime.split(':');
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const date_time = dateTime.toISOString();

      const request: BookAppointmentRequestDTO = { date_time, provider_id: doctorId };
      await bookAppointment(user.token, request);
      setSelectedDoctor(doctorId);
      const doctor = doctors.find((d) => d.provider_id === doctorId);

      toast({
        title: 'Appointment Booked Successfully!',
        description: `Your appointment with ${doctor?.firstName} ${doctor?.lastName} on ${format(
          selectedDate,
          'MMMM dd, yyyy'
        )} at ${selectedTime} has been confirmed.`,
      });

      // Navigate to appointments page after a short delay
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to book appointment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with View Appointments Button */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Your Appointment</h1>
              <p className="text-muted-foreground text-lg">
                Please pick a time for your appointment
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/appointments')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View My Appointments
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Access Card */}
          <Card className="bg-muted/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Have existing appointments?</p>
                    <p className="text-sm text-muted-foreground">
                      View, reschedule or cancel your appointments
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => navigate('/appointments')}>
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date & Time
            </CardTitle>
            <CardDescription>Choose your preferred appointment date and time slot</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
              className="rounded-md border pointer-events-auto"
            />

            {selectedDate && doctors.length > 0 && (
              <div className="mt-6 w-full max-w-2xl">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Available time slots for {format(selectedDate, 'MMMM dd, yyyy')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {doctors[0].availableTimes?.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => handleTimeSelect(time)}
                      className="w-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {selectedDate && doctors.length === 0 && !isLoading && (
              <p className="mt-6 text-muted-foreground">No available doctors for this date.</p>
            )}
            {isLoading && <p className="mt-6 text-muted-foreground">Loading available doctors...</p>}
          </CardContent>
        </Card>

        {/* Available Doctors Section */}
        {selectedDate && selectedTime && doctors.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Available Doctors</h2>
            <p className="text-muted-foreground mb-6">
              Select a healthcare provider for your appointment
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.provider_id}
                  className={`transition-all hover:shadow-lg ${
                    selectedDoctor === doctor.provider_id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={`/placeholder.svg`} alt={`${doctor.firstName} ${doctor.lastName}`} />
                        <AvatarFallback>
                          {doctor.firstName[0]}
                          {doctor.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-xl">
                      {doctor.firstName} {doctor.lastName}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="secondary" className="mt-2">
                        {doctor.specialization}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Available Times:</p>
                      <div className="flex flex-wrap gap-1">
                        {doctor.availableTimes?.slice(0, 3).map((time) => (
                          <Badge key={time} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleBookAppointment(doctor.provider_id)}
                      disabled={selectedDoctor === doctor.provider_id || isLoading}
                    >
                      {selectedDoctor === doctor.provider_id ? 'Appointment Booked!' : 'Book Appointment'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedDate && (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Select a date from the calendar above to see available doctors</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AppointmentBooking;