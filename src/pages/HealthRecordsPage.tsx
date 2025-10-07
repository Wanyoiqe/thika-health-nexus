import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalDetails } from '@/components/health-records/PersonalDetails';
import { MedicalHistory } from '@/components/health-records/MedicalHistory';
import { LabResults } from '@/components/health-records/LabResults';
import { Medications } from '@/components/health-records/Medications';
import { VitalSigns } from '@/components/health-records/VitalSigns';
import { QuickActions } from '@/components/health-records/QuickActions';
import { Search } from 'lucide-react';
import {
  mockPatient,
  mockDiagnoses,
  mockLabResults,
  mockMedications,
  mockVitalSigns,
  mockRecentActivity,
} from '@/mock/healthRecords';

const HealthRecordsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Records</h1>
          <p className="text-muted-foreground">
            View and manage your complete medical history and health information
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search records, medications, tests..."
            className="pl-10"
          />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Personal Details */}
          <div className="lg:col-span-1">
            <PersonalDetails patient={mockPatient} />
          </div>

          {/* Main Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="labs">Labs</TabsTrigger>
                <TabsTrigger value="medications">Meds</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-6">
                <MedicalHistory diagnoses={mockDiagnoses} />
              </TabsContent>

              <TabsContent value="labs" className="mt-6">
                <LabResults labResults={mockLabResults} />
              </TabsContent>

              <TabsContent value="medications" className="mt-6">
                <Medications medications={mockMedications} />
              </TabsContent>

              <TabsContent value="vitals" className="mt-6">
                <VitalSigns vitalSigns={mockVitalSigns} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions recentActivity={mockRecentActivity} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HealthRecordsPage;
