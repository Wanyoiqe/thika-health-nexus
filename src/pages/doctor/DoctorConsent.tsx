import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { HealthRecord, ConsentRequest, CreateConsentRequest } from '@/types';
import { getConsentRequests, getActiveConsents } from '@/apis/consent';
import { useAuth } from '@/AuthContext';
import { fetchDoctorsPatients } from '@/apis/providers';
import { fetchDoctorsHealthRecords, createHealthRecordConsentRequest } from '@/apis/health-records';

const DoctorConsent: React.FC = () => {
  const { refreshToken } = useAuth();
  const token = refreshToken || localStorage.getItem('refreshToken');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedRecord, setSelectedRecord] = useState('');
  const [purpose, setPurpose] = useState('');

  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);

  const filteredHealthRecords = selectedPatient
    ? healthRecords.filter(record => record.patient_id === selectedPatient)
    : healthRecords;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requests, patientData, recordData] = await Promise.all([
          getConsentRequests(token!),
          fetchDoctorsPatients(token),
          fetchDoctorsHealthRecords(token)
        ]);
        setConsentRequests(requests || []);
        setPatients(patientData.patients || []);
        setHealthRecords(recordData.health_records || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !selectedRecord || !purpose) {
      if (!selectedPatient) return toast.error('Please select a patient');
      if (!selectedRecord) return toast.error('Please select a health record');
      if (!purpose) return toast.error('Please provide a purpose for access');
      return;
    }

    try {
      const selectedHealthRecord = healthRecords.find(r => r.record_id === selectedRecord);
      
      const newRequest: CreateConsentRequest = {
        id: String(Date.now()),
        patient_id: selectedPatient,
        record_id: selectedRecord,
        request_date: new Date().toISOString(),
        status: 'pending',
        type: selectedHealthRecord?.record_type || '',
        purpose: purpose,
      };

      await createHealthRecordConsentRequest(token!, newRequest);
      toast.success('Consent request submitted successfully');
      setSelectedPatient('');
      // setConsentType('');
      setPurpose('');
    } catch (error) {
      console.error('Error submitting consent request:', error);
      toast.error('Failed to submit consent request');
    }
  };

  const pendingRequests = consentRequests.filter(r => r.status === 'pending');
  const approvedRequests = consentRequests.filter(r => r.status === 'approved');
  const deniedRequests = consentRequests.filter(r => r.status === 'denied');

  const ConsentCard = ({ request }: { request: CreateConsentRequest }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <Badge 
                variant={
                  request.status === 'approved' ? 'default' :
                  request.status === 'pending' ? 'secondary' :
                  'destructive'
                }
              >
                {request.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">Type:</span> {request.type}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Purpose:</span> {request.purpose}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Requested:</span> {format(new Date(request.request_date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          {request.status === 'pending' && (
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Awaiting response</span>
            </div>
          )}
          {request.status === 'approved' && (
            <div className="flex items-center gap-2 text-secondary">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Approved</span>
            </div>
          )}
          {request.status === 'denied' && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Denied</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Consent Management</h1>
          <p className="text-muted-foreground mt-1">Request and manage patient consent for health records access</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{pendingRequests.length}</div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-secondary" />
                <div>
                  <div className="text-2xl font-bold">{approvedRequests.length}</div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-destructive" />
                <div>
                  <div className="text-2xl font-bold">{deniedRequests.length}</div>
                  <p className="text-sm text-muted-foreground">Denied</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Request Patient Consent
            </CardTitle>
            <CardDescription>Submit a new consent request to share patient health records</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Select Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger id="patient">
                      <SelectValue placeholder="Choose a patient" />
                    </SelectTrigger>
                    {patients.length > 0 && (
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.patient_id} value={patient.patient_id}>
                            {patient.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthRecord">Health Record</Label>
                  <Select value={selectedRecord} onValueChange={setSelectedRecord}>
                    <SelectTrigger id="healthRecord">
                      <SelectValue placeholder="Select a health record" />
                    </SelectTrigger>
                    {filteredHealthRecords.length > 0 ? (
                      <SelectContent>
                        {filteredHealthRecords.map((record) => (
                          <SelectItem key={record.record_id} value={record.record_id}>
                            {record.record_type.charAt(0).toUpperCase() + record.record_type.slice(1).replace('_', ' ')} by {record.patient_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    ) : selectedPatient ? (
                      <SelectContent>
                        <SelectItem value="" disabled>No health records found for this patient</SelectItem>
                      </SelectContent>
                    ) : null}
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Access</Label>
                <Textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Explain why you need access to these records..."
                  rows={3}
                />
              </div>
              <Button type="submit" className="gap-2">
                <FileText className="h-4 w-4" />
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Requests Tabs */}
        {/* <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="denied">Denied</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                  <p className="text-muted-foreground">All consent requests have been processed</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map(request => (
                <ConsentCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 mt-6">
            {approvedRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No approved requests</h3>
                  <p className="text-muted-foreground">Approved consent requests will appear here</p>
                </CardContent>
              </Card>
            ) : (
              approvedRequests.map(request => (
                <ConsentCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>

          <TabsContent value="denied" className="space-y-4 mt-6">
            {deniedRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No denied requests</h3>
                  <p className="text-muted-foreground">Denied consent requests will appear here</p>
                </CardContent>
              </Card>
            ) : (
              deniedRequests.map(request => (
                <ConsentCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>
        </Tabs> */}
      </div>
    </MainLayout>
  );
};

export default DoctorConsent;