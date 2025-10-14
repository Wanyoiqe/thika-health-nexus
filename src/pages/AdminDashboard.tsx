import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCog, Activity, Settings, Shield, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard: React.FC = () => {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // TODO: Replace with actual API call
    console.log({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      role: selectedRole,
      phone: formData.get("phone"),
    });

    toast({
      title: "User Added",
      description: `New ${selectedRole} has been added to the system.`,
    });
    
    setUserDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleRemoveUser = (userId: string, userName: string) => {
    // TODO: Replace with actual API call
    console.log("Removing user:", userId);
    
    toast({
      title: "User Removed",
      description: `${userName} has been removed from the system.`,
      variant: "destructive",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Oversee system operations, manage users, and generate reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground mt-1">+18% from last month</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Doctors
              </CardTitle>
              <UserCog className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground mt-1">Across 6 specializations</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                System Activity
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground mt-1">Server uptime</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appointments Today
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">324</div>
              <p className="text-xs text-muted-foreground mt-1">12 pending confirmations</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="activity">System Activity</TabsTrigger>
            <TabsTrigger value="specializations">Specializations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Users</h2>
              <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add New User</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account for doctors, receptionists, or patients.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddUser} className="space-y-4">
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
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">User Role</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="receptionist">Receptionist</SelectItem>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">Create User</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="healthcare-card">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { id: "U001", name: "Dr. Sarah Johnson", role: "Doctor", specialization: "Cardiology", status: "Active" },
                    { id: "U002", name: "Michael Chen", role: "Receptionist", specialization: "N/A", status: "Active" },
                    { id: "U003", name: "Emma Wilson", role: "Doctor", specialization: "Pediatrics", status: "Active" },
                    { id: "U004", name: "James Brown", role: "Patient", specialization: "N/A", status: "Active" },
                  ].map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.role} {user.specialization !== "N/A" && `• ${user.specialization}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                          {user.status}
                        </span>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveUser(user.id, user.name)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-xl font-semibold">Recent System Activity</h2>
            <Card className="healthcare-card">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { time: "10 minutes ago", action: "New patient registered", user: "Reception Desk 1", type: "info" },
                    { time: "25 minutes ago", action: "Appointment scheduled", user: "Dr. Sarah Johnson", type: "success" },
                    { time: "1 hour ago", action: "Health record updated", user: "Dr. Michael Chen", type: "info" },
                    { time: "2 hours ago", action: "Consent request approved", user: "Patient John Doe", type: "success" },
                    { time: "3 hours ago", action: "Failed login attempt", user: "Unknown", type: "warning" },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">By: {activity.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          activity.type === 'success' ? 'bg-secondary/20 text-secondary' :
                          activity.type === 'warning' ? 'bg-destructive/20 text-destructive' :
                          'bg-primary/20 text-primary'
                        }`}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specializations" className="space-y-4">
            <h2 className="text-xl font-semibold">Medical Specializations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Cardiology", doctors: 8, patients: 245, color: "bg-red-100 text-red-700" },
                { name: "Pediatrics", doctors: 12, patients: 432, color: "bg-blue-100 text-blue-700" },
                { name: "Dermatology", doctors: 5, patients: 178, color: "bg-green-100 text-green-700" },
                { name: "Orthopedics", doctors: 7, patients: 312, color: "bg-yellow-100 text-yellow-700" },
                { name: "Neurology", doctors: 6, patients: 189, color: "bg-purple-100 text-purple-700" },
                { name: "General Practice", doctors: 15, patients: 678, color: "bg-gray-100 text-gray-700" },
              ].map((spec) => (
                <Card key={spec.name} className="healthcare-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{spec.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Doctors:</span>
                        <span className="font-semibold">{spec.doctors}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Patients:</span>
                        <span className="font-semibold">{spec.patients}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-xl font-semibold">Hospital Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="healthcare-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Security Settings</CardTitle>
                  </div>
                  <CardDescription>Manage authentication and access control</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Configure 2FA
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Password Policies
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Session Management
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <CardTitle>System Configuration</CardTitle>
                  </div>
                  <CardDescription>Configure system-wide settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Email Templates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Backup Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      API Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
