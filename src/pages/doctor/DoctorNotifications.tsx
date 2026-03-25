import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Calendar, FileText, Clock, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/AuthContext';
import { getNotifications, markOneRead, markAllRead } from '@/apis/notifications';
import { useToast } from '@/hooks/use-toast';
import type { AppNotification } from '@/types';

const typeConfig: Record<AppNotification['type'], { icon: React.ElementType; color: string; label: string }> = {
  appointment_booked:    { icon: Calendar,    color: 'text-primary',     label: 'Appointment' },
  consent_approved:      { icon: ShieldCheck, color: 'text-secondary',   label: 'Consent'     },
  consent_denied:        { icon: ShieldCheck, color: 'text-destructive', label: 'Consent'     },
  health_record_created: { icon: FileText,    color: 'text-accent',      label: 'Record'      },
};

const NotificationSkeleton = () => (
  <Card>
    <CardContent className="p-5">
      <div className="flex gap-4">
        <Skeleton className="h-11 w-11 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-72" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const DoctorNotifications: React.FC = () => {
  const { refreshToken } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = refreshToken || localStorage.getItem('refreshToken') || '';

  useEffect(() => {
    if (token) load();
  }, []);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications(token);
      setNotifications(res.notifications);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkOne = async (id: string) => {
    try {
      await markOneRead(token, id);
      setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? 'Loading...' : unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAll}>Mark All as Read</Button>
          )}
        </div>

        <div className="space-y-3">
          {isLoading
            ? [1, 2, 3, 4].map(i => <NotificationSkeleton key={i} />)
            : notifications.length === 0
              ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Bell className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No notifications yet. Check back later.</p>
                  </CardContent>
                </Card>
              )
              : notifications.map(notif => {
                  const cfg = typeConfig[notif.type] ?? { icon: Bell, color: 'text-foreground', label: 'System' };
                  const Icon = cfg.icon;
                  return (
                    <Card
                      key={notif.notification_id}
                      className={`transition-all hover:shadow-md ${!notif.is_read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-full bg-muted shrink-0 ${cfg.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm">{notif.title}</h3>
                              {!notif.is_read && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                              <Badge variant="outline" className="text-xs">{cfg.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
                            <div className="flex items-center justify-between pt-1">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                              </span>
                              {!notif.is_read && (
                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleMarkOne(notif.notification_id)}>
                                  Mark as Read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
          }
        </div>
      </div>
    </MainLayout>
  );
};

export default DoctorNotifications;
