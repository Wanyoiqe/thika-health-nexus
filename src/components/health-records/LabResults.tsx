import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LabResult } from '@/mock/healthRecords';
import { FileText, Download, Eye, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LabResultsProps {
  labResults: LabResult[];
}

export const LabResults: React.FC<LabResultsProps> = ({ labResults }) => {
  const [viewingResult, setViewingResult] = useState<LabResult | null>(null);

  const handleUpload = () => {
    // Mock upload - in production, this would handle file upload
    toast({
      title: 'Upload Started',
      description: 'Your lab result is being uploaded.',
    });
  };

  const handleDownload = (result: LabResult) => {
    // Mock download - in production, this would download the actual PDF
    toast({
      title: 'Download Started',
      description: `Downloading ${result.testName} results.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Lab Results</h3>
        <Button onClick={handleUpload} size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload PDF
        </Button>
      </div>

      <div className="space-y-3">
        {labResults.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{result.testName}</h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(result.date).toLocaleDateString()} • {result.provider}
                    </p>
                    <p className="text-sm">{result.results}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(result.status)}>
                  {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                </Badge>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingResult(result)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(result)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!viewingResult} onOpenChange={() => setViewingResult(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{viewingResult?.testName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Test Details</p>
              <div className="space-y-1 text-sm">
                <p>Date: {viewingResult && new Date(viewingResult.date).toLocaleDateString()}</p>
                <p>Provider: {viewingResult?.provider}</p>
                <p>Status: {viewingResult?.status}</p>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Results</p>
              <p className="text-sm">{viewingResult?.results}</p>
            </div>
            <div className="flex items-center justify-center p-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">PDF Preview would display here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
