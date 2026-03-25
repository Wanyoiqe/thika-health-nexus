import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShieldCheck, Plus, Eye, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/AuthContext';
import { getDoctorConsentRequests, createConsentRequest, getConsentRecord } from '@/apis/consent';
import { fetchDoctorsHealthRecords } from '@/apis/health-records';
import { fetchDoctorsPatients } from '@/apis/providers';
import { useToast } from '@/hooks/use-toast';
import type { ConsentItem, HealthRecord, Patient } from '@/types';

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (status === 'approved') return 'default';
  if (status === 'denied' || status === 'revoked') return 'destructive';
  if (status === 'pending') return 'secondary';
  return 'outline';
};

const ConsentSkeleton = () => (
  <Card><CardContent className="p-5 space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-64" /><Skeleton className="h-3 w-32" /></CardContent></Card>
);

const DoctorConsent: React.FC = () => {
  const { refreshToken } = useAuth();
  const { toast } = useToast();

  const token = refreshToken || localStorage.getItem('refreshToken') || '';

  const [consents, setConsents]     = useState<ConsentItem[]>([]);
  const [records, setRecords]       = useState<HealthRecord[]>([]);
  const [patients, setPatients]     = useState<Patient[]>([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [viewingRecord, setViewingRecord] = useState<HealthRecord | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [form, setForm] = useState({ patient_id: '', record_id: '', purpose: '', type: '' });

  useEffect(() => {
    if (token) loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [consentRes, recordRes, patientRes] = await Promise.allSettled([
        getDoctorConsentRequests(token),
        fetchDoctorsHealthRecords(token),
        fetchDoctorsPatients(token),
      ]);
      if (consentRes.status === 'fulfilled') setConsents(consentRes.value.consents);
      if (recordRes.status === 'fulfilled')  setRecords(recordRes.value.health_records ?? []);
      if (patientRes.status === 'fulfilled') setPatients(patientRes.value.patients ?? []);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient_id || !form.record_id || !form.purpose.trim()) {
      toast({ title: 'Missing fields', description: 'Patient, record, and purpose are required.', variant: 'destructive' });
      return;
    }
    setIsCreating(true);
    try {
      await createConsentRequest(token, {
        patient_id: form.patient_id,
        record_id: form.record_id,
        purpose: form.purpose,
        type: form.type || undefined,
      });
      toast({ title: 'Request Sent', description: 'The patient has been notified via email.' });
      setDialogOpen(false);
      setForm({ patient_id: '', record_id: '', purpose: '', type: '' });
      loadAll();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewRecord = async (consentId: string) => {
    try {
      const res = await getConsentRecord(token, consentId);
      setViewingRecord(res.record);
      setViewDialogOpen(true);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const pending  = consents.filter(c => c.status === 'pending');
  const approved = consents.filter(c => c.status === 'approved');
  const other    = consents.filter(c => c.status !== 'pending' && c.status !== 'approved');

  const renderConsent = (c: ConsentItem) => (
    <Card key={c.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold">{c.patient_name ?? 'Patient'}</p>
              <Badge variant={statusVariant(c.status)} className="capitalize text-xs">{c.status}</Badge>
            </div>
            {c.type && <p className="text-xs text-muted-foreground">Type: {c.type}</p>}
            <p className="text-sm text-muted-foreground">{c.purpose}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Requested: {format(new Date(c.request_date), 'MMM dd, yyyy')}
              </span>
              {c.response_date && <span>Responded: {format(new Date(c.response_date), 'MMM dd, yyyy')}</span>}
              {c.expiry_date && c.status === 'approved' && <span>Expires: {format(new Date(c.expiry_date), 'MMM dd, yyyy')}</span>}
            </div>
          </div>

          {c.status === 'approved' && (
            <Button size="sm" variant="outline" className="gap-1.5 shrink-0" onClick={() => handleViewRecord(c.id)}>
              <Eye className="h-3.5 w-3.5" /> View Record
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <Card><CardContent className="py-14 text-center">
      <ShieldCheck className="h-9 w-9 mx-auto text-muted-foreground/40 mb-3" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </CardContent></Card>
  );

  // Patient-filtered records for the form
  const recordsForPatient = records.filter(r => r.patient_id === form.patient_id);

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Consent Requests</h1>
            <p className="text-muted-foreground mt-1">Request and manage patient health record access</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> New Request</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Request Health Record Access</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label>Patient</Label>
                  <Select value={form.patient_id} onValueChange={v => setForm(p => ({ ...p, patient_id: v, record_id: '' }))}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.patient_id} value={p.patient_id}>{p.full_name || p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Health Record</Label>
                  <Select value={form.record_id} onValueChange={v => setForm(p => ({ ...p, record_id: v }))} disabled={!form.patient_id}>
                    <SelectTrigger><SelectValue placeholder="Select record" /></SelectTrigger>
                    <SelectContent>
                      {recordsForPatient.length === 0 && <SelectItem value="_none" disabled>No records for this patient</SelectItem>}
                      {recordsForPatient.map(r => (
                        <SelectItem key={r.record_id ?? r.id} value={r.record_id ?? r.id}>
                          {r.record_type?.replace('_', ' ')} — {format(new Date(r.created_at), 'MMM dd, yyyy')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Purpose <span className="text-muted-foreground text-xs">(shown to patient)</span></Label>
                  <Textarea
                    placeholder="Describe why you need access to this record..."
                    value={form.purpose}
                    onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? 'Sending...' : 'Send Request'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="pending">
              Pending {!isLoading && pending.length > 0 && <span className="ml-1 text-xs opacity-60">({pending.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved {!isLoading && approved.length > 0 && <span className="ml-1 text-xs opacity-60">({approved.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="other">All</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3 mt-6">
            {isLoading ? [1,2].map(i=><ConsentSkeleton key={i}/>) : pending.length === 0 ? <EmptyState message="No pending requests" /> : pending.map(renderConsent)}
          </TabsContent>
          <TabsContent value="approved" className="space-y-3 mt-6">
            {isLoading ? [1,2].map(i=><ConsentSkeleton key={i}/>) : approved.length === 0 ? <EmptyState message="No approved consents yet" /> : approved.map(renderConsent)}
          </TabsContent>
          <TabsContent value="other" className="space-y-3 mt-6">
            {isLoading ? [1,2].map(i=><ConsentSkeleton key={i}/>) : consents.length === 0 ? <EmptyState message="No consent requests yet" /> : consents.map(renderConsent)}
          </TabsContent>
        </Tabs>
      </div>

      {/* View Record Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-4 w-4" /> Consented Health Record</DialogTitle></DialogHeader>
          {viewingRecord && (
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{viewingRecord.record_type?.replace('_', ' ')}</Badge>
                <span className="text-xs text-muted-foreground">{format(new Date(viewingRecord.created_at), 'MMM dd, yyyy')}</span>
              </div>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-72 whitespace-pre-wrap">
                {JSON.stringify(viewingRecord.data, null, 2)}
              </pre>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default DoctorConsent;
