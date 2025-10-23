import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Mail, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit?: string;
  totalVisits: number;
}

const DoctorPatients: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      age: 45,
      gender: 'Male',
      phone: '+254 712 345 678',
      email: 'john.doe@email.com',
      lastVisit: '2025-10-20',
      totalVisits: 12
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      age: 32,
      gender: 'Female',
      phone: '+254 723 456 789',
      email: 'jane.smith@email.com',
      lastVisit: '2025-10-21',
      totalVisits: 8
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Johnson',
      age: 28,
      gender: 'Male',
      phone: '+254 734 567 890',
      email: 'michael.j@email.com',
      lastVisit: '2025-10-19',
      totalVisits: 5
    },
  ]);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Patients</h1>
            <p className="text-muted-foreground mt-1">Manage your patient list and records</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Patients: <span className="font-semibold text-foreground">{patients.length}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, email, or phone..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl">
                      {patient.firstName} {patient.lastName}
                    </CardTitle>
                    <CardDescription>
                      {patient.age} years • {patient.gender}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last Visit: {patient.lastVisit || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Badge variant="secondary">
                    {patient.totalVisits} visits
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    variant="default"
                    onClick={() => navigate(`/doctor/patients/${patient.id}/records`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No patients found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default DoctorPatients;
