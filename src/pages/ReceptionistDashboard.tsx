import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Stethoscope, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ReceptionistDashboard: React.FC = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [doctorDialogOpen, setDoctorDialogOpen] = useState(false);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);

  const handleAddDoctor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // TODO: Replace with actual API call
    console.log({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      specialization: selectedSpecialization,
      phone: formData.get("phone"),
      email: formData.get("email"),
    });

    toast({
      title: "Doctor Added",
      description: "The doctor has been successfully added to the system.",
    });
    
    setDoctorDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // TODO: Replace with actual API call
    console.log({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dateOfBirth: formData.get("dateOfBirth"),
    });

    toast({
      title: "Patient Added",
      description: "The patient has been successfully registered.",
    });
    
    setPatientDialogOpen(false);
    e.currentTarget.reset();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Receptionist Dashboard</h1>
          <p className="text-muted-foreground">
            Manage patient registration and doctor assignments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dialog open={doctorDialogOpen} onOpenChange={setDoctorDialogOpen}>
            <DialogTrigger asChild>
              <Card className="healthcare-card cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Add Doctor</CardTitle>
                    <Stethoscope className="h-8 w-8 text-primary" />
                  </div>
                  <CardDescription>Register a new doctor to the system</CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>
                  Enter the doctor's information and assign a specialization.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddDoctor} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="general">General Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" required />
                </div>
                <Button type="submit" className="w-full">Add Doctor</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={patientDialogOpen} onOpenChange={setPatientDialogOpen}>
            <DialogTrigger asChild>
              <Card className="healthcare-card cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Add Patient</CardTitle>
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                  <CardDescription>Register a new patient to the system</CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter the patient's information to register them.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientFirstName">First Name</Label>
                    <Input id="patientFirstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientLastName">Last Name</Label>
                    <Input id="patientLastName" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientEmail">Email</Label>
                  <Input id="patientEmail" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientPhone">Phone Number</Label>
                  <Input id="patientPhone" name="phone" type="tel" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                </div>
                <Button type="submit" className="w-full">Register Patient</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Card className="healthcare-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Manage Specializations</CardTitle>
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardDescription>View and manage medical specializations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cardiology</span>
                  <span className="font-semibold">8 doctors</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pediatrics</span>
                  <span className="font-semibold">12 doctors</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dermatology</span>
                  <span className="font-semibold">5 doctors</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest patient registrations and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">John Doe registered</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">New Patient</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Dr. Sarah Johnson added to Cardiology</p>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">New Doctor</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Jane Smith scheduled appointment</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Appointment</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ReceptionistDashboard;
