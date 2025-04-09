
import React from "react";
import { 
  FileText, 
  Calendar, 
  ExternalLink, 
  FileCheck,
  FilePlus2,
  FileCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock record data
const records = [
  {
    id: "1",
    title: "Diagnostic Report",
    patient: "Mary Njeri",
    date: "2025-04-05",
    type: "Lab Results",
    status: "new",
  },
  {
    id: "2",
    title: "Vaccination Record",
    patient: "John Kamau",
    date: "2025-04-03",
    type: "Preventive Care",
    status: "updated",
  },
  {
    id: "3",
    title: "Treatment Plan",
    patient: "Sarah Wambui",
    date: "2025-04-02",
    type: "Consultation Notes",
    status: "shared",
  },
  {
    id: "4",
    title: "Medication History",
    patient: "David Mutua",
    date: "2025-03-28",
    type: "Prescription",
    status: "updated",
  },
];

// Status icons mapping
const statusIcons = {
  new: <FilePlus2 className="h-4 w-4" />,
  updated: <FileCog className="h-4 w-4" />,
  shared: <FileCheck className="h-4 w-4" />,
};

// Status variant mapping
const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  new: "default",
  updated: "secondary",
  shared: "outline",
};

const RecentRecords: React.FC = () => {
  return (
    <Card className="healthcare-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Medical Records</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        <CardDescription>
          Latest updates to patient records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{record.title}</h4>
                    <Badge variant={statusVariant[record.status]} className="text-xs">
                      <span className="flex items-center gap-1">
                        {statusIcons[record.status as keyof typeof statusIcons]}
                        {record.status}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {record.patient} - {record.type}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{record.date}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRecords;
