import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCog, Activity, Settings, Shield, TrendingUp, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/AuthContext";
import { fetchReceptionistDashboardDetails } from "@/apis/providers";
import { fetchAllDoctors } from "@/apis/auth";
import type { ReceptionistData, Doctor } from "@/types";
import { TwoFactorSettings } from "@/components/security/TwoFactorSettings";
import { PasswordPolicySettings } from "@/components/security/PasswordPolicySettings";
import { SessionManagementSettings } from "@/components/security/SessionManagementSettings";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  let { refreshToken } = useAuth();
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [stats, setStats] = useState<ReceptionistData | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (refreshToken === null) {
      refreshToken = localStorage.getItem('refreshToken')!;
    }
    if (user && refreshToken) {
      fetchAdminData(refreshToken);
    }
  }, [user]);

  const fetchAdminData = async (token: string) => {
    setIsLoading(true);
    try {
      const [statsRes, doctorsRes] = await Promise.allSettled([
        fetchReceptionistDashboardDetails(token),
        fetchAllDoctors(token),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data as unknown as ReceptionistData);
      }
      if (doctorsRes.status === 'fulfilled') {
        setDoctors(doctorsRes.value.doctors);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load admin dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '—' : (stats?.patientCount ?? '—')}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered patients</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Staff
              </CardTitle>
              <UserCog className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '—' : (stats?.staffCount ?? '—')}</div>
              <p className="text-xs text-muted-foreground mt-1">Doctors &amp; receptionists</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appointments Today
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '—' : (stats?.appointmentCountToday ?? '—')}</div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Appointments
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '—' : (stats?.appointmentCount ?? '—')}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="activity">System Activity</TabsTrigger>
            <TabsTrigger value="specializations">Specializations</TabsTrigger>
            <TabsTrigger value="security">
              <ShieldCheck className="h-4 w-4 mr-1.5" /> Security
            </TabsTrigger>
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
                  {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
                  {!isLoading && doctors.length === 0 && (
                    <p className="text-muted-foreground text-sm">No doctors found.</p>
                  )}
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{doctor.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Doctor • {doctor.specialization}
                        </p>
                        <p className="text-xs text-muted-foreground">{doctor.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                          Active
                        </span>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveUser(doctor.id, doctor.full_name)}
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
            {/* TODO: wire to GET /api/admin/audit-logs once backend endpoint is available */}
            <Card className="healthcare-card">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-sm text-center py-8">
                  Audit log endpoint not yet available. Pending backend implementation.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specializations" className="space-y-4">
            <h2 className="text-xl font-semibold">Medical Specializations</h2>
            {/* TODO: wire to GET /api/admin/specializations/stats once backend endpoint is available */}
            <Card className="healthcare-card">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-sm text-center py-8">
                  Specialization stats endpoint not yet available. Pending backend implementation.
                </p>
              </CardContent>
            </Card>
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
