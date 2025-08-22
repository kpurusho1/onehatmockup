import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, X } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  isPrimary: boolean;
  dob: string;
  age: number;
  regNo: string;
  gender: string;
}

interface Patient {
  mobile: string;
  profiles: Profile[];
  codependentMembers: Profile[];
}

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock patient data based on phone number
const mockPatients: Record<string, Patient> = {
  "8954229999": {
    mobile: "8954229999",
    profiles: [
      {
        id: "1",
        name: "Parivel",
        isPrimary: true,
        dob: "30/03/1999",
        age: 24,
        regNo: "TP12",
        gender: "male"
      }
    ],
    codependentMembers: [
      {
        id: "2",
        name: "Ashwin",
        isPrimary: false,
        dob: "15/05/1995",
        age: 28,
        regNo: "TP13",
        gender: "male"
      },
      {
        id: "3",
        name: "Karthi",
        isPrimary: false,
        dob: "22/08/2000",
        age: 23,
        regNo: "TP14",
        gender: "male"
      }
    ]
  }
};

export function AddPatientDialog({ open, onOpenChange }: AddPatientDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    age: "",
    regNo: ""
  });

  const existingPatient = mockPatients[phoneNumber];
  
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setSelectedProfile(null);
    if (!mockPatients[value]) {
      setFormData({
        name: "",
        gender: "",
        dob: "",
        age: "",
        regNo: ""
      });
    }
  };

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setFormData({
      name: profile.name,
      gender: profile.gender,
      dob: profile.dob,
      age: profile.age.toString(),
      regNo: profile.regNo
    });
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving patient:", { phoneNumber, formData, selectedProfile });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary">Add Patient</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left Side - Phone Number and Profiles */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Patient mobile number</h3>
              <div className="flex gap-2">
                <Select defaultValue="+91">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter 10 digits"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {existingPatient && (
              <>
                <div>
                  <h4 className="text-md font-semibold mb-3">Profiles</h4>
                  <div className="space-y-2">
                    {existingPatient.profiles.map((profile) => (
                      <Card 
                        key={profile.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedProfile?.id === profile.id 
                            ? 'bg-primary/10 border-primary' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleProfileSelect(profile)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                              <AvatarFallback>
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{profile.name}</span>
                          </div>
                          {profile.isPrimary && (
                            <Badge variant="secondary" className="bg-primary/20 text-primary">
                              Primary
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {existingPatient.codependentMembers.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold mb-3">Co-dependent Members</h4>
                    <div className="space-y-2">
                      {existingPatient.codependentMembers.map((member) => (
                        <Card 
                          key={member.id}
                          className={`p-4 cursor-pointer transition-colors ${
                            selectedProfile?.id === member.id 
                              ? 'bg-primary/10 border-primary' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleProfileSelect(member)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 bg-muted">
                              <AvatarFallback>
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Side - Patient Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Patient Details</h3>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Gender</Label>
              <RadioGroup 
                value={formData.gender} 
                onValueChange={(value) => setFormData({...formData, gender: value})}
                className="flex gap-6"
                disabled={!!selectedProfile}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="fullName" className="text-sm font-medium mb-2 block">
                Patient's Full Name *
              </Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={!!selectedProfile}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob" className="text-sm font-medium mb-2 block">
                  DOB (DD/MM/YYYY)
                </Label>
                <Input
                  id="dob"
                  placeholder="DD/MM/YYYY"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  disabled={!!selectedProfile}
                />
              </div>
              <div className="flex items-center justify-center">
                <span className="text-muted-foreground">OR</span>
              </div>
              <div>
                <Label htmlFor="age" className="text-sm font-medium mb-2 block">
                  Age
                </Label>
                <Input
                  id="age"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  disabled={!!selectedProfile}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="regNo" className="text-sm font-medium mb-2 block">
                Reg No / ID (if any)
              </Label>
              <Input
                id="regNo"
                placeholder="Enter registration number or ID"
                value={formData.regNo}
                onChange={(e) => setFormData({...formData, regNo: e.target.value})}
                disabled={!!selectedProfile}
              />
            </div>

            <Button 
              onClick={handleSave}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!phoneNumber || !formData.name}
            >
              {existingPatient ? 'Save Details and Add' : 'Add Patient'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}