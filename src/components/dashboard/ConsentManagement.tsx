import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, ShieldOff, Clock, AlertCircle, History } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/AuthContext';
import { getMyConsentHistory, respondToConsent, revokeConsent } from '@/apis/consent';
import { useToast } from '@/hooks/use-toast';
import type { ConsentItem } from '@/types';

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (status === 'approved') return 'default';
  if (status === 'denied' || status === 'revoked') return 'destructive';
  if (status === 'pending') return 'secondary';
  return 'outline';
};

const ConsentSkeleton = () => (
  <Card><CardContent className="p-5 space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-64" /><Skeleton className="h-3 w-32" /></CardContent></Card>
);

const ConsentManagement: React.FC = () => {
  const { refreshToken } = useAuth();
  const { toast } = useToast();
  const [consents, setConsents] = useState<ConsentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const token = refreshToken || localStorage.getItem('refreshToken') || '';

  useEffect(() => {
    if (token) load();
  }, []);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await getMyConsentHistory(token);
      setConsents(res.consents);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (id: string, action: 'approve' | 'deny') => {
    setActingId(id);
    try {
      await respondToConsent(token, id, action);
      setConsents(prev => prev.map(c =>
        c.id === id ? { ...c, status: action === 'approve' ? 'approved' : 'denied', response_date: new Date().toISOString() } : c
      ));
      toast({ title: action === 'approve' ? 'Consent Approved' : 'Consent Denied', description: `The doctor has been notified.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setActingId(null);
    }
  };

  const handleRevoke = async (id: string) => {
    setActingId(id);
    try {
      await revokeConsent(token, id);
      setConsents(prev => prev.map(c => c.id === id ? { ...c, status: 'revoked' } : c));
      toast({ title: 'Consent Revoked', description: 'Access has been revoked immediately.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setActingId(null);
    }
  };

  const pending  = consents.filter(c => c.status === 'pending');
  const history  = consents.filter(c => c.status !== 'pending');

  const renderConsent = (c: ConsentItem) => (
    <Card key={c.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold">{c.doctor_name ?? 'Doctor'}</p>
              <Badge variant={statusVariant(c.status)} className="capitalize text-xs">{c.status}</Badge>
            </div>
            {c.type && <p className="text-xs text-muted-foreground">Type: {c.type}</p>}
            <p className="text-sm text-muted-foreground">{c.purpose}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Requested: {format(new Date(c.request_date), 'MMM dd, yyyy')}</span>
              {c.response_date && <span>Responded: {format(new Date(c.response_date), 'MMM dd, yyyy')}</span>}
              {c.expiry_date && c.status === 'approved' && <span>Expires: {format(new Date(c.expiry_date), 'MMM dd, yyyy')}</span>}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {c.status === 'pending' && (
              <>
                <Button size="sm" className="gap-1.5" disabled={actingId === c.id} onClick={() => handleRespond(c.id, 'approve')}>
                  <ShieldCheck className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" disabled={actingId === c.id} onClick={() => handleRespond(c.id, 'deny')}>
                  <ShieldOff className="h-3.5 w-3.5" /> Deny
                </Button>
              </>
            )}
            {c.status === 'approved' && (
              <Button size="sm" variant="destructive" className="gap-1.5" disabled={actingId === c.id} onClick={() => handleRevoke(c.id)}>
                <ShieldOff className="h-3.5 w-3.5" /> Revoke
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ icon: Icon, message }: { icon: React.ElementType; message: string }) => (
    <Card><CardContent className="py-14 text-center">
      <Icon className="h-9 w-9 mx-auto text-muted-foreground/40 mb-3" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </CardContent></Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold">Consent Management</h1>
          <p className="text-muted-foreground mt-1">Control who can access your health records</p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="pending">
              Pending {!isLoading && pending.length > 0 && <span className="ml-1.5 text-xs opacity-60">({pending.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="history">
              History {!isLoading && history.length > 0 && <span className="ml-1.5 text-xs opacity-60">({history.length})</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3 mt-6">
            {isLoading
              ? [1, 2].map(i => <ConsentSkeleton key={i} />)
              : pending.length === 0
                ? <EmptyState icon={AlertCircle} message="No pending consent requests" />
                : pending.map(renderConsent)
            }
          </TabsContent>

          <TabsContent value="history" className="space-y-3 mt-6">
            {isLoading
              ? [1, 2].map(i => <ConsentSkeleton key={i} />)
              : history.length === 0
                ? <EmptyState icon={History} message="No consent history yet" />
                : history.map(renderConsent)
            }
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ConsentManagement;
