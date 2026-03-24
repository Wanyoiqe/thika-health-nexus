import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/AuthContext';
import { getMyHealthRecords } from '@/apis/health-records';
import { getPastAppointments } from '@/apis/appointments';
import { toast } from '@/hooks/use-toast';
import type { HealthRecord, LabResults as ApiLabResults, Medication as ApiMedication, Vitals as ApiVitals } from '@/types';
import type {
  Patient,
  LabResult,
  Medication,
  VitalSign,
  RecentActivity,
} from '@/mock/healthRecords';

// Transform a lab_results health record to the component's LabResult shape
const toLabResult = (record: HealthRecord): LabResult => {
  const d = record.data as ApiLabResults;
  return {
    id: record.id,
    testName: d.testName,
    date: record.created_at,
    provider: 'Healthcare Provider',
    status: 'completed',
    results: `${d.result}${d.normalRange ? ` (Normal range: ${d.normalRange})` : ''}${d.notes ? ` — ${d.notes}` : ''}`,
  };
};

// Transform a medication health record to the component's Medication shape
const toMedication = (record: HealthRecord): Medication => {
  const d = record.data as ApiMedication;
  return {
    id: record.id,
    name: d.medicationName,
    dosage: d.dosage,
    instructions: `${d.frequency}${d.duration ? `, ${d.duration}` : ''}${d.instructions ? ` — ${d.instructions}` : ''}`,
    startDate: record.created_at,
    prescribingDoctor: 'Healthcare Provider',
    status: 'current',
  };
};

// Transform a vitals health record to the component's VitalSign shape
const toVitalSign = (record: HealthRecord): VitalSign => {
  const d = record.data as ApiVitals;
  const [systolic, diastolic] = (d.bloodPressure || '0/0').split('/').map(Number);
  return {
    date: record.created_at.split('T')[0],
    bpSystolic: systolic || 0,
    bpDiastolic: diastolic || 0,
    heartRate: Number(d.heartRate) || 0,
    temperature: Number(d.temperature) || 0,
    weight: Number(d.weight) || 0,
    height: d.height ? Number(d.height) : undefined,
  };
};

const HealthRecordsPage: React.FC = () => {
  const { user } = useAuth();
  let { refreshToken } = useAuth();

  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Build a Patient shape from the authenticated user for PersonalDetails
  const patientForDisplay: Patient | null = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: '',
        age: 0,
        gender: '',
        bloodType: '',
        phone: user.phone,
        email: user.email,
        address: '',
        emergencyContact: { name: '', relationship: '', phone: '' },
      }
    : null;

  useEffect(() => {
    if (refreshToken === null) {
      refreshToken = localStorage.getItem('refreshToken')!;
    }
    if (user && refreshToken) {
      fetchHealthData(refreshToken);
    }
  }, [user]);

  const fetchHealthData = async (token: string) => {
    setIsLoading(true);
    try {
      const [recordsRes, appointmentsRes] = await Promise.allSettled([
        getMyHealthRecords(token),
        getPastAppointments(token),
      ]);

      if (recordsRes.status === 'fulfilled') {
        const records: HealthRecord[] = recordsRes.value.health_records || [];
        setLabResults(records.filter(r => r.record_type === 'lab_results').map(toLabResult));
        setMedications(records.filter(r => r.record_type === 'medication').map(toMedication));
        setVitalSigns(
          records
            .filter(r => r.record_type === 'vitals')
            .map(toVitalSign)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
      }

      if (appointmentsRes.status === 'fulfilled') {
        const activity: RecentActivity[] = (appointmentsRes.value.appointments || [])
          .slice(0, 5)
          .map(appt => ({
            id: appt.app_id,
            type: 'appointment' as const,
            description: appt.provider
              ? `Appointment with Dr. ${appt.provider.firstName} ${appt.provider.lastName}`
              : 'Appointment',
            date: appt.date_time.split('T')[0],
            icon: 'Calendar',
          }));
        setRecentActivity(activity);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load health records',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Records</h1>
          <p className="text-muted-foreground">
            View and manage your complete medical history and health information
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search records, medications, tests..."
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            {patientForDisplay && <PersonalDetails patient={patientForDisplay} />}
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="labs">Labs</TabsTrigger>
                <TabsTrigger value="medications">Meds</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-6">
                {/* TODO: wire to GET /api/health-records/diagnoses once backend endpoint is available */}
                <MedicalHistory diagnoses={[]} />
              </TabsContent>

              <TabsContent value="labs" className="mt-6">
                {isLoading
                  ? <p className="text-muted-foreground text-sm">Loading...</p>
                  : <LabResults labResults={labResults} />}
              </TabsContent>

              <TabsContent value="medications" className="mt-6">
                {isLoading
                  ? <p className="text-muted-foreground text-sm">Loading...</p>
                  : <Medications medications={medications} />}
              </TabsContent>

              <TabsContent value="vitals" className="mt-6">
                {isLoading
                  ? <p className="text-muted-foreground text-sm">Loading...</p>
                  : <VitalSigns vitalSigns={vitalSigns} />}
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <QuickActions recentActivity={recentActivity} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HealthRecordsPage;
