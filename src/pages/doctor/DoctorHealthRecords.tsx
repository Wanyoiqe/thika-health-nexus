import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Plus,
  TestTube,
  Pill,
  Heart,
  Lock,
  Clock,
  AlertCircle,
  Edit,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useAuth } from '@/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchDoctorsPatients } from '@/apis/providers';
import { getPatientAppointments } from '@/apis/appointments';
import {
  getHealthRecordByAppointment,
  createHealthRecord,
  updateHealthRecord,
} from '@/apis/health-records';
import type { Appointment, Patient, HealthRecord, LabResults, Medication, Vitals } from '@/types';

const EDIT_WINDOW_DAYS = 7;

// ─── Helpers ────────────────────────────────────────────────────────────────

const parseData = (data: unknown): Record<string, unknown> => {
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return {}; }
  }
  return (data as Record<string, unknown>) ?? {};
};

const isEditable = (createdAt: string) =>
  differenceInDays(new Date(), new Date(createdAt)) < EDIT_WINDOW_DAYS;

const recordTypeIcon = (type: string) => {
  if (type === 'lab_results') return <TestTube className="h-4 w-4" />;
  if (type === 'medication')  return <Pill      className="h-4 w-4" />;
  if (type === 'vitals')      return <Heart     className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
};

// ─── Empty forms ─────────────────────────────────────────────────────────────

const emptyLab:  LabResults  = { testName: '', result: '', normalRange: '', notes: '' };
const emptyMed:  Medication  = { medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' };
const emptyVitals: Vitals    = { bloodPressure: '', heartRate: '', temperature: '', weight: '', height: '' };

// ─── Record card ─────────────────────────────────────────────────────────────

const RecordCard = ({
  record,
  onEdit,
}: {
  record: HealthRecord;
  onEdit: (r: HealthRecord) => void;
}) => {
  const data = parseData(record.data);
  const editable = isEditable(record.created_at);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {recordTypeIcon(record.record_type)}
            <Badge variant="outline" className="capitalize">
              {record.record_type.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(record.created_at), 'MMM dd, yyyy')}
            </span>
            {editable ? (
              <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs" onClick={() => onEdit(record)}>
                <Edit className="h-3 w-3" /> Edit
              </Button>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground/60">
                <Lock className="h-3 w-3" /> Locked
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {Object.entries(data).map(([key, val]) => (
            <div key={key}>
              <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
              <span className="font-medium">{String(val ?? '—')}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────

const DoctorHealthRecords: React.FC = () => {
  const { refreshToken } = useAuth();
  const { toast } = useToast();
  const token = refreshToken || localStorage.getItem('refreshToken') || '';

  const [patients, setPatients]           = useState<Patient[]>([]);
  const [appointments, setAppointments]   = useState<Appointment[]>([]);
  const [records, setRecords]             = useState<HealthRecord[]>([]);

  const [selectedPatient, setSelectedPatient]         = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [selectedApptObj, setSelectedApptObj]         = useState<Appointment | null>(null);

  const [loadingPatients, setLoadingPatients]     = useState(false);
  const [loadingAppts, setLoadingAppts]           = useState(false);
  const [loadingRecords, setLoadingRecords]       = useState(false);
  const [submitting, setSubmitting]               = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [recordType, setRecordType]     = useState<'lab_results' | 'medication' | 'vitals'>('lab_results');
  const [lab, setLab]                   = useState<LabResults>(emptyLab);
  const [med, setMed]                   = useState<Medication>(emptyMed);
  const [vitals, setVitals]             = useState<Vitals>(emptyVitals);

  // ── Load patients ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    setLoadingPatients(true);
    fetchDoctorsPatients(token)
      .then(res => setPatients(res.patients ?? []))
      .catch(err => toast({ title: 'Error', description: err.message, variant: 'destructive' }))
      .finally(() => setLoadingPatients(false));
  }, [token]);

  // ── Load appointments when patient selected ────────────────────────────────
  useEffect(() => {
    if (!selectedPatient || !token) return;
    setAppointments([]);
    setRecords([]);
    setSelectedAppointment('');
    setSelectedApptObj(null);
    setLoadingAppts(true);
    getPatientAppointments(token, selectedPatient)
      .then(res => setAppointments(res.appointments ?? []))
      .catch(err => toast({ title: 'Error', description: err.message, variant: 'destructive' }))
      .finally(() => setLoadingAppts(false));
  }, [selectedPatient]);

  // ── Load records when appointment selected ─────────────────────────────────
  const loadRecords = useCallback(async (apptId: string, patientId: string) => {
    setLoadingRecords(true);
    try {
      const res = await getHealthRecordByAppointment(token, apptId, patientId);
      setRecords(res?.health_records ?? []);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingRecords(false);
    }
  }, [token]);

  const handleSelectAppointment = (apptId: string) => {
    setSelectedAppointment(apptId);
    const appt = appointments.find(a => a.app_id === apptId) ?? null;
    setSelectedApptObj(appt);
    if (appt) loadRecords(apptId, selectedPatient);
  };

  // ── Open create dialog ─────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingRecord(null);
    setRecordType('lab_results');
    setLab(emptyLab);
    setMed(emptyMed);
    setVitals(emptyVitals);
    setDialogOpen(true);
  };

  // ── Open edit dialog ───────────────────────────────────────────────────────
  const openEdit = (record: HealthRecord) => {
    setEditingRecord(record);
    setRecordType(record.record_type);
    const d = parseData(record.data);
    if (record.record_type === 'lab_results')  setLab(d as unknown as LabResults);
    if (record.record_type === 'medication')   setMed(d as unknown as Medication);
    if (record.record_type === 'vitals')       setVitals(d as unknown as Vitals);
    setDialogOpen(true);
  };

  // ── Submit (create or update) ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = recordType === 'lab_results' ? lab : recordType === 'medication' ? med : vitals;
    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateHealthRecord(token, editingRecord.record_id, { record_type: recordType, data: formData });
        toast({ title: 'Record Updated' });
      } else {
        await createHealthRecord(token, {
          appointment_id: selectedAppointment,
          record_type: recordType,
          data: formData,
        });
        toast({ title: 'Record Added' });
      }
      setDialogOpen(false);
      loadRecords(selectedAppointment, selectedPatient);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const appointmentInFuture = selectedApptObj
    ? new Date(selectedApptObj.date_time) > new Date()
    : false;

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Health Records</h1>
          <p className="text-muted-foreground mt-1">Add and manage patient health records</p>
        </div>

        {/* Patient + Appointment Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Patient & Appointment</CardTitle>
            <CardDescription>Choose a patient and their past appointment to add records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Patient */}
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient} disabled={loadingPatients}>
                <SelectTrigger className="w-full md:w-96">
                  <SelectValue placeholder={loadingPatients ? 'Loading patients…' : 'Select a patient'} />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.patient_id} value={p.patient_id}>
                      {p.full_name || p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Appointment */}
            {selectedPatient && (
              <div className="space-y-2">
                <Label>Appointment</Label>
                {loadingAppts ? (
                  <Skeleton className="h-10 w-full md:w-96" />
                ) : appointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No appointments found for this patient.</p>
                ) : (
                  <Select value={selectedAppointment} onValueChange={handleSelectAppointment}>
                    <SelectTrigger className="w-full md:w-96">
                      <SelectValue placeholder="Select an appointment" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointments.map(a => (
                        <SelectItem key={a.app_id} value={a.app_id}>
                          {format(new Date(a.date_time), 'MMM dd, yyyy — h:mm aa')} · {a.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Records Section */}
        {selectedAppointment && (
          <div className="space-y-4">

            {/* Time gate banner */}
            {appointmentInFuture && (
              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    This appointment hasn't occurred yet. Records can only be added after the appointment date.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Records header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Records for this Appointment
                  {!loadingRecords && <span className="ml-2 text-sm font-normal text-muted-foreground">({records.length})</span>}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Records are locked for editing after {EDIT_WINDOW_DAYS} days from creation.
                </p>
              </div>
              {!appointmentInFuture && (
                <Button className="gap-2" onClick={openCreate}>
                  <Plus className="h-4 w-4" /> Add Record
                </Button>
              )}
            </div>

            {/* Records list */}
            {loadingRecords ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <Card key={i}><CardContent className="p-5 space-y-2">
                    <Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-64" /><Skeleton className="h-3 w-48" />
                  </CardContent></Card>
                ))}
              </div>
            ) : records.length === 0 ? (
              <Card><CardContent className="py-14 text-center">
                <FileText className="h-9 w-9 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground text-sm">No records yet for this appointment.</p>
                {!appointmentInFuture && (
                  <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={openCreate}>
                    <Plus className="h-4 w-4" /> Add First Record
                  </Button>
                )}
              </CardContent></Card>
            ) : (
              <div className="space-y-3">
                {records.map(r => (
                  <RecordCard key={r.record_id} record={r} onEdit={openEdit} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit Health Record' : 'Add Health Record'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Record type selector — only on create */}
            {!editingRecord && (
              <div className="space-y-2">
                <Label>Record Type</Label>
                <Tabs value={recordType} onValueChange={v => setRecordType(v as typeof recordType)}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="lab_results" className="gap-1.5 text-xs">
                      <TestTube className="h-3.5 w-3.5" /> Lab Results
                    </TabsTrigger>
                    <TabsTrigger value="medication" className="gap-1.5 text-xs">
                      <Pill className="h-3.5 w-3.5" /> Medication
                    </TabsTrigger>
                    <TabsTrigger value="vitals" className="gap-1.5 text-xs">
                      <Heart className="h-3.5 w-3.5" /> Vitals
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Lab Results fields */}
            {recordType === 'lab_results' && (
              <>
                <div className="space-y-2">
                  <Label>Test Name</Label>
                  <Input value={lab.testName} onChange={e => setLab(p => ({ ...p, testName: e.target.value }))} placeholder="e.g., Complete Blood Count" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Result</Label>
                    <Input value={lab.result} onChange={e => setLab(p => ({ ...p, result: e.target.value }))} placeholder="e.g., Positive" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Normal Range</Label>
                    <Input value={lab.normalRange} onChange={e => setLab(p => ({ ...p, normalRange: e.target.value }))} placeholder="e.g., 70–100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={lab.notes} onChange={e => setLab(p => ({ ...p, notes: e.target.value }))} placeholder="Additional observations" rows={2} />
                </div>
              </>
            )}

            {/* Medication fields */}
            {recordType === 'medication' && (
              <>
                <div className="space-y-2">
                  <Label>Medication Name</Label>
                  <Input value={med.medicationName} onChange={e => setMed(p => ({ ...p, medicationName: e.target.value }))} placeholder="e.g., Amoxicillin" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Dosage</Label>
                    <Input value={med.dosage} onChange={e => setMed(p => ({ ...p, dosage: e.target.value }))} placeholder="e.g., 500mg" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Input value={med.frequency} onChange={e => setMed(p => ({ ...p, frequency: e.target.value }))} placeholder="e.g., Twice daily" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input value={med.duration} onChange={e => setMed(p => ({ ...p, duration: e.target.value }))} placeholder="e.g., 7 days" required />
                </div>
                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <Textarea value={med.instructions} onChange={e => setMed(p => ({ ...p, instructions: e.target.value }))} placeholder="Special instructions" rows={2} />
                </div>
              </>
            )}

            {/* Vitals fields */}
            {recordType === 'vitals' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Blood Pressure (mmHg)</Label>
                    <Input value={vitals.bloodPressure} onChange={e => setVitals(p => ({ ...p, bloodPressure: e.target.value }))} placeholder="120/80" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Heart Rate (bpm)</Label>
                    <Input type="number" value={vitals.heartRate} onChange={e => setVitals(p => ({ ...p, heartRate: e.target.value }))} placeholder="72" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Temp (°C)</Label>
                    <Input type="number" step="0.1" value={vitals.temperature} onChange={e => setVitals(p => ({ ...p, temperature: e.target.value }))} placeholder="37.0" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input type="number" step="0.1" value={vitals.weight} onChange={e => setVitals(p => ({ ...p, weight: e.target.value }))} placeholder="70.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" value={vitals.height} onChange={e => setVitals(p => ({ ...p, height: e.target.value }))} placeholder="175" />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (editingRecord ? 'Saving…' : 'Adding…') : (editingRecord ? 'Save Changes' : 'Add Record')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default DoctorHealthRecords;
