import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  User, 
  Calendar, 
  FileText, 
  Edit, 
  Send, 
  Mic,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type Patient = {
  id: string;
  name: string;
  age: number;
  phone: string;
  avatar?: string;
};

type Record = {
  id: string;
  date: string;
  segments: number;
  sent: number;
  edited: number;
  status: 'sent' | 'draft';
  diagnosis?: string;
  prescriptions?: Array<{
    medicine: string;
    morning: number;
    noon: number;
    evening: number;
    night: number;
    duration: string;
    timeToTake: string;
    remarks: string;
  }>;
};

const mockPatients: Patient[] = [
  { id: "1", name: "John Doe", age: 45, phone: "9876543210" },
  { id: "2", name: "Jane Smith", age: 32, phone: "9765432109" },
  { id: "3", name: "Patient (Test)", age: 28, phone: "8954229999" },
];

const mockRecords: Record[] = [
  {
    id: "1",
    date: "22 Aug 2025",
    segments: 16,
    sent: 4,
    edited: 0,
    status: 'sent',
    diagnosis: "Kidney stone",
    prescriptions: [{
      medicine: "Cefixime",
      morning: 1,
      noon: 0,
      evening: 1,
      night: 0,
      duration: "7 days",
      timeToTake: "N/A",
      remarks: "Oral antibiotic, 200 BD, morning one, evening one, for seven days, finish a course."
    }]
  },
  {
    id: "2",
    date: "22 Aug 2025",
    segments: 14,
    sent: 3,
    edited: 0,
    status: 'sent'
  },
  {
    id: "3",
    date: "14 Aug 2025",
    segments: 15,
    sent: 7,
    edited: 0,
    status: 'sent'
  }
];

export default function ViewHealthRecordsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSendToPatient = () => {
    setShowSendDialog(false);
    setSelectedSections([]);
    // Handle send logic here
  };

  const toggleSection = (section: string) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!selectedPatient) {
    return (
      <div className="p-4 space-y-6 pb-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">View Health Records</h2>
          <p className="text-muted-foreground">Select a patient to view their records</p>
        </div>

        {/* Patient Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search patients by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Patient List */}
        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback>
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Age: {patient.age} • Phone: {patient.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (selectedRecord) {
    return (
      <div className="p-4 space-y-6 pb-24">
        {/* Patient Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-white/20 text-white">
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                <p className="text-white/80">ID: #{selectedPatient.id}230187</p>
                <p className="text-white/80">Age: {selectedPatient.age} years • {selectedPatient.phone}</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setSelectedRecord(null)}
            >
              Back to Records
            </Button>
          </div>
        </div>

        {/* Record Content */}
        <div className="grid grid-cols-12 gap-4">
          {/* Medical Records Sidebar */}
          <div className="col-span-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <FileText size={20} />
                  <CardTitle className="text-lg">Medical Records</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecords.map((record) => (
                  <div 
                    key={record.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      record.id === selectedRecord.id ? 'bg-primary/10 border-primary' : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="font-semibold text-sm">{record.date}</div>
                    <div className="text-xs text-muted-foreground">{record.segments} segments</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        <span className="text-green-600">{record.sent} sent</span>
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <span className="text-orange-600">{record.edited} edited</span>
                      </Badge>
                    </div>
                    <Badge variant={record.status === 'sent' ? 'default' : 'secondary'} className="mt-2">
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} />
                    <CardTitle>Consultation - {selectedRecord.date}</CardTitle>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Items / Other Items Tabs */}
                <div className="flex space-x-6 border-b">
                  <button className="pb-2 border-b-2 border-primary font-semibold">
                    Key Items
                  </button>
                  <button className="pb-2 text-muted-foreground">
                    Other Items
                  </button>
                </div>

                {/* Diagnosis */}
                {selectedRecord.diagnosis && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Diagnosis</h3>
                    <p>{selectedRecord.diagnosis}</p>
                  </div>
                )}

                {/* Prescription */}
                {selectedRecord.prescriptions && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 className="font-semibold text-lg">Prescription</h3>
                      <Badge variant="secondary" className="text-green-600">Sent</Badge>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2 text-left">Medicine</th>
                            <th className="border border-gray-300 p-2 text-center">Morning</th>
                            <th className="border border-gray-300 p-2 text-center">Noon</th>
                            <th className="border border-gray-300 p-2 text-center">Evening</th>
                            <th className="border border-gray-300 p-2 text-center">Night</th>
                            <th className="border border-gray-300 p-2 text-center">Duration (Days)</th>
                            <th className="border border-gray-300 p-2 text-center">Time to Take</th>
                            <th className="border border-gray-300 p-2 text-left">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRecord.prescriptions.map((prescription, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 p-2">{prescription.medicine}</td>
                              <td className="border border-gray-300 p-2 text-center">{prescription.morning}</td>
                              <td className="border border-gray-300 p-2 text-center">{prescription.noon}</td>
                              <td className="border border-gray-300 p-2 text-center">{prescription.evening}</td>
                              <td className="border border-gray-300 p-2 text-center">{prescription.night}</td>
                              <td className="border border-gray-300 p-2 text-center">{prescription.duration}</td>
                              <td className="border border-gray-300 p-2 text-center">{prescription.timeToTake}</td>
                              <td className="border border-gray-300 p-2">{prescription.remarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => setShowSendDialog(true)}
                  >
                    <Send size={16} className="mr-2" />
                    Send to Patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Send Dialog */}
        <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send to Patient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select which sections to send to {selectedPatient.name}:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="diagnosis"
                    checked={selectedSections.includes('diagnosis')}
                    onCheckedChange={() => toggleSection('diagnosis')}
                  />
                  <label htmlFor="diagnosis" className="text-sm font-medium">
                    Diagnosis
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="prescription"
                    checked={selectedSections.includes('prescription')}
                    onCheckedChange={() => toggleSection('prescription')}
                  />
                  <label htmlFor="prescription" className="text-sm font-medium">
                    Prescription
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="notes"
                    checked={selectedSections.includes('notes')}
                    onCheckedChange={() => toggleSection('notes')}
                  />
                  <label htmlFor="notes" className="text-sm font-medium">
                    Consultation Notes
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowSendDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSendToPatient} className="flex-1">
                  Send Selected
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-white/20 text-white">
                <User size={20} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
              <p className="text-white/80">ID: #{selectedPatient.id}230187</p>
              <p className="text-white/80">Age: {selectedPatient.age} years • {selectedPatient.phone}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setSelectedPatient(null)}
          >
            Change Patient
          </Button>
        </div>
      </div>

      {/* Medical Records List */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText size={20} />
            <CardTitle>Medical Records</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockRecords.map((record) => (
            <Card 
              key={record.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedRecord(record)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{record.date}</div>
                    <div className="text-sm text-muted-foreground">{record.segments} segments</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        <span className="text-green-600">{record.sent} sent</span>
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <span className="text-orange-600">{record.edited} edited</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={record.status === 'sent' ? 'default' : 'secondary'}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}