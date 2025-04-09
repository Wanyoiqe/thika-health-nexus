
import React from "react";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  User,
  X,
  Check
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock appointments data
const appointments = [
  {
    id: "1",
    patient: "Jane Otieno",
    date: "2025-04-10",
    time: "09:30",
    purpose: "Follow-up consultation",
    status: "confirmed",
  },
  {
    id: "2",
    patient: "Michael Wanjiru",
    date: "2025-04-10",
    time: "11:00",
    purpose: "Blood test results",
    status: "confirmed",
  },
  {
    id: "3",
    patient: "Grace Muthoni",
    date: "2025-04-10",
    time: "14:15",
    purpose: "Annual check-up",
    status: "pending",
  },
  {
    id: "4",
    patient: "David Kariuki",
    date: "2025-04-11",
    time: "10:45",
    purpose: "Prescription renewal",
    status: "confirmed",
  },
];

const AppointmentList: React.FC = () => {
  return (
    <Card className="healthcare-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Appointments</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        <CardDescription>
          Manage your scheduled appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{appointment.patient}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={appointment.status === "confirmed" ? "outline" : "secondary"}>
                  {appointment.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span>Confirm</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentList;
