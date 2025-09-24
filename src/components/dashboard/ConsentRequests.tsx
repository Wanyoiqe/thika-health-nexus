import React from "react";
import { 
  Clock, 
  Shield, 
  CheckCircle2,
  XCircle, 
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock consent data
const consentRequests = [
  {
    id: "1",
    clinic: "Thika Central Hospital",
    date: "2025-04-09",
    purpose: "Access to vaccination records",
    status: "pending",
    urgent: false,
  },
  {
    id: "2",
    clinic: "Kiambu County Referral",
    date: "2025-04-08",
    purpose: "Treatment consultation",
    status: "pending",
    urgent: true,
  },
  {
    id: "3",
    clinic: "Ruiru Health Center",
    date: "2025-04-07",
    purpose: "Allergy information",
    status: "pending",
    urgent: false,
  },
];

const ConsentRequests: React.FC = () => {
  return (
    <Card className="healthcare-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Consent Requests</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        <CardDescription>
          Manage data access requests from healthcare providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consentRequests.map((request) => (
            <div
              key={request.id}
              className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{request.clinic}</h4>
                <div className="flex items-center gap-1">
                  {request.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {request.status}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm mb-2">{request.purpose}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Requested {request.date}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-3 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <XCircle className="h-4 w-4 mr-1" />
                    Deny
                  </Button>
                  <Button size="sm" className="h-8 px-3 bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {consentRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">No Pending Requests</h3>
              <p className="text-sm text-gray-500">
                You don't have any pending consent requests at this time.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentRequests;
