import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save
} from "lucide-react";

export default function Profile() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline">
          <Edit size={16} className="mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Profile Info */}
        <div className="col-span-4">
          <Card>
            <CardHeader className="text-center pb-4">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">M</AvatarFallback>
              </Avatar>
              <CardTitle>Dr. Mithra</CardTitle>
              <p className="text-muted-foreground">DOCTOR</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Mail size={16} className="text-muted-foreground" />
                <span className="text-sm">mithra@1hat.com</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Phone size={16} className="text-muted-foreground" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <MapPin size={16} className="text-muted-foreground" />
                <span className="text-sm">Chennai, Tamil Nadu</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-sm">Joined March 2024</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Patients Managed</span>
                <span className="font-semibold">143</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Protocols Created</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Prescriptions Issued</span>
                <span className="font-semibold">487</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-semibold text-success">94%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Settings */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Mithra" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doctor" className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="mithra@1hat.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+91 98765 43210" className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Medical Street, Chennai, Tamil Nadu" className="mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input id="specialization" defaultValue="General Medicine" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" defaultValue="8" className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="license">Medical License</Label>
                  <Input id="license" defaultValue="DL12345678" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="clinic">Clinic/Hospital</Label>
                  <Input id="clinic" defaultValue="Guru Hospital" className="mt-1" />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
                <Button variant="outline">Change</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Manage notification preferences</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}