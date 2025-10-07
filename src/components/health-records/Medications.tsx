import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Medication } from '@/mock/healthRecords';
import { Pill, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MedicationsProps {
  medications: Medication[];
}

export const Medications: React.FC<MedicationsProps> = ({ medications }) => {
  const currentMeds = medications.filter((med) => med.status === 'current');
  const pastMeds = medications.filter((med) => med.status === 'past');

  const handleRefill = (medication: Medication) => {
    toast({
      title: 'Refill Requested',
      description: `Refill request for ${medication.name} has been sent to your pharmacy.`,
    });
  };

  const MedicationCard = ({ medication }: { medication: Medication }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Pill className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">
                {medication.name} {medication.dosage}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {medication.instructions}
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Prescribed by:</span> {medication.prescribingDoctor}
                </p>
                <p>
                  <span className="font-medium">Start Date:</span>{' '}
                  {new Date(medication.startDate).toLocaleDateString()}
                </p>
                {medication.endDate && (
                  <p>
                    <span className="font-medium">End Date:</span>{' '}
                    {new Date(medication.endDate).toLocaleDateString()}
                  </p>
                )}
                {medication.refillsRemaining !== undefined && (
                  <p>
                    <span className="font-medium">Refills Remaining:</span>{' '}
                    {medication.refillsRemaining}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {medication.status === 'current' && medication.refillsRemaining !== undefined && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => handleRefill(medication)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Request Refill
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Medications</h3>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {currentMeds.length} Active
          </Badge>
        </div>
        <div className="space-y-3">
          {currentMeds.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Past Medications</h3>
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {pastMeds.length} Historical
          </Badge>
        </div>
        <div className="space-y-3">
          {pastMeds.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
      </div>
    </div>
  );
};
