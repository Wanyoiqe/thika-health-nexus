import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Diagnosis } from '@/mock/healthRecords';
import { AlertCircle, CheckCircle2, Activity } from 'lucide-react';

interface MedicalHistoryProps {
  diagnoses: Diagnosis[];
}

export const MedicalHistory: React.FC<MedicalHistoryProps> = ({ diagnoses }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'chronic':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertCircle className="h-4 w-4" />;
      case 'chronic':
        return <Activity className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Medical History</h3>
      {diagnoses.map((diagnosis) => (
        <Card key={diagnosis.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-base mb-1">{diagnosis.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Diagnosed: {new Date(diagnosis.diagnosisDate).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline" className={getStatusColor(diagnosis.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(diagnosis.status)}
                  {diagnosis.status.charAt(0).toUpperCase() + diagnosis.status.slice(1)}
                </span>
              </Badge>
            </div>
            <p className="text-sm mb-2">{diagnosis.notes}</p>
            <p className="text-sm text-muted-foreground">Provider: {diagnosis.provider}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
