import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Users, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DoctorDashboard: React.FC = () => {
  const [healthRecordDialogOpen, setHealthRecordDialogOpen] = useState(false);
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");

  const handleAddHealthRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // TODO: Replace with actual API call
    console.log({
      patientId: selectedPatient,
      diagnosis: formData.get("diagnosis"),
      prescription: formData.get("prescription"),
      notes: formData.get("notes"),
    });

    toast({
      title: "Health Record Added",
      description: "The patient's health record has been updated.",
    });
    
    setHealthRecordDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleRequestConsent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // TODO: Replace with actual API call
    console.log({
      patientId: formData.get("patientId"),
      reason: formData.get("reason"),
    });

    toast({
      title: "Consent Request Sent",
      description: "The patient will be notified of your request.",
    });
    
    setConsentDialogOpen(false);
    e.currentTarget.reset();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your appointments and patient health records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">2 pending confirmations</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground mt-1">12 new this month</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Records Updated
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consent Requests
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">Pending approval</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">My Patients</TabsTrigger>
            <TabsTrigger value="records">Health Records</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Today's Schedule</h2>
            </div>
            <Card className="healthcare-card">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { time: "09:00 AM", patient: "Sarah Johnson", reason: "Annual Checkup", status: "confirmed" },
                    { time: "10:30 AM", patient: "Michael Chen", reason: "Follow-up", status: "confirmed" },
                    { time: "11:45 AM", patient: "Emma Wilson", reason: "Consultation", status: "pending" },
                    { time: "02:00 PM", patient: "James Brown", reason: "Lab Results Review", status: "confirmed" },
                  ].map((appointment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-semibold">{appointment.time}</p>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-secondary/20 text-secondary' 
                          : 'bg-accent/20 text-accent'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Assigned Patients</h2>
              <Dialog open={consentDialogOpen} onOpenChange={setConsentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Request Consent</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Patient Consent</DialogTitle>
                    <DialogDescription>
                      Request access to view a patient's health records.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRequestConsent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input id="patientId" name="patientId" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Access</Label>
                      <Textarea id="reason" name="reason" required />
                    </div>
                    <Button type="submit" className="w-full">Send Request</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Card className="healthcare-card">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { id: "P001", name: "Sarah Johnson", lastVisit: "2024-01-10", nextAppointment: "2024-02-15" },
                    { id: "P002", name: "Michael Chen", lastVisit: "2024-01-08", nextAppointment: "2024-01-22" },
                    { id: "P003", name: "Emma Wilson", lastVisit: "2024-01-05", nextAppointment: "Not scheduled" },
                    { id: "P004", name: "James Brown", lastVisit: "2024-01-12", nextAppointment: "2024-01-25" },
                  ].map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">Last Visit: {patient.lastVisit}</p>
                        <p className="text-muted-foreground">Next: {patient.nextAppointment}</p>
                      </div>
                      <Button variant="outline" size="sm">View Records</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Health Record</h2>
              <Dialog open={healthRecordDialogOpen} onOpenChange={setHealthRecordDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add New Record</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add Patient Health Record</DialogTitle>
                    <DialogDescription>
                      Document diagnosis, prescriptions, and treatment notes.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddHealthRecord} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientSelect">Select Patient</Label>
                      <Input 
                        id="patientSelect" 
                        placeholder="Enter patient ID or name"
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Textarea id="diagnosis" name="diagnosis" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prescription">Prescription</Label>
                      <Textarea id="prescription" name="prescription" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Treatment Notes</Label>
                      <Textarea id="notes" name="notes" rows={4} />
                    </div>
                    <Button type="submit" className="w-full">Save Health Record</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Card className="healthcare-card">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { date: "2024-01-12", patient: "James Brown", diagnosis: "Hypertension follow-up", doctor: "You" },
                    { date: "2024-01-10", patient: "Sarah Johnson", diagnosis: "Annual physical examination", doctor: "You" },
                    { date: "2024-01-08", patient: "Michael Chen", diagnosis: "Diabetes management", doctor: "You" },
                  ].map((record, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{record.patient}</p>
                        <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">{record.date}</p>
                        <Button variant="link" size="sm" className="h-auto p-0">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DoctorDashboard;
