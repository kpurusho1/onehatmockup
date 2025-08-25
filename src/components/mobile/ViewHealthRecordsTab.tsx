import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import NotificationRecordView from "./NotificationRecordView";
import MedicalSummaryView from "@/components/shared/MedicalSummaryView";
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

export default function ViewHealthRecordsTab({ fromNotification, notificationData }: { fromNotification?: boolean, notificationData?: any } = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showNotificationRecord, setShowNotificationRecord] = useState(fromNotification || false);

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

  // Handle notification record view
  if (showNotificationRecord && notificationData) {
    return (
      <NotificationRecordView
        patientName={notificationData.patientName}
        recordId={notificationData.recordId}
        onBack={() => setShowNotificationRecord(false)}
      />
    );
  }

  if (!selectedPatient) {
    return (
      <div className="relative pb-24">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b p-4">
          <h1 className="text-xl font-semibold">Patient Details</h1>
        </div>

        <div className="p-4 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">View Health Records</h2>
            <p className="text-muted-foreground">Select a patient to view their records</p>
          </div>

          {/* AI Query Section for Cross-Patient History */}
          <div className="p-4 border-2 border-transparent bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg"></div>
            <div className="absolute inset-[2px] bg-background rounded-lg"></div>
            <div className="relative">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <h3 className="font-medium text-lg">Ask 1hat AI about patient history</h3>
              </div>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search across all patients for conditions, treatments, patterns..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                    className="flex-1 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-transparent"
                  />
                  <Button 
                    onClick={handleAiQuery}
                    disabled={!aiQuery.trim() || isAiLoading}
                    className="px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isAiLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Send size={16} />
                    )}
                  </Button>
                </div>
                
                {aiResponse && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-4 border border-blue-200/30">
                    <div className="flex items-start space-x-2">
                      <Bot size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {aiResponse}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
      </div>
    );
  }

  if (selectedRecord) {
    // Convert record to MedicalSummaryView format
    const medicalRecord = {
      id: selectedRecord.id,
      patientId: selectedPatient!.id,
      keyFacts: `Consultation on ${selectedRecord.date}. ${selectedRecord.diagnosis || 'No specific diagnosis recorded.'}`,
      medications: selectedRecord.prescriptions?.map(p => ({
        id: p.medicine,
        name: p.medicine,
        morning: p.morning,
        noon: p.noon,
        evening: p.evening,
        night: p.night,
        duration: parseInt(p.duration) || 0,
        timeToTake: p.timeToTake,
        remarks: p.remarks
      })) || [],
      nextSteps: "Follow up as needed.",
      recordDate: selectedRecord.date
    };

    return (
      <MedicalSummaryView
        medicalRecord={medicalRecord}
        diagnosis={selectedRecord.diagnosis || "No diagnosis recorded"}
        onBack={() => setSelectedRecord(null)}
        onSave={() => {}}
        onSend={() => {}}
        patientName={selectedPatient!.name}
        recordId={selectedRecord.id}
        date={selectedRecord.date}
        isEditable={true}
        showCreateRx={true}
      />
    );
  }

  // Rest of the component would go here for other patient records view
  return null;
}