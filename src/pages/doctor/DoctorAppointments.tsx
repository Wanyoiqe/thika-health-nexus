import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  XCircle,
  Search,
  Users,
} from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { useAuth } from '@/AuthContext';
import { getDoctorAllAppointments, updateAppointmentStatus } from '@/apis/appointments';
import { toast } from '@/hooks/use-toast';
import type { Appointment } from '@/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatRelativeDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isThisWeek(d)) return format(d, 'EEEE'); // e.g. "Wednesday"
  return format(d, 'MMM dd, yyyy');
};

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
  if (status === 'completed') return 'default';
  if (status === 'cancelled') return 'destructive';
  return 'secondary';
};

// ─── Skeleton loader ─────────────────────────────────────────────────────────

const AppointmentSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex gap-4 items-center">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    </CardContent>
  </Card>
);

// ─── Appointment card ────────────────────────────────────────────────────────

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange: (appId: string, status: 'completed' | 'cancelled') => void;
  updatingId: string | null;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onStatusChange, updatingId }) => {
  const patient = appointment.patient;
  const initials = patient
    ? `${patient.firstName?.[0] ?? ''}${patient.lastName?.[0] ?? ''}`.toUpperCase()
    : '??';
  const fullName = patient
    ? `${patient.firstName} ${patient.lastName}`.trim()
    : 'Unknown Patient';
  const isUpdating = updatingId === appointment.app_id;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <Avatar className="h-14 w-14 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-base">{fullName}</h3>
              <Badge variant={statusVariant(appointment.status)} className="capitalize text-xs">
                {appointment.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatRelativeDate(appointment.date_time)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {format(new Date(appointment.date_time), 'h:mm aa')}
              </span>
              {patient?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.phone}
                </span>
              )}
            </div>
          </div>

          {/* Actions — only for scheduled */}
          {appointment.status === 'scheduled' && (
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                className="gap-1.5"
                disabled={isUpdating}
                onClick={() => onStatusChange(appointment.app_id, 'completed')}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                disabled={isUpdating}
                onClick={() => onStatusChange(appointment.app_id, 'cancelled')}
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Empty state ─────────────────────────────────────────────────────────────

const EmptyState = ({ icon: Icon, message }: { icon: React.ElementType; message: string }) => (
  <Card>
    <CardContent className="py-16 text-center">
      <Icon className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
      <p className="text-muted-foreground">{message}</p>
    </CardContent>
  </Card>
);

// ─── Page ────────────────────────────────────────────────────────────────────

const DoctorAppointments: React.FC = () => {
  const { user } = useAuth();
  let { refreshToken } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (refreshToken === null) {
      refreshToken = localStorage.getItem('refreshToken')!;
    }
    if (user && refreshToken) {
      fetchAppointments(refreshToken);
    }
  }, [user]);

  const fetchAppointments = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await getDoctorAllAppointments(token);
      setAppointments(res.appointments);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load appointments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, status: 'completed' | 'cancelled') => {
    const token = refreshToken || localStorage.getItem('refreshToken')!;
    setUpdatingId(appId);
    try {
      await updateAppointmentStatus(token, appId, status);
      setAppointments(prev =>
        prev.map(a => a.app_id === appId ? { ...a, status } : a)
      );
      toast({ title: 'Updated', description: `Appointment marked as ${status}.` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter by patient name search
  const filtered = useMemo(() => {
    if (!search.trim()) return appointments;
    const q = search.toLowerCase();
    return appointments.filter(a => {
      const name = a.patient
        ? `${a.patient.firstName} ${a.patient.lastName}`.toLowerCase()
        : '';
      return name.includes(q);
    });
  }, [appointments, search]);

  const upcoming = filtered.filter(a => a.status === 'scheduled');
  const completed = filtered.filter(a => a.status === 'completed');
  const cancelled = filtered.filter(a => a.status === 'cancelled');

  const renderList = (
    list: Appointment[],
    emptyIcon: React.ElementType,
    emptyMsg: string
  ) => {
    if (isLoading) return [1, 2, 3].map(i => <AppointmentSkeleton key={i} />);
    if (!list.length) return <EmptyState icon={emptyIcon} message={emptyMsg} />;
    return list.map(a => (
      <AppointmentCard
        key={a.app_id}
        appointment={a}
        onStatusChange={handleStatusChange}
        updatingId={updatingId}
      />
    ));
  };

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage your patient appointments</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Upcoming', value: upcoming.length, color: 'text-primary' },
            { label: 'Completed', value: completed.length, color: 'text-secondary' },
            { label: 'Cancelled', value: cancelled.length, color: 'text-destructive' },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <p className={`text-3xl font-bold ${stat.color}`}>{isLoading ? '—' : stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="upcoming">
              Upcoming {!isLoading && <span className="ml-1.5 text-xs opacity-60">({upcoming.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed {!isLoading && <span className="ml-1.5 text-xs opacity-60">({completed.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled {!isLoading && <span className="ml-1.5 text-xs opacity-60">({cancelled.length})</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3 mt-6">
            {renderList(upcoming, Calendar, 'No upcoming appointments — your schedule is clear')}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-6">
            {renderList(completed, CheckCircle, 'No completed appointments yet')}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-3 mt-6">
            {renderList(cancelled, XCircle, 'No cancelled appointments')}
          </TabsContent>
        </Tabs>

      </div>
    </MainLayout>
  );
};

export default DoctorAppointments;
