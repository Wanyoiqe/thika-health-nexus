// Mock data for Health Records System

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Diagnosis {
  id: string;
  name: string;
  diagnosisDate: string;
  status: 'active' | 'resolved' | 'chronic';
  notes: string;
  provider: string;
}

export interface LabResult {
  id: string;
  testName: string;
  date: string;
  provider: string;
  status: 'completed' | 'pending' | 'reviewed';
  results: string;
  pdfBase64?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  prescribingDoctor: string;
  status: 'current' | 'past';
  refillsRemaining?: number;
}

export interface VitalSign {
  date: string;
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  temperature: number;
  weight: number;
  height?: number;
}

export interface RecentActivity {
  id: string;
  type: 'appointment' | 'lab' | 'prescription' | 'note';
  description: string;
  date: string;
  icon: string;
}

// Mock patient data
export const mockPatient: Patient = {
  id: 'P001',
  firstName: 'Jane',
  lastName: 'Mwangi',
  dob: '1985-03-15',
  age: 39,
  gender: 'Female',
  bloodType: 'O+',
  phone: '+254 712 345 678',
  email: 'jane.mwangi@email.com',
  address: '123 Kenyatta Avenue, Thika, Kenya',
  emergencyContact: {
    name: 'John Mwangi',
    relationship: 'Spouse',
    phone: '+254 723 456 789',
  },
};

// Mock diagnoses
export const mockDiagnoses: Diagnosis[] = [
  {
    id: 'D001',
    name: 'Type 2 Diabetes',
    diagnosisDate: '2020-05-12',
    status: 'chronic',
    notes: 'Well controlled with medication and lifestyle modifications',
    provider: 'Dr. Sarah Kimani',
  },
  {
    id: 'D002',
    name: 'Hypertension',
    diagnosisDate: '2019-08-20',
    status: 'chronic',
    notes: 'Stage 1 hypertension, monitoring required',
    provider: 'Dr. Sarah Kimani',
  },
  {
    id: 'D003',
    name: 'Seasonal Allergies',
    diagnosisDate: '2022-03-10',
    status: 'active',
    notes: 'Allergic to pollen, worse during dry season',
    provider: 'Dr. Peter Omondi',
  },
  {
    id: 'D004',
    name: 'Acute Bronchitis',
    diagnosisDate: '2023-11-15',
    status: 'resolved',
    notes: 'Treated with antibiotics, fully recovered',
    provider: 'Dr. Sarah Kimani',
  },
];

// Mock lab results
export const mockLabResults: LabResult[] = [
  {
    id: 'L001',
    testName: 'Complete Blood Count (CBC)',
    date: '2024-09-15',
    provider: 'Thika Medical Laboratory',
    status: 'reviewed',
    results: 'All values within normal range',
  },
  {
    id: 'L002',
    testName: 'Lipid Panel',
    date: '2024-08-22',
    provider: 'Thika Medical Laboratory',
    status: 'reviewed',
    results: 'Total cholesterol: 195 mg/dL (Normal)',
  },
  {
    id: 'L003',
    testName: 'HbA1c Test',
    date: '2024-09-30',
    provider: 'Thika Medical Laboratory',
    status: 'completed',
    results: 'HbA1c: 6.2% (Good control)',
  },
  {
    id: 'L004',
    testName: 'Urinalysis',
    date: '2024-07-10',
    provider: 'Thika Medical Laboratory',
    status: 'reviewed',
    results: 'No abnormalities detected',
  },
];

// Mock medications
export const mockMedications: Medication[] = [
  {
    id: 'M001',
    name: 'Metformin',
    dosage: '500mg',
    instructions: 'Take twice daily with meals',
    startDate: '2020-05-15',
    prescribingDoctor: 'Dr. Sarah Kimani',
    status: 'current',
    refillsRemaining: 2,
  },
  {
    id: 'M002',
    name: 'Lisinopril',
    dosage: '10mg',
    instructions: 'Take once daily in the morning',
    startDate: '2019-09-01',
    prescribingDoctor: 'Dr. Sarah Kimani',
    status: 'current',
    refillsRemaining: 3,
  },
  {
    id: 'M003',
    name: 'Cetirizine',
    dosage: '10mg',
    instructions: 'Take once daily as needed for allergies',
    startDate: '2022-03-15',
    prescribingDoctor: 'Dr. Peter Omondi',
    status: 'current',
    refillsRemaining: 1,
  },
  {
    id: 'M004',
    name: 'Amoxicillin',
    dosage: '500mg',
    instructions: 'Take three times daily for 7 days',
    startDate: '2023-11-15',
    endDate: '2023-11-22',
    prescribingDoctor: 'Dr. Sarah Kimani',
    status: 'past',
  },
  {
    id: 'M005',
    name: 'Ibuprofen',
    dosage: '400mg',
    instructions: 'Take as needed for pain, max 3 times daily',
    startDate: '2023-06-01',
    endDate: '2023-06-10',
    prescribingDoctor: 'Dr. Sarah Kimani',
    status: 'past',
  },
];

// Mock vital signs - 90 days of data
export const mockVitalSigns: VitalSign[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - i));
  
  return {
    date: date.toISOString().split('T')[0],
    bpSystolic: 115 + Math.floor(Math.random() * 15),
    bpDiastolic: 72 + Math.floor(Math.random() * 10),
    heartRate: 68 + Math.floor(Math.random() * 12),
    temperature: 36.5 + Math.random() * 0.8,
    weight: 68 + Math.random() * 2,
  };
});

// Mock recent activity
export const mockRecentActivity: RecentActivity[] = [
  {
    id: 'A001',
    type: 'lab',
    description: 'HbA1c Test results uploaded',
    date: '2024-09-30',
    icon: 'FileText',
  },
  {
    id: 'A002',
    type: 'appointment',
    description: 'Follow-up appointment with Dr. Kimani',
    date: '2024-09-28',
    icon: 'Calendar',
  },
  {
    id: 'A003',
    type: 'prescription',
    description: 'Metformin prescription renewed',
    date: '2024-09-25',
    icon: 'Pill',
  },
  {
    id: 'A004',
    type: 'note',
    description: 'Added note about diet changes',
    date: '2024-09-20',
    icon: 'FileEdit',
  },
  {
    id: 'A005',
    type: 'lab',
    description: 'Complete Blood Count completed',
    date: '2024-09-15',
    icon: 'FileText',
  },
];
