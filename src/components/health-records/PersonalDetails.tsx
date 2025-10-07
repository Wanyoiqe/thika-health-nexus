import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Phone, Mail, MapPin, Users, Edit } from 'lucide-react';
import { Patient } from '@/mock/healthRecords';
import { toast } from '@/hooks/use-toast';

interface PersonalDetailsProps {
  patient: Patient;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ patient }) => {
  const [editedPatient, setEditedPatient] = useState(patient);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    // Mock save - in production, this would call an API
    toast({
      title: 'Details Updated',
      description: 'Your personal details have been saved successfully.',
    });
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Personal Details</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Personal Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={editedPatient.firstName}
                      onChange={(e) =>
                        setEditedPatient({ ...editedPatient, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={editedPatient.lastName}
                      onChange={(e) =>
                        setEditedPatient({ ...editedPatient, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editedPatient.phone}
                    onChange={(e) =>
                      setEditedPatient({ ...editedPatient, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editedPatient.email}
                    onChange={(e) =>
                      setEditedPatient({ ...editedPatient, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={editedPatient.address}
                    onChange={(e) =>
                      setEditedPatient({ ...editedPatient, address: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.firstName} ${patient.lastName}`} />
            <AvatarFallback>
              {patient.firstName[0]}
              {patient.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">
              {patient.firstName} {patient.lastName}
            </h3>
            <p className="text-muted-foreground">Patient ID: {patient.id}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Basic Information</p>
              <p className="text-sm text-muted-foreground">
                {patient.age} years • {patient.gender} • Blood Type: {patient.bloodType}
              </p>
              <p className="text-sm text-muted-foreground">DOB: {patient.dob}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{patient.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{patient.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Emergency Contact</p>
              <p className="text-sm text-muted-foreground">
                {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
              </p>
              <p className="text-sm text-muted-foreground">{patient.emergencyContact.phone}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
