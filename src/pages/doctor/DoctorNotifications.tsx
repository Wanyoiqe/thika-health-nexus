import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'appointment' | 'consent' | 'record' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const DoctorNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'New Appointment Booked',
      message: 'John Doe has booked an appointment for Oct 24, 2025 at 10:00 AM',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'consent',
      title: 'Consent Request Approved',
      message: 'Jane Smith has approved your request to access Medical History records',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'record',
      title: 'Lab Results Available',
      message: 'New lab results are available for Michael Johnson',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'appointment',
      title: 'Appointment Cancelled',
      message: 'Sarah Williams has cancelled the appointment scheduled for Oct 23, 2025',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update',
      message: 'The system will undergo maintenance on Oct 25, 2025 from 2:00 AM to 4:00 AM',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'low'
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-5 w-5" />;
      case 'consent':
        return <CheckCircle className="h-5 w-5" />;
      case 'record':
        return <FileText className="h-5 w-5" />;
      case 'system':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return 'text-primary';
      case 'consent':
        return 'text-secondary';
      case 'record':
        return 'text-accent';
      case 'system':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full bg-muted ${getIconColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      {getPriorityBadge(notification.priority)}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(notification.timestamp), 'MMM dd, yyyy h:mm aa')}</span>
                      </div>
                      
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {notifications.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DoctorNotifications;
