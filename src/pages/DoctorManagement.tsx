import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useToast } from '@/hooks/use-toast';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { fetchAllDoctors, registerDoctor } from '@/apis/auth';
import { useAuth } from '@/AuthContext';
import { Doctor } from '@/types';

interface DoctorFormData {
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  phone: string;
  password: string;
}

interface DoctorFormProps {
  formData: DoctorFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpecializationChange: (value: string) => void;
  selectedDoctor: Doctor | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const DoctorForm: React.FC<DoctorFormProps> = ({
  formData,
  onInputChange,
  onSpecializationChange,
  selectedDoctor,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="firstName">First Name</label>
        <Input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={onInputChange}
          required
          autoFocus={!selectedDoctor}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="lastName">Last Name</label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={onInputChange}
          required
        />
      </div>
    </div>
    <div className="space-y-2">
      <label htmlFor="email">Email</label>
      <Input
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onInputChange}
        required
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="password">Password</label>
      <Input
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={onInputChange}
        required
      />
    </div>
    <div className="space-y-2 d-none">
      <label htmlFor="specialization">Specialization</label>
      <Select
        value={formData.specialization}
        onValueChange={onSpecializationChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select specialization" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cardiology">Cardiology</SelectItem>
          <SelectItem value="dermatology">Dermatology</SelectItem>
          <SelectItem value="neurology">Neurology</SelectItem>
          <SelectItem value="pediatrics">Pediatrics</SelectItem>
          <SelectItem value="psychiatry">Psychiatry</SelectItem>
          <SelectItem value="radiology">Radiology</SelectItem>
          <SelectItem value='oncology'>Oncology</SelectItem>
          <SelectItem value="orthopedics">Orthopedics</SelectItem>
          <SelectItem value="gynecology">Gynecology</SelectItem>
          <SelectItem value="general_medicine">General Medicine</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <label htmlFor="phone">Phone</label>
      <Input
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={onInputChange}
        required
      />
    </div>
    <Button type="submit" className="w-full">
      {selectedDoctor ? 'Update Doctor' : 'Add Doctor'}
    </Button>
  </form>
);

const DoctorManagement = () => {
  const { refreshToken } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetchAllDoctors(refreshToken);
      setDoctors(response.doctors);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  console.log('Doctors:', doctors);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSpecializationChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        specialization: value,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // // Replace with your actual API call
      const response = await registerDoctor(refreshToken, formData);
      if(response.result_code === 1) {
        toast.success('Doctor added successfully');
        setIsAddDialogOpen(false);
        fetchDoctors();
      }
    } catch (error) {
      toast.error('Failed to add doctor');
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      firstName: doctor.first_name,
      lastName: doctor.last_name,
      email: doctor.email,
      specialization: doctor.specialization,
      phone: doctor.phone_number,   
      password: '',   
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    try {
      // Replace with your actual API call
      const response = await fetch(`/api/providers/registerDoctor/${selectedDoctor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success('Doctor updated successfully');
        setIsEditDialogOpen(false);
        fetchDoctors();
      }
    } catch (error) {
      toast.error('Failed to update doctor');
    }
  };

  const handleOpenAddDialog = useCallback((open: boolean) => {
    setIsAddDialogOpen(open);
  }, []);

  const handleOpenEditDialog = useCallback((open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setSelectedDoctor(null);
    }
  }, []);

  const handleAddDoctorClick = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      specialization: '',
      phone: '',
      password: '',
    });
    setSelectedDoctor(null);
    setIsAddDialogOpen(true);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={handleOpenAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleAddDoctorClick}>
                <Plus className="mr-2 h-4 w-4" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
              </DialogHeader>
              <DoctorForm
                formData={formData}
                onInputChange={handleInputChange}
                onSpecializationChange={handleSpecializationChange}
                selectedDoctor={selectedDoctor}
                onSubmit={handleSubmit}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.first_name}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.phone_number}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={handleOpenEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Doctor</DialogTitle>
            </DialogHeader>
            <DoctorForm
              formData={formData}
              onInputChange={handleInputChange}
              onSpecializationChange={handleSpecializationChange}
              selectedDoctor={selectedDoctor}
              onSubmit={handleUpdate}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default DoctorManagement;