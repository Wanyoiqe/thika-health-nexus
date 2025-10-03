import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// Mock doctor data
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
    availableTimes: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Pediatrician',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
    availableTimes: ['10:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'],
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialization: 'Dermatologist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
    availableTimes: ['08:00 AM', '10:30 AM', '01:30 PM', '04:30 PM'],
  },
  {
    id: 4,
    name: 'Dr. James Williams',
    specialization: 'Orthopedic Surgeon',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop',
    availableTimes: ['09:30 AM', '12:00 PM', '02:30 PM', '05:00 PM'],
  },
  {
    id: 5,
    name: 'Dr. Lisa Anderson',
    specialization: 'Neurologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
    availableTimes: ['08:30 AM', '11:30 AM', '02:00 PM', '04:00 PM'],
  },
  {
    id: 6,
    name: 'Dr. David Kim',
    specialization: 'General Practitioner',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop',
    availableTimes: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],
  },
];

const AppointmentBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    setSelectedDoctor(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = (doctorId: number) => {
    setSelectedDoctor(doctorId);
    // In production, this would make an API call to book the appointment
    console.log('Booking appointment:', { doctorId, date: selectedDate, time: selectedTime });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Your Appointment</h1>
          <p className="text-muted-foreground text-lg">
            Please pick a time for your appointment
          </p>
        </div>

        {/* Calendar Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date & Time
            </CardTitle>
            <CardDescription>
              Choose your preferred appointment date and time slot
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
              className="rounded-md border pointer-events-auto"
            />
            
            {selectedDate && (
              <div className="mt-6 w-full max-w-2xl">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Available time slots for {format(selectedDate, 'MMMM dd, yyyy')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {mockDoctors[0].availableTimes.map((time) => (
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
          </CardContent>
        </Card>

        {/* Available Doctors Section */}
        {selectedDate && selectedTime && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Available Doctors</h2>
            <p className="text-muted-foreground mb-6">
              Select a healthcare provider for your appointment
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDoctors.map((doctor) => (
                <Card 
                  key={doctor.id} 
                  className={`transition-all hover:shadow-lg ${
                    selectedDoctor === doctor.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={doctor.image} alt={doctor.name} />
                        <AvatarFallback>
                          {doctor.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-xl">{doctor.name}</CardTitle>
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
                        {doctor.availableTimes.slice(0, 3).map((time) => (
                          <Badge key={time} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleBookAppointment(doctor.id)}
                      disabled={selectedDoctor === doctor.id}
                    >
                      {selectedDoctor === doctor.id ? 'Appointment Booked!' : 'Book Appointment'}
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
