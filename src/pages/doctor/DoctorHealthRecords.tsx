import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Activity, Pill, TestTube, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DoctorHealthRecords: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [recordType, setRecordType] = useState('');

  // // Medical History Form State
  // const [medicalHistory, setMedicalHistory] = useState({
  //   diagnosis: '',
  //   symptoms: '',
  //   treatment: '',
  //   notes: '',
  // });

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

  // const handleSubmitMedicalHistory = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   toast({
  //     title: 'Success',
  //     description: 'Medical history record added successfully',
  //   });
  //   setMedicalHistory({ diagnosis: '', symptoms: '', treatment: '', notes: '' });
  // };

  const handleSubmitLabResults = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Success',
      description: 'Lab results added successfully',
    });
    setLabResults({ testName: '', result: '', normalRange: '', notes: '' });
  };

  const handleSubmitMedication = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Success',
      description: 'Medication record added successfully',
    });
    setMedication({ medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' });
  };

  const handleSubmitVitals = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Success',
      description: 'Vital signs recorded successfully',
    });
    setVitals({ bloodPressure: '', heartRate: '', temperature: '', weight: '', height: '' });
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
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-full md:w-[400px]">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">John Doe</SelectItem>
                <SelectItem value="2">Jane Smith</SelectItem>
                <SelectItem value="3">Michael Johnson</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedPatient && (
          <Tabs defaultValue="medical-history" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
            </TabsList>

            {/* Medical History Tab
            <TabsContent value="medical-history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Add Medical History
                  </CardTitle>
                  <CardDescription>Record diagnosis, symptoms, and treatment</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitMedicalHistory} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Input
                        id="diagnosis"
                        value={medicalHistory.diagnosis}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, diagnosis: e.target.value })}
                        placeholder="Enter diagnosis"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Symptoms</Label>
                      <Textarea
                        id="symptoms"
                        value={medicalHistory.symptoms}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, symptoms: e.target.value })}
                        placeholder="Describe symptoms"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="treatment">Treatment Plan</Label>
                      <Textarea
                        id="treatment"
                        value={medicalHistory.treatment}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, treatment: e.target.value })}
                        placeholder="Describe treatment plan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={medicalHistory.notes}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, notes: e.target.value })}
                        placeholder="Any additional notes"
                      />
                    </div>
                    <Button type="submit" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Medical History
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent> */}

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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="normalRange">Normal Range</Label>
                      <Input
                        id="normalRange"
                        value={labResults.normalRange}
                        onChange={(e) => setLabResults({ ...labResults, normalRange: e.target.value })}
                        placeholder="Enter normal range"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="labNotes">Notes</Label>
                      <Textarea
                        id="labNotes"
                        value={labResults.notes}
                        onChange={(e) => setLabResults({ ...labResults, notes: e.target.value })}
                        placeholder="Additional observations"
                      />
                    </div>
                    <Button type="submit" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Lab Results
                    </Button>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={medication.instructions}
                        onChange={(e) => setMedication({ ...medication, instructions: e.target.value })}
                        placeholder="Special instructions for the patient"
                      />
                    </div>
                    <Button type="submit" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Medication
                    </Button>
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
                        />
                      </div>
                    </div>
                    <Button type="submit" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Record Vitals
                    </Button>
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
