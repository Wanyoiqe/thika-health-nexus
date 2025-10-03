import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, Calendar, Clock, MapPin, Activity, Pill, 
  FileText, DollarSign, AlertCircle, User
} from "lucide-react";

const PatientDashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search appointments, records, doctors..."
            className="pl-10 h-12"
          />
        </div>

        {/* Notification Card */}
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Upcoming Appointment</h3>
                <p className="text-sm text-muted-foreground">
                  You have an appointment with Dr. Sarah Kamau tomorrow at 10:00 AM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled visits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">SK</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">Dr. Sarah Kamau</h4>
                  <p className="text-sm text-muted-foreground">General Physician</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Dec 15, 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>10:00 AM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Thika Health Center</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View All Appointments
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates to your health records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Dr. John Mwangi", specialty: "Cardiologist", update: "Added new lab results" },
                { name: "Dr. Mary Njeri", specialty: "Dermatologist", update: "Updated prescription" },
                { name: "Dr. Peter Ochieng", specialty: "Orthopedic", update: "Completed consultation notes" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {activity.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm">{activity.name}</h5>
                    <p className="text-xs text-muted-foreground">{activity.specialty}</p>
                    <p className="text-xs text-foreground mt-0.5">{activity.update}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Prescription, Diagnosis, and Recent Bills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prescription Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-accent" />
                Prescriptions
              </CardTitle>
              <CardDescription>Active medications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Amoxicillin", dose: "500mg", instructions: "Take 3 times daily", refill: "Dec 10, 2024" },
                { name: "Ibuprofen", dose: "200mg", instructions: "Take as needed", refill: "Dec 8, 2024" },
                { name: "Vitamin D", dose: "1000IU", instructions: "Take once daily", refill: "Dec 5, 2024" }
              ].map((med, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <div className="flex items-start justify-between">
                    <h5 className="font-semibold">{med.name}</h5>
                    <Badge variant="secondary" className="text-xs">{med.dose}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{med.instructions}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3" />
                    <span>Last refill: {med.refill}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Request Refill
              </Button>
            </CardContent>
          </Card>

          {/* Diagnosis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Current Diagnosis
              </CardTitle>
              <CardDescription>Active conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">Hypertension</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Elevated blood pressure requiring monitoring and medication management.
                </p>
                <Separator className="my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Appointment:</span>
                    <span className="font-medium">Dec 20, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Main Doctor:</span>
                    <span className="font-medium">Dr. Sarah Kamau</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Reschedule
                </Button>
                <Separator className="my-3" />
                <div>
                  <h5 className="font-medium text-sm mb-2">Treatment Plan</h5>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Daily blood pressure monitoring</li>
                    <li>Low sodium diet</li>
                    <li>Regular exercise routine</li>
                    <li>Medication as prescribed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bills Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" />
                Recent Bills
              </CardTitle>
              <CardDescription>Payment summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { service: "General Consultation", date: "Dec 12, 2024", amount: "KES 2,500", status: "Paid" },
                { service: "Lab Tests", date: "Dec 10, 2024", amount: "KES 3,200", status: "Paid" },
                { service: "Prescription Refill", date: "Dec 8, 2024", amount: "KES 1,800", status: "Pending" }
              ].map((bill, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-sm">{bill.service}</h5>
                    <Badge 
                      variant={bill.status === "Paid" ? "secondary" : "default"}
                      className="text-xs"
                    >
                      {bill.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{bill.date}</span>
                    <span className="font-semibold">{bill.amount}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Bills
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientDashboard;
