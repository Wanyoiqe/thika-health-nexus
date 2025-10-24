import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { 
  getConsentRequests, 
  getActiveConsents, 
  handleConsentRequest as handleConsentAPI, 
  revokeConsent as revokeConsentAPI,
  type ConsentRequest,
  type ActiveConsent
} from '@/apis/consent';

const ConsentManagement: React.FC = () => {
  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([]);
  const [activeConsents, setActiveConsents] = useState<ActiveConsent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConsentRequests = async () => {
    try {
      setError(null);
      const data = await getConsentRequests();
      // Ensure we always set an array, even if the API returns null or undefined
      setConsentRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching consent requests:', error);
      setError('Failed to fetch consent requests');
      toast({
        title: 'Error',
        description: 'Failed to fetch consent requests',
        variant: 'destructive',
      });
      // Set empty array on error to prevent mapping issues
      setConsentRequests([]);
    }
  };

  const fetchActiveConsents = async () => {
    try {
      setError(null);
      const data = await getActiveConsents();
      // Ensure we always set an array, even if the API returns null or undefined
      setActiveConsents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching active consents:', error);
      setError('Failed to fetch active consents');
      toast({
        title: 'Error',
        description: 'Failed to fetch active consents',
        variant: 'destructive',
      });
      // Set empty array on error to prevent mapping issues
      setActiveConsents([]);
    }
  };

  const handleConsentAction = async (requestId: string, action: 'approve' | 'deny') => {
    try {
      // Mock API call
      toast({
        title: 'Success',
        description: `Request ${action}ed successfully`,
      });
      await Promise.all([fetchConsentRequests(), fetchActiveConsents()]);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} request`,
        variant: 'destructive',
      });
    }
  };

  const handleRevokeAccess = async (consentId: string) => {
    try {
      // Mock API call
      toast({
        title: 'Success',
        description: 'Access revoked successfully',
      });
      await fetchActiveConsents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke access',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchConsentRequests(),
          fetchActiveConsents()
        ]);
      } catch (error) {
        console.error('Error loading consent data:', error);
        setError('Failed to load consent data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="space-y-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading consent requests...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="space-y-4 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Consent Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage who can access your health records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Pending Requests
              </CardTitle>
              <CardDescription>
                Doctors requesting access to your records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {consentRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No pending consent requests</p>
                </div>
              ) : (
                consentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col space-y-3 p-4 bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{request.doctorName}</h4>
                        <Badge variant="outline">{request.specialization}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleConsentAction(request.id, 'approve')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleConsentAction(request.id, 'deny')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="line-clamp-2">{request.purpose}</p>
                      <p className="mt-1">
                        Requested on: {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Active Consents
              </CardTitle>
              <CardDescription>
                Doctors with current access to your records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeConsents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No active consents</p>
                </div>
              ) : (
                activeConsents.map((consent) => (
                  <div
                    key={consent.id}
                    className="flex flex-col space-y-3 p-4 bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{consent.doctorName}</h4>
                        <Badge variant="outline">{consent.specialization}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRevokeAccess(consent.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Revoke Access
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        Granted: {new Date(consent.grantedDate).toLocaleDateString()}
                      </p>
                      <p>
                        Expires: {new Date(consent.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ConsentManagement;