import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProtocolBuilder } from "@/components/protocol/ProtocolBuilder";
import { TreatmentPlanTab } from "@/components/protocol/TreatmentPlanTab";
import { PrescriptionTimelineNew } from "@/components/prescription/PrescriptionTimelineNew";
import { TreatmentTimelineNew } from "@/components/protocol/TreatmentTimelineNew";
import { PrescriptionRow } from "@/components/prescription/PrescriptionRow";
import { CreatePrescription } from "./CreatePrescription";
import { AddPatientDialog } from "@/components/AddPatientDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Phone, 
  Plus, 
  Calendar,
  FileText,
  Image,
  Edit,
  Eye,
  ArrowLeft
} from "lucide-react";
import patientGenericAvatar from "@/assets/patient-generic-avatar.jpg";
import patientClipart from "@/assets/patient-clipart.png";

// Mock treatment plan data for timeline
const mockTreatmentPlans = [
  {
    id: 1,
    name: "Knee Surgery Recovery Protocol",
    startDate: "2025-08-15",
    endDate: "2025-10-15",
    progress: 65,
    totalActivities: 4,
    completedActivities: 2,
    currentWeek: 4,
    totalWeeks: 8,
    status: "active",
    activities: [
      {
        id: 1,
        name: "Physiotherapy Knee Exercises",
        type: "Physiotherapy",
        activity: "Physiotherapy",
        subActivity: "Physiotherapy Knee Exercises",
        frequency: "Daily",
        duration: "30 min",
        completed: true,
        dueDate: "2025-08-21",
        description: "Range of motion exercises to improve knee flexibility",
        instructions: "Perform 3 sets of 10 repetitions, hold each position for 5 seconds",
        patientAction: "complete-exercise",
        doctorAction: "review-report",
        videoUrl: ""
      },
      {
        id: 2,
        name: "Follow-up Consultation",
        type: "Consultation",
        activity: "Consultation",
        subActivity: "Follow-up",
        frequency: "Weekly",
        duration: "30 min",
        completed: true,
        dueDate: "2025-08-20",
        description: "Regular check-up to monitor recovery progress",
        instructions: "Come prepared with any concerns or questions",
        patientAction: "book-appointment",
        doctorAction: "provide-feedback",
        videoUrl: ""
      },
      {
        id: 3,
        name: "Pain Management",
        type: "Medication",
        activity: "Medication",
        subActivity: "Oral Medication",
        frequency: "As needed",
        duration: "5 min",
        completed: false,
        dueDate: "2025-08-23",
        description: "Take prescribed medication for pain relief",
        instructions: "Take medication with food to prevent stomach upset",
        patientAction: "take-medication",
        doctorAction: "adjust-medication",
        videoUrl: ""
      },
      {
        id: 4,
        name: "Strength Building Exercises",
        type: "Exercise",
        activity: "Exercise",
        subActivity: "Strength Training",
        frequency: "3x per week",
        duration: "45 min",
        completed: false,
        dueDate: "2025-08-24",
        description: "Progressive strength training for leg muscles",
        instructions: "Start with light weights and gradually increase intensity",
        patientAction: "complete-exercise",
        doctorAction: "review-report",
        videoUrl: ""
      }
    ]
  }
];
const mockPrescriptions = [
  {
    id: "rx-001",
    diagnosis: "Post-operative knee surgery",
    intakeScore: 85,
    date: "2025-08-15",
    hasScannedCopy: true,
    medications: [
      {
        medicine: "Ibuprofen 400mg",
        morning: "1",
        noon: "0",
        evening: "1", 
        night: "0",
        duration: 7,
        timeToTake: "After food",
        remarks: "With meals to prevent stomach upset"
      },
      {
        medicine: "Paracetamol 500mg",
        morning: "1",
        noon: "1",
        evening: "1",
        night: "1",
        duration: 10,
        timeToTake: "Before food",
        remarks: "For pain management"
      }
    ]
  },
  {
    id: "rx-002", 
    diagnosis: "Hypertension management",
    intakeScore: 92,
    date: "2025-08-10",
    hasScannedCopy: false,
    medications: [
      {
        medicine: "Amlodipine 5mg",
        morning: "1",
        noon: "0",
        evening: "0",
        night: "0",
        duration: 30,
        timeToTake: "Before food",
        remarks: "Monitor blood pressure daily"
      }
    ]
  }
];

const patients = [
  {
    id: 1,
    name: "Arjun Patel",
    phone: "8954229999",
    adherence: 85,
    avatar: patientGenericAvatar,
    lastVisit: "Aug 4, 2025",
    diagnosis: "Fever",
    prescriptions: [
      {
        id: "P001",
        medicine: "Dolo",
        dosage: "1 Morning, 1 Night",
        duration: "4 days",
        hospital: "Guru Hospital"
      },
      {
        id: "P002",
        medicine: "Paracetamol",
        dosage: "500mg",
        duration: "3 days",
        hospital: "City General Hospital"
      },
      {
        id: "P003",
        medicine: "Amoxicillin",
        dosage: "250mg",
        duration: "7 days",
        hospital: "Metro Medical Center"
      }
    ],
    healthRecords: [
      { id: "H001", type: "pdf", name: "Medical Record - 2025-07-12", date: "Jun 17, 2025" },
      { id: "H002", type: "image", name: "X-Ray Report", date: "Jun 17, 2025" }
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "6382214165",
    adherence: 0,
    avatar: patientGenericAvatar,
    lastVisit: "Jul 25, 2025",
    diagnosis: "Knee Surgery Recovery",
    prescriptions: [],
    healthRecords: []
  },
  {
    id: 3,
    name: "Rahul Gupta",
    phone: "9488091926",
    adherence: 92,
    avatar: patientGenericAvatar,
    lastVisit: "Aug 1, 2025",
    diagnosis: "Physiotherapy",
    prescriptions: [],
    healthRecords: []
  },
  {
    id: 4,
    name: "Aisha Khan",
    phone: "7845692301",
    adherence: 0,
    diagnosis: "Hypertension Management",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 10, 2025",
    prescriptions: [],
    healthRecords: [
      { id: "H003", type: "pdf", name: "ECG Report - 2025-08-01", date: "Aug 1, 2025" }
    ]
  },
  {
    id: 5,
    name: "Vikram Singh",
    phone: "5123478906",
    adherence: 94,
    diagnosis: "Diabetes Type 2",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 15, 2025",
    prescriptions: [],
    healthRecords: []
  },
  {
    id: 6,
    name: "Kavya Reddy",
    phone: "3216549870",
    adherence: 0,
    diagnosis: "Asthma Management",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 12, 2025",
    prescriptions: [],
    healthRecords: [
      { id: "H004", type: "image", name: "Chest X-Ray", date: "Aug 5, 2025" }
    ]
  },
  {
    id: 7,
    name: "Deepak Joshi",
    phone: "9087456321",
    adherence: 45,
    diagnosis: "Post-Surgical Recovery",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 18, 2025",
    prescriptions: [],
    healthRecords: []
  },
  {
    id: 8,
    name: "Sneha Iyer",
    phone: "6547893210",
    adherence: 0,
    diagnosis: "Mental Health Support",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 20, 2025",
    prescriptions: [],
    healthRecords: [
      { id: "H005", type: "pdf", name: "Psychological Assessment", date: "Aug 10, 2025" }
    ]
  }
];

export default function PatientProtocols() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isPatientProfile = !!id;
  
  const [selectedPatient, setSelectedPatient] = useState(
    isPatientProfile ? patients.find(p => p.id.toString() === id) || patients[0] : patients[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showProtocolBuilder, setShowProtocolBuilder] = useState(false);
  const [showCreateRx, setShowCreateRx] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 80) return "bg-success";
    if (adherence >= 50) return "bg-warning";
    return "bg-destructive";
  };

  const handleSaveProtocol = (protocol: any) => {
    // In a real app, this would save to the backend
    console.log("Saving protocol:", protocol);
    setShowProtocolBuilder(false);
  };

  if (showCreateRx) {
    return (
      <CreatePrescription
        patientName={selectedPatient.name}
        patientPhone={selectedPatient.phone}
        onBack={() => setShowCreateRx(false)}
      />
    );
  }

  if (showProtocolBuilder) {
    return (
      <ProtocolBuilder
        patientName={selectedPatient.name}
        onSave={handleSaveProtocol}
        onCancel={() => setShowProtocolBuilder(false)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Patient Details</h1>
        <p className="text-muted-foreground">Manage patient treatment plans and prescriptions</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Patient List */}
        {!isPatientProfile && (
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <Button 
                  className="flex items-center space-x-2 w-full" 
                  style={{backgroundColor: '#1c2f7f'}}
                  onClick={() => setShowAddPatient(true)}
                >
                  <Plus size={16} />
                  <span>Add Patient</span>
                </Button>
              </div>
              <CardTitle className="flex items-center justify-between">
                <span>Patients ({patients.length})</span>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or mobile number"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredPatients.map((patient) => {
                  const adherenceColor = patient.adherence >= 80 ? 'bg-green-500' : 
                                       patient.adherence >= 60 ? 'bg-yellow-500' : 'bg-red-500';
                  
                  const adherenceTextColor = patient.adherence >= 80 ? 'text-green-600' : 
                                        patient.adherence >= 60 ? 'text-yellow-600' : 'text-red-600';
                  
                  return (
                    <div
                      key={patient.id}
                      className={`p-4 cursor-pointer transition-colors border-l-4 ${
                        selectedPatient.id === patient.id
                          ? "bg-primary/10 border-l-primary"
                          : "hover:bg-muted border-l-transparent"
                      }`}
                      onClick={() => {
                        if (isPatientProfile) {
                          setSelectedPatient(patient);
                        } else {
                          navigate(`/patient/${patient.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#26bc9f] flex items-center justify-center text-white font-medium text-sm">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">{patient.phone}</p>
                        </div>
                        <div className={`text-xs font-medium ${adherenceTextColor}`}>
                          {patient.adherence}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Patient Details */}
        <div className={isPatientProfile ? "col-span-12" : "col-span-9"}>
          <Card>
            <CardHeader>
              {isPatientProfile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/patient-protocols')}
                  className="w-fit mb-4"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Patient List
                </Button>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-full bg-[#26bc9f] flex items-center justify-center text-white font-bold text-2xl">
                    {selectedPatient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Phone size={12} />
                        <span>{selectedPatient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>Last visit: {selectedPatient.lastVisit}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  {/* Adherence Scores and Action Buttons - Right Aligned */}
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2"
                            strokeDasharray="85, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">85%</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-center">Rx Intake</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            strokeDasharray={`${selectedPatient.adherence}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{selectedPatient.adherence}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-center">Treatment<br/>Adherence</p>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        style={{backgroundColor: '#1c2f7f'}} 
                        className="hover:opacity-90"
                        onClick={() => setShowCreateRx(true)}
                      >
                        <Plus size={14} className="mr-2" />
                        Create Rx
                      </Button>
                      <Button onClick={() => setShowProtocolBuilder(true)} size="sm" style={{backgroundColor: '#1c2f7f'}} className="hover:opacity-90">
                        <Plus size={14} className="mr-2" />
                        Create Treatment Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="prescriptions" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="prescriptions">Rx</TabsTrigger>
                  <TabsTrigger value="treatment-plan">Treatment Plan</TabsTrigger>
                  <TabsTrigger value="health-records">Shared Health Records</TabsTrigger>
                </TabsList>
                
                <TabsContent value="prescriptions" className="space-y-4">
                  <PrescriptionTimelineNew prescriptions={mockPrescriptions} />
                </TabsContent>
                
                <TabsContent value="treatment-plan" className="space-y-4">
                  <TreatmentTimelineNew protocols={mockTreatmentPlans} />
                </TabsContent>
                
                <TabsContent value="health-records" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Shared Health Records</h3>
                    <Button variant="outline" size="sm">
                      <Plus size={16} className="mr-2" />
                      Upload Record
                    </Button>
                  </div>
                  
                  {selectedPatient.healthRecords.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPatient.healthRecords.map((record) => (
                        <Card key={record.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-muted rounded-lg">
                                {record.type === "pdf" ? (
                                  <FileText size={20} className="text-primary" />
                                ) : (
                                  <Image size={20} className="text-primary" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{record.name}</h4>
                                <p className="text-sm text-muted-foreground">{record.date}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye size={14} className="mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No health records shared</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AddPatientDialog
        open={showAddPatient}
        onOpenChange={setShowAddPatient}
      />
    </div>
  );
}