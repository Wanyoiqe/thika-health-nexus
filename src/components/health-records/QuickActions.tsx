import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecentActivity } from '@/mock/healthRecords';
import { Plus, Upload, Calendar, FileText, Pill } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuickActionsProps {
  recentActivity: RecentActivity[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ recentActivity }) => {
  const handleAction = (action: string) => {
    toast({
      title: 'Action Initiated',
      description: `${action} has been initiated.`,
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'lab':
        return <FileText className="h-4 w-4" />;
      case 'prescription':
        return <Pill className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAction('Add Note')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAction('Upload Document')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAction('Request Appointment')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Request Appointment
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="p-2 bg-muted rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
