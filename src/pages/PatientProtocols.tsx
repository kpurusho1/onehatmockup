import { useState } from "react";
import { ProtocolBuilder } from "@/components/protocol/ProtocolBuilder";
import { TreatmentPlanTab } from "@/components/protocol/TreatmentPlanTab";
import { PrescriptionTimeline } from "@/components/prescription/PrescriptionTimeline";
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
  Eye
} from "lucide-react";
import patientGenericAvatar from "@/assets/patient-generic-avatar.jpg";

const patients = [
  {
    id: 1,
    name: "Parivel",
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
    name: "Ashwin",
    phone: "6382214165",
    adherence: 33,
    avatar: patientGenericAvatar,
    lastVisit: "Jul 25, 2025",
    diagnosis: "Knee Surgery Recovery",
    prescriptions: [
      {
        id: "P004",
        medicine: "Ibuprofen",
        dosage: "400mg",
        duration: "5 days",
        hospital: "Orthopedic Clinic"
      },
      {
        id: "P005",
        medicine: "Physiotherapy",
        dosage: "Daily session",
        duration: "2 weeks",
        hospital: "Rehab Center"
      }
    ],
    healthRecords: []
  },
  {
    id: 3,
    name: "Visveshwar",
    phone: "9488091926",
    adherence: 92,
    avatar: patientGenericAvatar,
    lastVisit: "Aug 1, 2025",
    diagnosis: "Physiotherapy",
    prescriptions: [
      {
        id: "P006",
        medicine: "Muscle Relaxant",
        dosage: "10mg",
        duration: "10 days",
        hospital: "Sports Medicine Clinic"
      },
      {
        id: "P007",
        medicine: "Calcium Supplement",
        dosage: "500mg",
        duration: "1 month",
        hospital: "Wellness Center"
      },
      {
        id: "P008",
        medicine: "Vitamin D3",
        dosage: "1000 IU",
        duration: "3 months",
        hospital: "Nutrition Clinic"
      }
    ],
    healthRecords: []
  },
  {
    id: 4,
    name: "Sarah Johnson",
    phone: "7845692301",
    adherence: 78,
    diagnosis: "Hypertension Management",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 10, 2025",
    prescriptions: [
      {
        id: "P009",
        medicine: "Lisinopril",
        dosage: "10mg",
        duration: "30 days",
        hospital: "Cardiac Care Center"
      },
      {
        id: "P010",
        medicine: "Amlodipine",
        dosage: "5mg",
        duration: "30 days",
        hospital: "Heart Health Clinic"
      }
    ],
    healthRecords: [
      { id: "H003", type: "pdf", name: "ECG Report - 2025-08-01", date: "Aug 1, 2025" }
    ]
  },
  {
    id: 5,
    name: "Michael Chen",
    phone: "5123478906",
    adherence: 94,
    diagnosis: "Diabetes Type 2",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 15, 2025",
    prescriptions: [
      {
        id: "P011",
        medicine: "Metformin",
        dosage: "500mg",
        duration: "60 days",
        hospital: "Endocrine Clinic"
      },
      {
        id: "P012",
        medicine: "Glipizide",
        dosage: "5mg",
        duration: "30 days",
        hospital: "Diabetes Center"
      },
      {
        id: "P013",
        medicine: "Insulin Glargine",
        dosage: "20 units",
        duration: "30 days",
        hospital: "Diabetes Center"
      }
    ],
    healthRecords: []
  },
  {
    id: 6,
    name: "Emily Rodriguez",
    phone: "3216549870",
    adherence: 67,
    diagnosis: "Asthma Management",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 12, 2025",
    prescriptions: [
      {
        id: "P014",
        medicine: "Albuterol Inhaler",
        dosage: "2 puffs",
        duration: "30 days",
        hospital: "Respiratory Care Center"
      },
      {
        id: "P015",
        medicine: "Fluticasone",
        dosage: "110mcg",
        duration: "30 days",
        hospital: "Allergy & Asthma Clinic"
      }
    ],
    healthRecords: [
      { id: "H004", type: "image", name: "Chest X-Ray", date: "Aug 5, 2025" }
    ]
  },
  {
    id: 7,
    name: "David Thompson",
    phone: "9087456321",
    adherence: 45,
    diagnosis: "Post-Surgical Recovery",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 18, 2025",
    prescriptions: [
      {
        id: "P016",
        medicine: "Oxycodone",
        dosage: "5mg",
        duration: "7 days",
        hospital: "General Surgery Center"
      },
      {
        id: "P017",
        medicine: "Cephalexin",
        dosage: "500mg",
        duration: "10 days",
        hospital: "Post-Op Care Unit"
      },
      {
        id: "P018",
        medicine: "Ibuprofen",
        dosage: "600mg",
        duration: "14 days",
        hospital: "Pain Management Clinic"
      }
    ],
    healthRecords: []
  },
  {
    id: 8,
    name: "Lisa Wang",
    phone: "6547893210",
    adherence: 88,
    diagnosis: "Mental Health Support",
    avatar: patientGenericAvatar,
    lastVisit: "Aug 20, 2025",
    prescriptions: [
      {
        id: "P019",
        medicine: "Sertraline",
        dosage: "50mg",
        duration: "90 days",
        hospital: "Mental Health Center"
      },
      {
        id: "P020",
        medicine: "Lorazepam",
        dosage: "0.5mg",
        duration: "30 days",
        hospital: "Anxiety Clinic"
      }
    ],
    healthRecords: [
      { id: "H005", type: "pdf", name: "Psychological Assessment", date: "Aug 10, 2025" }
    ]
  }
];

export default function PatientProtocols() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProtocolBuilder, setShowProtocolBuilder] = useState(false);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Details</h1>
          <p className="text-muted-foreground">Manage patient treatment plans and prescriptions</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Patient</span>
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Patient List */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
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
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-4 cursor-pointer transition-colors border-l-4 ${
                      selectedPatient.id === patient.id
                        ? "bg-primary/10 border-l-primary"
                        : "hover:bg-muted border-l-transparent"
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">{patient.diagnosis}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Details */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedPatient.avatar} />
                    <AvatarFallback>{selectedPatient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
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
                <div className="flex space-x-2">
                  <Button>Create e-prescription</Button>
                </div>
              </div>
              
              <div className="flex items-center mt-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Protocol Adherence</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${getAdherenceColor(selectedPatient.adherence)}`} />
                    <span className="font-bold">{selectedPatient.adherence}% Score</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="prescriptions" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  <TabsTrigger value="treatment-plan">Treatment Plan</TabsTrigger>
                  <TabsTrigger value="health-records">Shared Health Records</TabsTrigger>
                </TabsList>
                
                <TabsContent value="prescriptions" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">My Prescriptions</h3>
                    <Button variant="outline" size="sm">
                      <Plus size={16} className="mr-2" />
                      New Prescription
                    </Button>
                  </div>
                  
                  <PrescriptionTimeline 
                    prescriptions={selectedPatient.prescriptions.map((prescription, index) => ({
                      id: prescription.id,
                      date: `Dec ${15 - index}, 2024`,
                      time: `${2 + index}:30 PM`,
                      hospital: prescription.hospital,
                      location: "Medical Center",
                      diagnosis: selectedPatient.diagnosis,
                      medications: [
                        {
                          id: `m${index + 1}`,
                          name: prescription.medicine,
                          dosage: prescription.dosage,
                          frequency: "As prescribed",
                          duration: prescription.duration,
                          instructions: "Take as directed"
                        }
                      ]
                    }))} 
                  />
                </TabsContent>
                
                <TabsContent value="treatment-plan" className="space-y-4">
                  <TreatmentPlanTab 
                    patient={selectedPatient}
                    onCreateProtocol={() => setShowProtocolBuilder(true)}
                  />
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
    </div>
  );
}