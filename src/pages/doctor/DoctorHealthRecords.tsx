import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Activity, Pill, TestTube, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchDoctorsPatients,  } from '@/apis/providers';
import { Appointment, Patient } from '@/types';
import { useAuth } from '@/AuthContext';
import { getPatientAppointments } from '@/apis/appointments';
import { getHealthRecordByAppointment, createHealthRecord } from '@/apis/health-records';
import { HealthRecord } from '@/types';

const DoctorHealthRecords: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthRecord, setHealthRecord] = useState(null);
  const [recordType, setRecordType] = useState<'lab_results' | 'medication' | 'vitals' | ''>('');
  const { user, refreshToken } = useAuth();

  
  // Lab Results Form State
  const [labResults, setLabResults] = useState({
    testName: '',
    result: '',
    normalRange: '',
    notes: '',
  });

  // Medication Form State
  const [medication, setMedication] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  // Vitals Form State
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
  });

  type LabResults = {
    testName: string;
    result: string;
    normalRange: string;
    notes: string;
  };

  type Medication = {
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  };

  type Vitals = {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
  };

  const [patients, setPatients] = useState<Patient[]>([]);
  
  useEffect(() => {
    if (!refreshToken) return;
    const loadPatients = async () => {
      try {
        const data = await fetchDoctorsPatients(refreshToken);
        console.log('Fetched patients:', data.patients);
        setPatients(data.patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to fetch patients');
      }
    };

    loadPatients();
  }, [refreshToken]);

  // Fetch appointments when patient is selected
  useEffect(() => {
    if (!selectedPatient || !refreshToken) return;
    
    const loadAppointments = async () => {
      try {
        const data = await getPatientAppointments(refreshToken, selectedPatient);
        setAppointments(data.appointments);
        setSelectedAppointment(''); // Reset appointment selection
        setHealthRecord(null); // Reset health record
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to fetch appointments');
      }
    };

    loadAppointments();
  }, [selectedPatient, refreshToken]);

  // Fetch health record when appointment is selected
  useEffect(() => {
    if (!selectedAppointment || !refreshToken) return;
    
    const loadHealthRecord = async () => {
      try {
        const response = await getHealthRecordByAppointment(refreshToken, selectedAppointment, selectedPatient);
        console.log('Full response:', response);
        setHealthRecord(response);

        // Check if we have a health record
        if (response?.health_record) {
          const recordData = response.health_record.data;
          console.log('Record type:', response.health_record.record_type);
          console.log('Record data:', recordData);
          
          setRecordType(response.health_record.record_type);
          
          // Set form data based on record type
          if (response.health_record.record_type === 'lab_results') {
            const typedData = recordData as LabResults;
            const normalizedLabData = {
              testName: typedData.testName || '',
              result: typedData.result || '',
              normalRange: typedData.normalRange || '',
              notes: typedData.notes || ''
            };
            console.log('Setting lab data:', normalizedLabData);
            setLabResults(normalizedLabData);
          } else if (response.health_record.record_type === 'medication') {
            const typedData = recordData as Medication;
            const normalizedMedData = {
              medicationName: typedData.medicationName || '',
              dosage: typedData.dosage || '',
              frequency: typedData.frequency || '',
              duration: typedData.duration || '',
              instructions: typedData.instructions || ''
            };
            console.log('Setting medication data:', normalizedMedData);
            setMedication(normalizedMedData);
          } else if (response.health_record.record_type === 'vitals') {
            const typedData = recordData as Vitals;
            const normalizedVitalData = {
              bloodPressure: typedData.bloodPressure || '',
              heartRate: typedData.heartRate || '',
              temperature: typedData.temperature || '',
              weight: typedData.weight || '',
              height: typedData.height || ''
            };
            console.log('Setting vitals data:', normalizedVitalData);
            setVitals(normalizedVitalData);
          }
        } else {
          // Reset forms if no record exists
          setRecordType('');
          resetForms();
        }
      } catch (error) {
        console.error('Error fetching health record:', error);
        // Reset state in case of error
        setHealthRecord(null);
        setRecordType('');
        resetForms();
        toast.error('Failed to fetch health record');
      }
    };

    loadHealthRecord();
  }, [selectedAppointment, refreshToken]);

  const resetForms = () => {
    setLabResults({ testName: '', result: '', normalRange: '', notes: '' });
    setMedication({ medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' });
    setVitals({ bloodPressure: '', heartRate: '', temperature: '', weight: '', height: '' });
  };

  const handleSubmitLabResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) {
      toast.error('Please select an appointment first');
      return;
    }
    try {
      const response = await createHealthRecord(refreshToken!, {
        appointment_id: selectedAppointment,
        record_type: 'lab_results',
        data: labResults
      });
      toast.success('Lab results added successfully');
      // Load the newly created record
      const newRecord = await getHealthRecordByAppointment(refreshToken!, selectedAppointment, selectedPatient);
      setHealthRecord(newRecord);
    } catch (error) {
      console.error('Error submitting lab results:', error);
      toast.error('Failed to save lab results');
    }
  };

  const handleSubmitMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) {
      toast.error('Please select an appointment first');
      return;
    }
    try {
      const response = await createHealthRecord(refreshToken!, {
        appointment_id: selectedAppointment,
        record_type: 'medication',
        data: medication
      });
      toast.success('Medication prescribed successfully');
      // Load the newly created record
      const newRecord = await getHealthRecordByAppointment(refreshToken!, selectedAppointment, selectedPatient);
      setHealthRecord(newRecord);
    } catch (error) {
      console.error('Error submitting medication:', error);
      toast.error('Failed to save medication');
    }
  };

  const handleSubmitVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) {
      toast.error('Please select an appointment first');
      return;
    }
    try {
      const response = await createHealthRecord(refreshToken!, {
        appointment_id: selectedAppointment,
        record_type: 'vitals',
        data: vitals
      });
      toast.success('Vitals recorded successfully');
      // Load the newly created record
      const newRecord = await getHealthRecordByAppointment(refreshToken!, selectedAppointment, selectedPatient);
      setHealthRecord(newRecord);
    } catch (error) {
      console.error('Error submitting vitals:', error);
      toast.error('Failed to save vitals');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Health Records Management</h1>
          <p className="text-muted-foreground mt-1">Add and update patient health records</p>
        </div>

        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Patient</CardTitle>
            <CardDescription>Choose a patient to add or update their health records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-full md:w-[400px]">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.patient_id} value={patient.patient_id}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPatient && appointments.length > 0 && (
                <div className="mt-4">
                  <Label>Select Appointment</Label>
                  <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                    <SelectTrigger className="w-full md:w-[400px]">
                      <SelectValue placeholder="Select an appointment" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointments.map((appointment) => (
                        <SelectItem key={appointment.app_id} value={appointment.app_id}>
                          {new Date(appointment.date_time).toLocaleString()} - {appointment.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedPatient && appointments.length === 0 && (
                <div className="text-sm text-muted-foreground mt-2">
                  No appointments found for this patient
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedAppointment && (
          <Tabs 
            defaultValue={healthRecord?.health_record?.record_type || "lab-results"} 
            className="w-full"
          >
            {healthRecord?.health_record ? (
              <div className="mb-4 space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">Current Record Type: {healthRecord.health_record.record_type}</p>
                  <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date(healthRecord.health_record.updated_at).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> Health records are immutable once created. You are viewing this record in read-only mode.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-sm text-blue-700">
                  <strong>Important:</strong> Select a record type carefully. Once a health record is created, its type cannot be changed.
                </p>
              </div>
            )}
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger 
                value="lab-results"
                disabled={healthRecord?.health_record && healthRecord.health_record.record_type !== 'lab_results'}
              >
                Lab Results
              </TabsTrigger>
              <TabsTrigger 
                value="medications"
                disabled={healthRecord?.health_record && healthRecord.health_record.record_type !== 'medication'}
              >
                Medications
              </TabsTrigger>
              <TabsTrigger 
                value="vitals"
                disabled={healthRecord?.health_record && healthRecord.health_record.record_type !== 'vitals'}
              >
                Vitals
              </TabsTrigger>
            </TabsList>

            {/* Lab Results Tab */}
            <TabsContent value="lab-results">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-secondary" />
                    Add Lab Results
                  </CardTitle>
                  <CardDescription>Record laboratory test results</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitLabResults} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="testName">Test Name</Label>
                      <Input
                        id="testName"
                        value={labResults.testName}
                        onChange={(e) => setLabResults({ ...labResults, testName: e.target.value })}
                        placeholder="e.g., Complete Blood Count"
                        required
                        readOnly={healthRecord?.health_record?.record_type === 'lab_results'}
                        className={healthRecord?.health_record?.record_type === 'lab_results' ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="result">Result</Label>
                      <Input
                        id="result"
                        value={labResults.result}
                        onChange={(e) => setLabResults({ ...labResults, result: e.target.value })}
                        placeholder="Enter test result"
                        required
                        readOnly={healthRecord?.health_record?.record_type === 'lab_results'}
                        className={healthRecord?.health_record?.record_type === 'lab_results' ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="normalRange">Normal Range</Label>
                      <Input
                        id="normalRange"
                        value={labResults.normalRange}
                        onChange={(e) => setLabResults({ ...labResults, normalRange: e.target.value })}
                        placeholder="Enter normal range"
                        readOnly={healthRecord?.health_record?.record_type === 'lab_results'}
                        className={healthRecord?.health_record?.record_type === 'lab_results' ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="labNotes">Notes</Label>
                      <Textarea
                        id="labNotes"
                        value={labResults.notes}
                        onChange={(e) => setLabResults({ ...labResults, notes: e.target.value })}
                        placeholder="Additional observations"
                        readOnly={healthRecord?.health_record?.record_type === 'lab_results'}
                        className={healthRecord?.health_record?.record_type === 'lab_results' ? 'bg-muted' : ''}
                      />
                    </div>
                    {!healthRecord?.health_record && (
                      <Button type="submit" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Lab Results
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medications Tab */}
            <TabsContent value="medications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-accent" />
                    Add Medication
                  </CardTitle>
                  <CardDescription>Prescribe medications to the patient</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitMedication} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicationName">Medication Name</Label>
                      <Input
                        id="medicationName"
                        value={medication.medicationName}
                        onChange={(e) => setMedication({ ...medication, medicationName: e.target.value })}
                        placeholder="e.g., Amoxicillin"
                        required
                        readOnly={healthRecord?.health_record?.record_type === 'medication'}
                        className={healthRecord?.health_record?.record_type === 'medication' ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dosage">Dosage</Label>
                        <Input
                          id="dosage"
                          value={medication.dosage}
                          onChange={(e) => setMedication({ ...medication, dosage: e.target.value })}
                          placeholder="e.g., 500mg"
                          required
                          readOnly={healthRecord?.health_record?.record_type === 'medication'}
                          className={healthRecord?.health_record?.record_type === 'medication' ? 'bg-muted' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Input
                          id="frequency"
                          value={medication.frequency}
                          onChange={(e) => setMedication({ ...medication, frequency: e.target.value })}
                          placeholder="e.g., Twice daily"
                          required
                          readOnly={healthRecord?.health_record?.record_type === 'medication'}
                          className={healthRecord?.health_record?.record_type === 'medication' ? 'bg-muted' : ''}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={medication.duration}
                        onChange={(e) => setMedication({ ...medication, duration: e.target.value })}
                        placeholder="e.g., 7 days"
                        required
                        readOnly={healthRecord?.health_record?.record_type === 'medication'}
                        className={healthRecord?.health_record?.record_type === 'medication' ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={medication.instructions}
                        onChange={(e) => setMedication({ ...medication, instructions: e.target.value })}
                        placeholder="Special instructions for the patient"
                        readOnly={healthRecord?.health_record?.record_type === 'medication'}
                        className={healthRecord?.health_record?.record_type === 'medication' ? 'bg-muted' : ''}
                      />
                    </div>
                    {!healthRecord?.health_record && (
                      <Button type="submit" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Medication
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vitals Tab */}
            <TabsContent value="vitals">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-destructive" />
                    Record Vital Signs
                  </CardTitle>
                  <CardDescription>Record patient's vital signs</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitVitals} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                        <Input
                          id="bloodPressure"
                          value={vitals.bloodPressure}
                          onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                          placeholder="e.g., 120/80"
                          required
                          readOnly={healthRecord?.health_record?.record_type === 'vitals'}
                          className={healthRecord?.health_record?.record_type === 'vitals' ? 'bg-muted' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                        <Input
                          id="heartRate"
                          type="number"
                          value={vitals.heartRate}
                          onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                          placeholder="e.g., 72"
                          required
                          readOnly={healthRecord?.health_record?.record_type === 'vitals'}
                          className={healthRecord?.health_record?.record_type === 'vitals' ? 'bg-muted' : ''}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperature (°C)</Label>
                        <Input
                          id="temperature"
                          type="number"
                          step="0.1"
                          value={vitals.temperature}
                          onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                          placeholder="e.g., 37.0"
                          required
                          readOnly={healthRecord?.health_record?.record_type === 'vitals'}
                          className={healthRecord?.health_record?.record_type === 'vitals' ? 'bg-muted' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={vitals.weight}
                          onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                          placeholder="e.g., 70.5"
                          readOnly={healthRecord?.health_record?.record_type === 'vitals'}
                          className={healthRecord?.health_record?.record_type === 'vitals' ? 'bg-muted' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={vitals.height}
                          onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                          placeholder="e.g., 175"
                          readOnly={healthRecord?.health_record?.record_type === 'vitals'}
                          className={healthRecord?.health_record?.record_type === 'vitals' ? 'bg-muted' : ''}
                        />
                      </div>
                    </div>
                    {!healthRecord?.health_record && (
                      <Button type="submit" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Record Vitals
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default DoctorHealthRecords;
