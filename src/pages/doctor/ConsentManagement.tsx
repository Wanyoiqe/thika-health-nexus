import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Plus, Search, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConsentRequest {
  id: string;
  patientId: string;
  patientName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'denied';
  type: string;
  purpose: string;
  validUntil?: string;
}

interface NewConsentRequest {
  patientId: string;
  type: string;
  purpose: string;
}

const DoctorConsentManagement: React.FC = () => {
  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState<NewConsentRequest>({
    patientId: '',
    type: '',
    purpose: '',
  });

  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const fetchConsentRequests = async () => {
      // Simulating API call
      const mockData: ConsentRequest[] = [
        {
          id: '1',
          patientId: 'P001',
          patientName: 'John Doe',
          requestDate: '2025-10-22',
          status: 'pending',
          type: 'Medical History',
          purpose: 'Review previous treatments and conditions',
        },
        {
          id: '2',
          patientId: 'P002',
          patientName: 'Jane Smith',
          requestDate: '2025-10-21',
          status: 'approved',
          type: 'Lab Results',
          purpose: 'Analyze recent test results',
          validUntil: '2025-11-21',
        },
        {
          id: '3',
          patientId: 'P003',
          patientName: 'Alice Johnson',
          requestDate: '2025-10-20',
          status: 'denied',
          type: 'Full Health Records',
          purpose: 'Comprehensive health assessment',
        },
      ];

      setConsentRequests(mockData);
      setIsLoading(false);
    };

    fetchConsentRequests();
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createConsentRequest({
        patientId: newRequest.patientId,
        type: newRequest.type,
        purpose: newRequest.purpose,
      });

      // Refresh the list after creating a new request
      await fetchConsentRequests();
      
      setIsDialogOpen(false);
      setNewRequest({ patientId: '', type: '', purpose: '' });

      toast({
        title: 'Success',
        description: 'Consent request sent successfully',
      });
    } catch (error) {
      console.error('Error creating consent request:', error);
      toast({
        title: 'Error',
        description: 'Failed to send consent request',
        variant: 'destructive',
      });
    }
  };

  const filteredRequests = consentRequests.filter((request) =>
    request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Consent Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage patient record access requests
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Patient Consent</DialogTitle>
                <DialogDescription>
                  Send a request to access patient health records.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewRequest} className="space-y-4">
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    value={newRequest.patientId}
                    onChange={(e) =>
                      setNewRequest((prev) => ({ ...prev, patientId: e.target.value }))
                    }
                    placeholder="Enter patient ID"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Record Type</Label>
                  <Select
                    value={newRequest.type}
                    onValueChange={(value) =>
                      setNewRequest((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medical History">Medical History</SelectItem>
                      <SelectItem value="Lab Results">Lab Results</SelectItem>
                      <SelectItem value="Full Health Records">Full Health Records</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    value={newRequest.purpose}
                    onChange={(e) =>
                      setNewRequest((prev) => ({ ...prev, purpose: e.target.value }))
                    }
                    placeholder="Explain why you need access to these records"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Send Request</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Consent Requests
            </CardTitle>
            <CardDescription>
              View and manage your requests for patient record access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or record type..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Record Type</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading consent requests...
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No consent requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.patientName}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === 'approved'
                              ? 'default'
                              : request.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.status === 'approved' ? (
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              toast({
                                title: 'Viewing Records',
                                description: 'Redirecting to patient records...',
                              });
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            View Records
                          </Button>
                        ) : request.status === 'denied' ? (
                          <Button size="sm" variant="outline" disabled className="gap-2">
                            <XCircle className="h-4 w-4" />
                            Access Denied
                          </Button>
                        ) : (
                          <Button size="sm" variant="secondary" disabled className="gap-2">
                            Pending Response
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DoctorConsentManagement;