import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
  Clock,
  ArrowLeft,
  Eye,
  MessageSquare,
  Bot
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
  { id: "3", name: "Robert Johnson", age: 28, phone: "8754321098" },
  { id: "4", name: "Emily Davis", age: 32, phone: "9123456789" },
  { id: "5", name: "Michael Brown", age: 58, phone: "8765432109" },
  { id: "6", name: "Sarah Wilson", age: 29, phone: "9234567890" },
  { id: "7", name: "David Miller", age: 42, phone: "8654321987" },
  { id: "8", name: "Lisa Garcia", age: 36, phone: "9345678901" },
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
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setIsAiLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setAiResponse(`Based on ${selectedPatient?.name}'s medical history, I can provide insights about their recent consultations and treatment patterns. What specific aspect would you like me to analyze?`);
      setIsAiLoading(false);
    }, 2000);
  };

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
        {/* Back Button */}
        <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
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
              className="hover:bg-accent/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{patient.name}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{patient.age} yrs</span>
                      </div>
                      <span className="text-sm text-muted-foreground/70 italic ml-auto">{patient.phone}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedPatient(patient)}
                    className="ml-3"
                  >
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
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
        {/* Back Button */}
        <Button variant="ghost" onClick={() => setSelectedRecord(null)}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Records
        </Button>

        {/* Patient Header */}
        <div className="text-white p-4 rounded-lg" style={{ backgroundColor: '#1c2f7f' }}>
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
        </div>

        {/* Record Content */}
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
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-1.5 text-left text-xs">Medicine</th>
                            <th className="border border-gray-300 p-1.5 text-center text-xs">M</th>
                            <th className="border border-gray-300 p-1.5 text-center text-xs">N</th>
                            <th className="border border-gray-300 p-1.5 text-center text-xs">E</th>
                            <th className="border border-gray-300 p-1.5 text-center text-xs">Nt</th>
                            <th className="border border-gray-300 p-1.5 text-center text-xs">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRecord.prescriptions.map((prescription, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 p-1.5 text-xs">{prescription.medicine}</td>
                              <td className="border border-gray-300 p-1.5 text-center text-xs">{prescription.morning}</td>
                              <td className="border border-gray-300 p-1.5 text-center text-xs">{prescription.noon}</td>
                              <td className="border border-gray-300 p-1.5 text-center text-xs">{prescription.evening}</td>
                              <td className="border border-gray-300 p-1.5 text-center text-xs">{prescription.night}</td>
                              <td className="border border-gray-300 p-1.5 text-center text-xs">{prescription.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {selectedRecord.prescriptions.map((prescription, index) => (
                        prescription.remarks && (
                          <div key={index} className="mt-2 text-xs text-muted-foreground">
                            <strong>Note:</strong> {prescription.remarks}
                          </div>
                        )
                      ))}
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
      {/* Back Button */}
      <Button variant="ghost" onClick={() => setSelectedPatient(null)}>
        <ArrowLeft size={16} className="mr-2" />
        Change Patient
      </Button>

      {/* Patient Header */}
      <div className="text-white p-4 rounded-lg" style={{ backgroundColor: '#1c2f7f' }}>
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
      </div>

      {/* AI Query Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bot size={20} className="text-primary" />
            <CardTitle>Ask 1hat AI about patient history</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask about patient's medical history, patterns, or specific conditions..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
              className="flex-1"
            />
            <Button 
              onClick={handleAiQuery}
              disabled={!aiQuery.trim() || isAiLoading}
              className="px-4"
            >
              {isAiLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
          
          {aiResponse && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Bot size={16} className="text-primary mt-1 flex-shrink-0" />
                <p className="text-sm">{aiResponse}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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